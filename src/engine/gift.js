import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { chocolateShape } from '../content/shapes.js';

const smooth = (value) => { const x = THREE.MathUtils.clamp(value, 0, 1); return x * x * (3 - 2 * x); };

function heartHalf(sign) {
  const shape = new THREE.Shape();
  const start = sign === 1 ? 0 : Math.PI;
  for (let i = 0; i <= 48; i++) {
    const t = start + i / 48 * Math.PI;
    const x = Math.pow(Math.sin(t), 3) * .65;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17 * .65;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function extruded(shape, depth, material, bevel = .01) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelSegments: 2, steps: 1,
    bevelSize: bevel, bevelThickness: bevel, curveSegments: 20,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}


function createMaterials() {
  const red = new THREE.MeshStandardMaterial({ color: '#6b1735', roughness: .5, metalness: .12 });
  const gold = new THREE.MeshStandardMaterial({ color: '#c9a35e', roughness: .35, metalness: .65 });
  const liner = new THREE.MeshStandardMaterial({ color: '#e7cda6', roughness: .95 });
  const paper = new THREE.MeshStandardMaterial({ color: '#baa087', roughness: .95 });
  const dark = new THREE.MeshStandardMaterial({ color: '#321b16', roughness: .35, metalness: .05 });
  return { red, gold, liner, paper, dark };
}

function createHalves(group, { red, gold, liner }) {
  const halves = [];
  const lids = [];
  for (const sign of [-1, 1]) {
    const half = new THREE.Group();
    half.name = sign < 0 ? 'heart_half_left' : 'heart_half_right';
    group.add(half);
    const shape = heartHalf(sign);
    const bottom = extruded(shape, .07, red);
    half.add(bottom);
    const edge = extruded(shape, .008, gold, .005);
    edge.position.y = .075;
    half.add(edge);
    const interior = extruded(shape, .01, liner, .004);
    interior.scale.setScalar(.96);
    interior.position.y = .084;
    half.add(interior);
    const lidPivot = new THREE.Group();
    lidPivot.position.x = sign * .65;
    const lid = extruded(shape, .045, red);
    lid.position.x = -sign * .65;
    lidPivot.position.y = .13;
    lidPivot.add(lid);
    const rim = extruded(shape, .003, gold, .004);
    rim.position.set(-sign * .65, .05, 0);
    lidPivot.add(rim);
    half.add(lidPivot);
    halves.push(half);
    lids.push(lidPivot);
  }
  return { halves, lids };
}

function createPieces(items, halves, { paper, dark }) {
  const pieces = new Map();
  const pickables = [];
  const positions = [[.28, -.32], [.46, -.1], [.21, -.09], [.37, .13], [.14, .13], [.23, .32], [.095, .43]];
  const svg = new SVGLoader();
  for (const item of items) {
    const halfIndex = item.half === 'left' ? 0 : 1;
    const sign = halfIndex === 0 ? -1 : 1;
    const [x, z] = positions[(Number(item.id.slice(1)) - 1) % 7];
    const piece = new THREE.Group();
    piece.name = 'chocolate_' + item.id;
    piece.rotation.y = Math.PI;
    piece.position.set(sign * x, .105, z);
    const shapes = svg.parse('<svg xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="' + chocolateShape(item.id) + '"/></svg>').paths[0].toShapes();
    for (const shape of shapes) {
      const socket = extruded(shape, 2, paper, 2);
      socket.scale.setScalar(.00165);
      socket.position.set(-.0825, -.006, .0825);
      piece.add(socket);
      const mesh = extruded(shape, 14, dark, 3);
      mesh.scale.setScalar(.00145);
      mesh.position.set(-.0725, 0, .0725);
      piece.add(mesh);
      const contour = shape.getPoints(24).map((point) => new THREE.Vector3((point.x - 50) * .00125, .027, (50 - point.y) * .00125));
      piece.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(contour), new THREE.LineBasicMaterial({ color: '#b88f54' })));
    }
    // One proxy per chocolate. Visible geometry can have holes or multiple submeshes.
    const proxy = new THREE.Mesh(new THREE.BoxGeometry(.17, .07, .17), new THREE.MeshBasicMaterial({ visible: false }));
    proxy.name = 'pick_' + item.id;
    proxy.userData.id = item.id;
    proxy.position.y = .025;
    piece.add(proxy);
    halves[halfIndex].add(piece);
    pieces.set(item.id, piece);
    pickables.push(proxy);
  }
  return { pieces, pickables };
}

function poseGift(halves, lids, time) {
    const placed = smooth((time - .9) / 1.2);
    const joined = smooth((time - 2.1) / 1.35);
    const opened = smooth((time - 3.6) / 1.6);
    halves.forEach((half, index) => {
      const sign = index === 0 ? -1 : 1;
      half.position.x = joined === 1 ? 0 : sign * .15 * (1 - joined);
      half.position.y = .15 * (1 - placed);
      lids[index].rotation.z = -sign * opened * Math.PI * .8;
    });
  }

export function createGift(items) {
  const group = new THREE.Group();
  group.name = 'Valentine_HeartGift';
  group.position.set(0, 1.02, .18);
  const materials = createMaterials();
  const { halves, lids } = createHalves(group, materials);
  const { pieces, pickables } = createPieces(items, halves, materials);
  const pose = (time) => poseGift(halves, lids, time);
  function highlight(id) {
    for (const [key, piece] of pieces) piece.position.y = key === id ? .15 : .105;
  }
  pose(0);
  return { group, pose, highlight, pickables, pieces };
}
