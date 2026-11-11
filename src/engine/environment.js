import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

function geometryTools(objects) {
  const cache = new Map();
  const mat = (color, roughness = .8, metalness = 0) => {
    const key = [color, roughness, metalness].join(':');
    if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
    return cache.get(key);
  };
  function mesh(geometry, material, position, parent = objects) {
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(...position);
    obj.castShadow = true;
    obj.receiveShadow = true;
    parent.add(obj);
    return obj;
  }
  function bar(from, to, radius, material, parent = objects) {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const obj = mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 8), material, a.clone().add(b).multiplyScalar(.5).toArray(), parent);
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
    return obj;
  }
  return { mat, mesh, bar };
}

function addFloor({ mesh, mat }) {
  const stone = mat('#decbbd');
  const brass = mat('#af8052', .4, .55);
  const floor = mesh(new THREE.CylinderGeometry(3.5, 3.65, .18, 64), stone, [0, -.1, 0]);
  floor.receiveShadow = true;
  // Subtle tile joints, no additional texture downloads.
  for (let i = -3; i <= 3; i++) {
    mesh(new THREE.BoxGeometry(6.5, .002, .008), mat('#c4afa4'), [0, .002, i * .75]);
    mesh(new THREE.BoxGeometry(.008, .002, 6.5), mat('#c4afa4'), [i * .75, .002, 0]);
  }
  mesh(new THREE.CylinderGeometry(.92, .92, .065, 64), mat('#f0dcc7', .45), [0, .975, .18]);
  mesh(new THREE.CylinderGeometry(.032, .065, .93, 16), brass, [0, .49, .18]);
  mesh(new THREE.CylinderGeometry(.38, .4, .04, 48), brass, [0, .02, .18]);
  mesh(new THREE.TorusGeometry(.918, .012, 8, 64), brass, [0, .98, .18]).rotation.x = Math.PI / 2;
}

function addRailings({ bar, mat }) {
  const brass = mat('#af8052', .4, .55);
  for (let i = 0; i < 14; i++) {
    const x = -3.25 + i * .5;
    bar([x, 0, -1.65], [x, 1, -1.65], .018, brass);
  }
  bar([-3.25, 1, -1.65], [3.25, 1, -1.65], .028, brass);
  bar([-3.25, .2, -1.65], [3.25, .2, -1.65], .018, brass);
}

function addGarden({ mesh, bar, mat }) {
  const timber = mat('#4d353b');
  const leaf = mat('#344e3e');
  const leafLight = mat('#58745a');
  const rose = mat('#b65365');
  const clay = mat('#78524d');
  // A light pergola frames the couple, with an open view towards the city.
  for (const x of [-1.72, 1.72]) {
    bar([x, 0, -.93], [x, 2.6, -.93], .045, timber);
  }
  bar([-1.76, 2.6, -.93], [1.76, 2.6, -.93], .055, timber);
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#ffe4a4', emissive: '#ffbf6e', emissiveIntensity: 3 });
  for (let i = 0; i < 17; i++) {
    const x = -1.65 + i * 3.3 / 16;
    const y = 2.52 - .22 * (1 - Math.pow(x / 1.65, 2));
    mesh(new THREE.SphereGeometry(.025, 8, 6), bulbMat, [x, y, -.91]);
    if (i < 16) {
      const nx = x + 3.3 / 16;
      const ny = 2.52 - .22 * (1 - Math.pow(nx / 1.65, 2));
      bar([x, y + .03, -.91], [nx, ny + .03, -.91], .004, timber);
    }
  }
  for (const sign of [-1, 1]) {
    mesh(new THREE.CylinderGeometry(.24, .18, .38, 16), clay, [sign * 1.65, .19, -.8]);
    for (let i = 0; i < 21; i++) {
      const x = sign * (1.68 + Math.sin(i * 2.4) * .18);
      const y = .5 + i / 21 * 2.1;
      const z = -.9 + Math.cos(i * 1.7) * .13;
      const foliage = mesh(new THREE.SphereGeometry(.13, 8, 6), i % 2 ? leaf : leafLight, [x, y, z]);
      foliage.scale.set(.7, 1.4, .5);
      foliage.rotation.z = Math.sin(i * 1.7);
      if (i % 3 === 0) {
        const flower = mesh(new THREE.SphereGeometry(.075, 8, 6), rose, [x - sign * .08, y, z + .09]);
        flower.scale.y = .65;
      }
    }
  }
}

function addCity({ mesh, mat }) {
  // Distant skyline: seeded arithmetic, consistent on every visit.
  const city = mat('#4b405c');
  for (let i = 0; i < 24; i++) {
    const height = .4 + ((i * 37) % 13) / 10;
    const x = (i - 11.5) * .46;
    mesh(new THREE.BoxGeometry(.32, height, .3), city, [x, height / 2 - .35, -4.2 - (i % 3) * .25]);
    const windows = mat(i % 2 ? '#bf946d' : '#d5b28a');
    for (let j = 0; j < Math.floor(height / .22); j++) {
      mesh(new THREE.PlaneGeometry(.04, .065), windows, [x - .07, j * .22, -4.03 - (i % 3) * .25]);
    }
  }
}

function addLighting(scene) {
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 2; skyCanvas.height = 256;
  const ctx = skyCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, '#292640'); gradient.addColorStop(.55, '#7d5a76'); gradient.addColorStop(1, '#e2a08c');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 2, 256);
  const sky = new THREE.CanvasTexture(skyCanvas);
  sky.colorSpace = THREE.SRGBColorSpace;
  scene.background = sky;
  scene.add(new THREE.HemisphereLight('#ffe7d0', '#6c5365', 2));
  const key = new THREE.DirectionalLight('#ffe9d4', 3);
  key.position.set(-2, 5, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -3; key.shadow.camera.right = 3;
  key.shadow.camera.top = 3; key.shadow.camera.bottom = -3;
  key.shadow.normalBias = .03;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#a7baff', 1);
  fill.position.set(3, 2, -3); scene.add(fill);
  return sky;
}

function batchEnvironment(objects) {
  // All environment geometry is static: merge by shared material to reduce draw calls.
  objects.updateMatrixWorld(true);
  const batches = new Map();
  for (const obj of [...objects.children]) {
    if (!obj.isMesh) continue;
    const geometry = obj.geometry.clone().applyMatrix4(obj.matrixWorld);
    if (!batches.has(obj.material)) batches.set(obj.material, []);
    batches.get(obj.material).push(geometry);
    obj.geometry.dispose();
    objects.remove(obj);
  }
  for (const [material, geometries] of batches) {
    const geometry = mergeGeometries(geometries);
    geometries.forEach((item) => item.dispose());
    if (!geometry) throw new Error('Could not batch environment geometry');
    const batch = new THREE.Mesh(geometry, material);
    batch.name = 'GardenBatch';
    batch.castShadow = true;
    batch.receiveShadow = true;
    objects.add(batch);
  }
}

export function createEnvironment(scene) {
  const objects = new THREE.Group();
  scene.add(objects);
  const tools = geometryTools(objects);
  addFloor(tools);
  addRailings(tools);
  addGarden(tools);
  addCity(tools);
  const sky = addLighting(scene);
  batchEnvironment(objects);
  return { objects, sky };
}
