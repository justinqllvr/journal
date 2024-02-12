import * as THREE from "three";
import particleVert from "../glsl/particleVert.js";
import particleFrag from "../glsl/particleFrag.js";
//Create a Plane that will receive the mouse position
const createHitArea = (width, height) => {
  const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    depthTest: false,
  });
  // material.visible = false;
  const scaleFactor = 1.1;
  geometry.scale(scaleFactor, scaleFactor, scaleFactor);

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

const image = (x, y, texture, trailTexture) => {
  const divider = 2;
  const width = texture.source.data.width / divider;
  const height = texture.source.data.height / divider;

  const geometry = new THREE.InstancedBufferGeometry();

  // positions
  const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);

  positions.setXYZ(0, 0.0, 1.0, 0.0);
  positions.setXYZ(1, 1.0, 1.0, 0.0);
  positions.setXYZ(2, 0.0, 0.0, 0.0);
  positions.setXYZ(3, 1.0, 0.0, 0.0);

  geometry.setAttribute("position", positions);

  // uvs
  const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
  uvs.setXYZ(0, 0.0, 1.0);
  uvs.setXYZ(1, 1.0, 1.0);
  uvs.setXYZ(2, 0.0, 0.0);
  uvs.setXYZ(3, 1.0, 0.0);
  geometry.setAttribute("uv", uvs);

  // index
  geometry.setIndex(
    new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
  );

  //Loop through pixels

  const numPoints = width * height;
  const numParticles = Math.ceil(numPoints);

  const indices = new Uint16Array(numParticles);
  const offsets = new Float32Array(numParticles * 3);
  const angles = new Float32Array(numParticles);

  for (let i = 0; i < numParticles; i++) {
    const originalIndex = i;
    const rowIndex = Math.floor(originalIndex / width);
    const colIndex = originalIndex % width;

    // Calculer l'offset en fonction des indices de ligne et de colonne
    offsets[originalIndex * 3 + 0] = colIndex; //X de la particule
    offsets[originalIndex * 3 + 1] = rowIndex; //Y de la particule
    offsets[originalIndex * 3 + 2] = 0; //Z de la particule

    indices[originalIndex] = originalIndex;

    angles[i] = Math.random() * Math.PI;
  }

  geometry.setAttribute(
    "index",
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
    uSize: { value: 1.0 },
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
  const hitArea = createHitArea(width, height);

  const ratio = width / height;
  const meshX = x * width * ratio;
  const meshY = y * height * ratio;

  mesh.position.x = meshX;
  mesh.position.y = meshY;
  mesh.position.z = 0;

  //Add width and height because the plane geometry as a 0 0 in his center
  hitArea.position.x = meshX + width / 2;
  hitArea.position.y = meshY + height / 2;
  hitArea.position.z = 1;

  return { hitArea, mesh };
};

export default image;
