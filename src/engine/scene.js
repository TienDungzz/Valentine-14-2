import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createEnvironment } from './environment.js';
import { createGift } from './gift.js';

const ease = (value) => {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

function createState(canvas, items, options) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  return {
    canvas, scene, renderer, ...options,
    camera: new THREE.OrthographicCamera(-3, 3, 2, -2, .1, 80),
    environment: createEnvironment(scene), gift: createGift(items),
    characters: [], mixers: [], disposed: false, reduced: false,
    running: null, view: 0, storyTime: 0, selectionEnabled: false,
    last: performance.now(), width: 1, height: 1,
    raycaster: new THREE.Raycaster(), pointer: new THREE.Vector2(),
  };
}

function fit(state) {
  const { camera, width, height, view } = state;
  const aspect = width / height;
  const halfHeight = THREE.MathUtils.lerp(Math.max(1.45, 2.1 / aspect), Math.max(.77, .88 / aspect), view);
  camera.left = -halfHeight * aspect;
  camera.right = halfHeight * aspect;
  camera.top = halfHeight;
  camera.bottom = -halfHeight;
  camera.position.set(2.2, 2.5, 5.4).lerp(new THREE.Vector3(0, 3.8, 1.35), view);
  const target = new THREE.Vector3(0, 1.15, -.05).lerp(new THREE.Vector3(0, 1.08, .18), view);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
}

function resize(state) {
  const rect = state.canvas.parentElement.getBoundingClientRect();
  state.width = Math.max(1, rect.width);
  state.height = Math.max(1, rect.height);
  state.renderer.setSize(state.width, state.height, false);
  fit(state);
}

function apply(state) {
  state.gift.pose(state.storyTime);
  for (const { mixer, action } of state.mixers) {
    action.paused = false;
    action.enabled = true;
    mixer.setTime(Math.min(state.storyTime, 219 / 30));
  }
  fit(state);
}

function cancel(state) {
  if (!state.running) return;
  state.running.resolve(false);
  state.running = null;
}

function transition(state, duration, update) {
  cancel(state);
  if (state.reduced) {
    update(1);
    apply(state);
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    state.running = { elapsed: 0, duration, update, resolve };
  });
}

function tick(state, now) {
  if (state.disposed) return;
  state.frameId = requestAnimationFrame((time) => tick(state, time));
  const delta = Math.min((now - state.last) / 1000, .05);
  state.last = now;
  if (document.hidden) return;
  const current = state.running;
  if (current) {
    current.elapsed += delta;
    const progress = Math.min(1, current.elapsed / current.duration);
    current.update(progress);
    apply(state);
    if (progress === 1 && state.running === current) {
      state.running = null;
      current.resolve(true);
    }
  }
  state.renderer.render(state.scene, state.camera);
}

function hit(state, event) {
  const rect = state.canvas.getBoundingClientRect();
  state.pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
  state.raycaster.setFromCamera(state.pointer, state.camera);
  return state.raycaster.intersectObjects(state.gift.pickables, false)[0]?.object.userData.id;
}

function attachInput(state) {
  const click = (event) => {
    if (!state.selectionEnabled) return;
    const id = hit(state, event);
    if (id) state.onSelect?.(id);
  };
  const move = (event) => {
    state.canvas.style.cursor = state.selectionEnabled && hit(state, event) ? 'pointer' : 'default';
  };
  const lost = (event) => {
    event.preventDefault();
    state.onContextLost?.();
  };
  state.canvas.addEventListener('click', click);
  state.canvas.addEventListener('pointermove', move);
  state.canvas.addEventListener('webglcontextlost', lost);
  state.stopInput = () => {
    state.canvas.removeEventListener('click', click);
    state.canvas.removeEventListener('pointermove', move);
    state.canvas.removeEventListener('webglcontextlost', lost);
  };
}

function disposeGraph(root) {
  const geometries = new Set(), materials = new Set(), textures = new Set(), skeletons = new Set();
  root.traverse((obj) => {
    if (obj.geometry) geometries.add(obj.geometry);
    if (obj.skeleton) skeletons.add(obj.skeleton);
    const owned = obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
    for (const material of owned) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
  skeletons.forEach((skeleton) => skeleton.dispose());
}

function disposeStage(state) {
  if (state.disposed) return;
  state.disposed = true;
  cancelAnimationFrame(state.frameId);
  cancel(state);
  state.observer?.disconnect();
  state.stopInput?.();
  disposeGraph(state.scene);
  state.environment.sky.dispose();
  state.mixers.forEach(({ mixer }) => {
    mixer.stopAllAction();
    mixer.uncacheRoot(mixer.getRoot());
  });
  state.renderer.dispose();
}

async function loadCharacters(state) {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  for (const [index, name] of ['male', 'female'].entries()) {
    const gltf = await loader.loadAsync(import.meta.env.BASE_URL + 'models/characters/' + name + '-valentine.glb');
    if (state.signal?.aborted) {
      disposeGraph(gltf.scene);
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
    state.scene.add(character);
    state.characters.push(character);
    const mixer = new THREE.AnimationMixer(character);
    const clip = gltf.animations[0];
    if (!clip) throw new Error('Missing character animation: ' + name);
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    state.mixers.push({ mixer, action });
  }
}

function setPose(state, explore) {
  cancel(state);
  state.storyTime = explore ? 7.3 : 0;
  state.view = explore ? 1 : 0;
  state.selectionEnabled = explore;
  state.characters.forEach((obj, index) => {
    obj.position.x = index === 0 ? -.47 : .47;
  });
  apply(state);
}

function setMotion(state, value) {
  state.reduced = value;
  if (!value || !state.running) return;
  const current = state.running;
  current.update(1);
  state.running = null;
  apply(state);
  current.resolve(true);
}

function createActions(state) {
  return {
    start() {
      state.selectionEnabled = false;
      state.storyTime = 0;
      state.view = 0;
      return transition(state, 9, (progress) => {
        state.storyTime = Math.min(progress * 9, 7.3);
        state.view = ease((progress * 9 - 6.5) / 2.5);
      });
    },
    finale() {
      state.selectionEnabled = false;
      const from = state.view;
      return transition(state, 2.4, (progress) => {
        state.view = THREE.MathUtils.lerp(from, 0, ease(progress));
        state.characters.forEach((obj, index) => {
          obj.position.x = (index === 0 ? -1 : 1) * THREE.MathUtils.lerp(.47, .33, ease(progress));
        });
      });
    },
    explore: () => setPose(state, true),
    reset: () => setPose(state, false),
    setMotion: (value) => setMotion(state, value),
    setSelectable: (value) => { state.selectionEnabled = value; },
    highlight: state.gift.highlight,
    dispose: () => disposeStage(state),
  };
}

export async function createStage(canvas, items, options = {}) {
  const state = createState(canvas, items, options);
  state.scene.add(state.gift.group);
  state.observer = new ResizeObserver(() => resize(state));
  state.observer.observe(canvas.parentElement);
  resize(state);
  attachInput(state);
  state.frameId = requestAnimationFrame((time) => tick(state, time));
  state.signal?.addEventListener('abort', () => disposeStage(state), { once: true });
  try {
    await loadCharacters(state);
    apply(state);
    return createActions(state);
  } catch (error) {
    disposeStage(state);
    throw error;
  }
}
