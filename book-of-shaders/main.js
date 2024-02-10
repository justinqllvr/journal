import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

let mouse = {
  value: {
    x: 0.1,
    y: 0.1,
  },
};

//Init three
const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   2000
// );
// camera.position.z = 3;
// scene.add(camera);

const camera = new THREE.OrthographicCamera(
  sizes.width / -2,
  sizes.width / 2,
  sizes.height / 2,
  sizes.height / -2,
  0,
  1000
);
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

document.addEventListener("mousemove", (e) => {
  mouse.value.x = Math.floor((e.offsetX / canvas.width) * 10) / 10;
  mouse.value.y = Math.floor((1 - e.offsetY / canvas.height) * 10) / 10;
});

//Utils & debug
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const controls = new OrbitControls(camera, canvas);
controls.enabled = false;

window.addEventListener("keydown", (event) => {
  // if (event.key == "h") gui.show(gui._hidden);
  if (event.key == "c") {
    controls.enabled = !controls.enabled;
    if (!controls.enabled) controls.reset();
  }
});

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

const createPlane = (x, y) => {
  const ratio = 3;
  const geometry = new THREE.PlaneGeometry(sizes.width, sizes.height);
  const material = new THREE.MeshBasicMaterial({
    color: "#ff0000",
  });

  console.log(geometry);

  const resolution = {
    value: {
      x: sizes.width,
      y: sizes.height,
    },
  };

  console.log(mouse);
  const uniforms = {
    uScroll: scroll,
    uTime: time,
    uMouse: mouse,
    uRes: resolution,
  };
  const shaderMaterial = new THREE.RawShaderMaterial({
    uniforms: uniforms,
    fragmentShader: frag(),
    vertexShader: vert(),
  });

  const mesh = new THREE.Mesh(geometry, shaderMaterial);
  mesh.position.x = x;
  mesh.position.y = y;

  scene.add(mesh);
};

//Geom

const createScene = () => {
  // for (let i = 0; i < images.length; i++) {
  //   const x = i % 2 === 0 ? -1.5 : 1.5;
  //   // createPlane(x, -2 * i, imagesTextures[i]);
  // }
  // createParticlesImage(0, 0, imagesTextures[0]);
};

createPlane(0, 0);

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
