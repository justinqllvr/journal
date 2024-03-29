import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import images from "./images/index.js";
import { gsap } from "gsap";
import vert from "./glsl/vert.js";
import frag from "./glsl/frag.js";

import image from "./webgl/image.js";
import trailTexture from "./webgl/trailTexture.js";

//Vars
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById("canvas");
const time = {
  value: 0,
};

let mouse = {
  x: 0,
  y: 0,
};

const trails = [];

//Init three
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  10000
);

// const camera = new THREE.OrthographicCamera(
//   sizes.width / -2,
//   sizes.width / 2,
//   sizes.height / 2,
//   sizes.height / -2,
//   1,
//   sizes.width + 10
// );

// camera.position.z = 500;
camera.position.z = sizes.width * 0.7;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

//Listeners
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

canvas.addEventListener("mousemove", (e) => {
  //mouse between -1 and 1
  mouse.x = (e.offsetX / canvas.width) * 2 - 1;
  mouse.y = (1 - e.offsetY / canvas.height) * 2 - 1;
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
for (let i = 0; i < images.length; i++) {
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
  scroll.value -= e.deltaY * sizes.width * 0.5;
  scroll.delta = e.deltaY;

  gsap.to(camera.position, {
    y: scroll.value / 1000,
  });
});

//Functions
const imageGroup = new THREE.Group();
const hitAreas = new THREE.Group();

//Geom

const createScene = () => {
  for (let i = 0; i < images.length; i++) {
    const x = i % 2 === 0 ? -2 : 1;
    // createPlane(x, -2 * i, imagesTextures[i]);

    const trail = trailTexture();

    const { hitArea, mesh } = image(x, -1.5 * i, imagesTextures[i]);
    mesh.material.uniforms.uTouch.value = trail.texture;
    imageGroup.add(mesh);
    hitArea.index = i;
    hitAreas.add(hitArea);
    trails.push(trail);
  }

  // const { hitArea, mesh } = image(-0.5, -0.5, imagesTextures[0]);
  // mesh.material.uniforms.uTouch.value = trail.texture;

  // hitAreas.add(hitArea);

  // imageGroup.add(mesh);
  // hitAreas.add(hitArea);

  scene.add(imageGroup);
  scene.add(hitAreas);
};

//Raycaster
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();

// gui.add(plane.position, "y", -3, 3, 0.01);
// gui.add(planeMaterial, "wireframe");

// Animation

const animate = () => {
  // imageGroup.children[0].mesh.material.uniforms;
  if (trails.length > 0) {
    for (let i = 0; i < trails.length; i++) {
      trails[i].clear();
    }
  }

  raycaster.setFromCamera(mouse, camera);

  const elapsedTime = clock.getElapsedTime();
  time.value = Math.round(elapsedTime * 100);

  const objectsToTest = hitAreas.children;
  const intersects = raycaster.intersectObjects(objectsToTest);

  for (const intersect of intersects) {
    trails[intersect.object.index].update(intersect.uv.x, intersect.uv.y);
  }

  for (const object of objectsToTest) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      // object.material.color.set("#ff0000");
      // console.log(object);
      trails[object.index].update(-10, -10);
    }
  }

  // Update objects
  // mesh.rotation.y += 0.01;
  // mesh.rotation.z += 0.01;

  // Render the scene
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

// Start the animation
animate();
