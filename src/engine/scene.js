import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createEnvironment } from './environment.js';
import { createGift } from './gift.js';

const ease = (x) => { const t = THREE.MathUtils.clamp(x, 0, 1); return t * t * (3 - 2 * t); };

export async function createStage(canvas, items, { onSelect, onContextLost, signal } = {}) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const camera = new THREE.OrthographicCamera(-3, 3, 2, -2, .1, 80);
  const environment = createEnvironment(scene);
  const gift = createGift(items);
  scene.add(gift.group);
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const characters = [];
  const mixers = [];
  let disposed = false;
  let reduced = false;
  let frameId;
  let running = null;
  let view = 0;
  let storyTime = 0;
  let selectionEnabled = false;
  let last = performance.now();
  const look = new THREE.Vector3();
  const startPosition = new THREE.Vector3(2.2, 2.5, 5.4);
  const endPosition = new THREE.Vector3(0, 3.8, 1.35);
  const startTarget = new THREE.Vector3(0, 1.15, -.05);
  const endTarget = new THREE.Vector3(0, 1.08, .18);
  let width = 1, height = 1;

  function fit() {
    const aspect = width / height;
    const overviewHeight = Math.max(1.45, 2.1 / aspect);
    const exploreHeight = Math.max(.77, .88 / aspect);
    const halfHeight = THREE.MathUtils.lerp(overviewHeight, exploreHeight, view);
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.position.copy(startPosition).lerp(endPosition, view);
    look.copy(startTarget).lerp(endTarget, view);
    camera.lookAt(look);
    camera.updateProjectionMatrix();
  }
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    fit();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  resize();

  function apply() {
    gift.pose(storyTime);
    for (const { mixer, action } of mixers) {
      action.paused = false;
      action.enabled = true;
      mixer.setTime(Math.min(storyTime, 219 / 30));
    }
    fit();
  }
  function cancel() {
    if (running) { running.resolve(false); running = null; }
  }
  function transition(duration, update) {
    cancel();
    if (reduced) { update(1); apply(); return Promise.resolve(true); }
    return new Promise((resolve) => { running = { elapsed: 0, duration, update, resolve }; });
  }
  function loop(now) {
    if (disposed) return;
    frameId = requestAnimationFrame(loop);
    const delta = Math.min((now - last) / 1000, .05);
    last = now;
    if (document.hidden) return;
    if (running) {
      const current = running;
      current.elapsed += delta;
      const progress = Math.min(1, current.elapsed / current.duration);
      current.update(progress);
      apply();
      if (progress === 1 && running === current) { running = null; current.resolve(true); }
    }
    renderer.render(scene, camera);
  }
  frameId = requestAnimationFrame(loop);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function hit(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(gift.pickables, false)[0]?.object.userData.id;
  }
  function click(event) { if (selectionEnabled) { const id = hit(event); if (id) onSelect?.(id); } }
  function move(event) {
    canvas.style.cursor = selectionEnabled && hit(event) ? 'pointer' : 'default';
  }
  function contextLost(event) { event.preventDefault(); onContextLost?.(); }
  canvas.addEventListener('click', click);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('webglcontextlost', contextLost);
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    cancel();
    observer.disconnect();
    canvas.removeEventListener('click', click);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('webglcontextlost', contextLost);
    const geometries = new Set(), materials = new Set(), textures = new Set(), skeletons = new Set();
    scene.traverse((obj) => {
      if (obj.geometry) geometries.add(obj.geometry);
      if (obj.skeleton) skeletons.add(obj.skeleton);
      for (const material of obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : []) {
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    skeletons.forEach((skeleton) => skeleton.dispose());
    environment.sky.dispose();
    mixers.forEach(({ mixer }) => { mixer.stopAllAction(); mixer.uncacheRoot(mixer.getRoot()); });
    renderer.dispose();
  }
  signal?.addEventListener('abort', dispose, { once: true });
  try {
    for (const [index, name] of ['male', 'female'].entries()) {
      const gltf = await loader.loadAsync(import.meta.env.BASE_URL + 'models/characters/' + name + '-valentine.glb');
      if (signal?.aborted) {
        gltf.scene.traverse((obj) => {
          obj.geometry?.dispose();
          for (const mat of obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : []) {
            for (const value of Object.values(mat)) if (value?.isTexture) value.dispose();
            mat.dispose();
          }
        });
        throw new DOMException('Cancelled', 'AbortError');
      }
      const character = gltf.scene;
      character.name = name;
      character.scale.setScalar(index === 0 ? 1 : .97);
      character.position.set(index === 0 ? -.47 : .47, 0, -.5);
      character.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          obj.frustumCulled = false;
        }
      });
      scene.add(character);
      characters.push(character);
      const mixer = new THREE.AnimationMixer(character);
      const clip = gltf.animations[0];
      if (!clip) throw new Error('Missing character animation: ' + name);
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      mixers.push({ mixer, action });
    }
    apply();
  } catch (error) {
    dispose();
    throw error;
  }
  return {
    async start() {
      selectionEnabled = false;
      storyTime = 0; view = 0;
      return transition(9, (p) => {
        storyTime = Math.min(p * 9, 7.3);
        view = ease((p * 9 - 6.5) / 2.5);
      });
    },
    async finale() {
      selectionEnabled = false;
      const from = view;
      return transition(2.4, (p) => {
        view = THREE.MathUtils.lerp(from, 0, ease(p));
        characters.forEach((obj, index) => { obj.position.x = (index === 0 ? -1 : 1) * THREE.MathUtils.lerp(.47, .33, ease(p)); });
      });
    },
    explore() {
      cancel(); storyTime = 7.3; view = 1; selectionEnabled = true;
      characters.forEach((obj, i) => { obj.position.x = i === 0 ? -.47 : .47; });
      apply();
    },
    reset() {
      cancel(); storyTime = 0; view = 0; selectionEnabled = false;
      characters.forEach((obj, i) => { obj.position.x = i === 0 ? -.47 : .47; });
      apply();
    },
    setMotion(value) {
      reduced = value;
      if (reduced && running) {
        const current = running;
        current.update(1); running = null; apply(); current.resolve(true);
      }
    },
    setSelectable(value) { selectionEnabled = value; },
    highlight: gift.highlight,
    dispose,
    stats: () => ({ ...renderer.info.render, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures }),
  };
}
