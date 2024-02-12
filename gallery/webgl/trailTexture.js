import * as THREE from "three";

const trailTexture = () => {
  //Variables
  const size = 128;
  const trail = [];

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);

  canvas.id = "trailTexture";
  canvas.style.width = canvas.style.height = `${canvas.width}px`;

  const update = (x, y) => {
    clear();
    ctx.beginPath();
    ctx.arc(x * size, (1 - y) * size, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.fill();
    ctx.stroke();

    texture.needsUpdate = true;
  };

  const clear = () => {
    ctx.fillStyle = "rgba(0, 0, 0, .05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return { canvas, update, texture, clear };
};

export default trailTexture;
