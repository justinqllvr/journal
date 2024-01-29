import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import images from "./images/index.js";
import { gsap } from "gsap";
import vert from "./glsl/vert.js";
import frag from "./glsl/frag.js";
import particleVert from "./glsl/particleVert.js";
import particleFrag from "./glsl/particleFrag.js";

//Vars
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById("canvas");
const time = {
  value: 0,
};

//Init three
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  2000
);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

//Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Utils & debug
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const gui = new GUI({
  width: 300,
  title: "Debug",
});

gui.close();
gui.hide();

const controls = new OrbitControls(camera, canvas);
controls.enabled = false;

window.addEventListener("keydown", (event) => {
  if (event.key == "h") gui.show(gui._hidden);
  if (event.key == "c") {
    controls.enabled = !controls.enabled;
    if (!controls.enabled) controls.reset();
  }
});

//Images Load
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onLoad = () => {
  console.log("loading finished");
  createScene();
};
loadingManager.onProgress = () => {
  console.log("loading progressing");
};
loadingManager.onError = () => {
  console.log("loading error");
};
const textureLoader = new THREE.TextureLoader(loadingManager);

const imagesTextures = [];
for (let i = 0; i < 11; i++) {
  imagesTextures.push(textureLoader.load(images[i]));
  imagesTextures[i].colorSpace = THREE.SRGBColorSpace;
}

//Handle
//Scroll
let scroll = {
  delta: 0,
  value: 0,
};
canvas.addEventListener("wheel", (e) => {
  if (controls.enabled) return;
  scroll.value -= e.deltaY;
  scroll.delta = e.deltaY;

  gsap.to(camera.position, {
    y: scroll.value / 100,
  });
});

//Functions
const group = new THREE.Group();

const createPlane = (x, y, texture) => {
  const ratio = 3;
  const geometry = new THREE.PlaneGeometry(0.566153 * ratio, 1 * ratio);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const uniforms = {
    imageTexture: { value: texture },
    scroll: scroll,
    uTime: time,
  };
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: frag(),
    vertexShader: vert(),
  });

  const mesh = new THREE.Mesh(geometry, shaderMaterial);
  mesh.position.x = x;
  mesh.position.y = y;

  group.add(mesh);
};

const createParticlesImage = (x, y, texture) => {
  const width = texture.source.data.width;
  const height = texture.source.data.height;
  const numPoints = width * height;
  const ratio = (width / height) * 3;
  const multiplier = 1;

  console.log(width / height);

  const geometry = new THREE.InstancedBufferGeometry();

  // positions
  const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
  positions.setXYZ(0, (-ratio / 2) * multiplier, 0.5 * multiplier, 0.0);
  positions.setXYZ(1, (ratio / 2) * multiplier, 0.5 * multiplier, 0.0);
  positions.setXYZ(2, (-ratio / 2) * multiplier, -0.5 * multiplier, 0.0);
  positions.setXYZ(3, (ratio / 2) * multiplier, -0.5 * multiplier, 0.0);
  geometry.setAttribute("position", positions);

  // uvs
  const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
  uvs.setXYZ(0, 0.0, 0.0);
  uvs.setXYZ(1, 1.0, 0.0);
  uvs.setXYZ(2, 0.0, 1.0);
  uvs.setXYZ(3, 1.0, 1.0);
  geometry.setAttribute("uv", uvs);

  // index
  geometry.setIndex(
    new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
  );

  //Loop through pixels
  const divider = 100000;
  const indices = new Uint16Array(numPoints / divider);
  const offsets = new Float32Array((numPoints * 3) / divider);
  const angles = new Float32Array(numPoints / divider);

  for (let i = 0; i < numPoints / divider; i++) {
    offsets[i * 3 + 0] = (i % width) / divider;
    offsets[i * 3 + 1] = Math.floor(i / width / divider);

    indices[i] = i;

    angles[i] = Math.random() * Math.PI;
  }

  console.log(indices);

  geometry.setAttribute(
    "pindex",
    new THREE.InstancedBufferAttribute(indices, 1, false)
  );
  geometry.setAttribute(
    "offset",
    new THREE.InstancedBufferAttribute(offsets, 3, false)
  );
  geometry.setAttribute(
    "angle",
    new THREE.InstancedBufferAttribute(angles, 1, false)
  );

  const uniforms = {
    uTime: { value: 0 },
    uRandom: { value: 1.0 },
    uDepth: { value: 2.0 },
    uSize: { value: 0.0 },
    uTextureSize: { value: new THREE.Vector2(width, height) },
    uTexture: { value: texture },
    uTouch: { value: null },
  };

  const material = new THREE.RawShaderMaterial({
    uniforms,
    vertexShader: particleVert(),
    fragmentShader: particleFrag(),
    depthTest: false,
    transparent: true,
    wireframe: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = x;
  mesh.position.y = y;

  group.add(mesh);
};

//Geom

const createScene = () => {
  for (let i = 0; i < images.length; i++) {
    const x = i % 2 === 0 ? -1.5 : 1.5;
    createPlane(x, -2 * i, imagesTextures[i]);
  }

  // createParticlesImage(0, 0, imagesTextures[0]);

  scene.add(group);
};

const clock = new THREE.Clock();

// gui.add(plane.position, "y", -3, 3, 0.01);
// gui.add(planeMaterial, "wireframe");

// Animation

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  time.value = elapsedTime;

  requestAnimationFrame(animate);

  // Update objects
  // mesh.rotation.y += 0.01;
  // mesh.rotation.z += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

// Start the animation
animate();
