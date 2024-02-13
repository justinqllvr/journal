import * as THREE from "three";

const trailTexture = () => {
  //Variables
  const size = 128 * 4;
  const positions = [];

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);

  canvas.id = "trailTexture";
  canvas.style.width = canvas.style.height = `${canvas.width}px`;

  const updatePos = (x, y) => {
    positions.push({ x: x, y: y });

    if (positions.length > 50) {
      positions.shift();
    }
  };

  const update = (x, y) => {
    for (let i = 0; i < positions.length; i++) {
      const ratio = (i + 1) / positions.length;

      ctx.beginPath();
      ctx.arc(
        positions[i].x * size,
        (1 - positions[i].y) * size,
        40 * ratio,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${ratio})`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${ratio})`;
      ctx.fill();
      ctx.stroke();
    }

    updatePos(x, y);

    texture.needsUpdate = true;
  };

  const clear = () => {
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return { canvas, update, texture, clear };
};

export default trailTexture;
