const particleVert = () => {
  return `
  precision mediump float;

  attribute float pindex;    // Instance index
  attribute vec3 offset;      // Instance offset
  attribute vec3 position;
  attribute vec2 uv;
  
  uniform float uRandom;      // Randomization factor
  uniform float uTime;        // Time uniform
  uniform float uDepth;       // Depth factor
  uniform float uSize;        // Particle size factor
  
  uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;


  varying vec2 vUv; 
  
  float random(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float snoise_1_2(vec2 co) {
      vec2 i = floor(co);
      vec2 f = fract(co);
  
      // Four corners in 2D of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
  
      // Smooth interpolation
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vec3 displaced = offset;
    displaced.xy += vec2(pindex - 0.5, pindex - 0.5);
    vec4 finalPosition = modelMatrix * vec4(position + displaced, 1.0);
    gl_Position = projectionMatrix * viewMatrix * finalPosition;
}

  `;
};

export default particleVert;

// // displacement
// vec3 displaced = offset;

// // randomise
// displaced.xy += vec2(random(vec2(pindex, 0.0)) - 0.5, random(vec2(offset.x + pindex, 0.0)) - 0.5) * uRandom;
// float rndz = (random(vec2(pindex, 0.0)) + snoise_1_2(vec2(pindex * 0.1, uTime * 0.1)));
// //   displaced.z += rndz * (random(vec2(pindex, 0.0)) * 2.0 * uDepth);

// // particle size
// //   float psize = (snoise_1_2(vec2(uTime, pindex) * 0.5) + 2.0);
// //   psize *= max(displaced.y, 0.2);  // Remplace 'grey' par 'displaced.y' (ou une autre composante selon votre besoin)
// float psize = uSize;

// vec4 finalPosition = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
// gl_Position = finalPosition;
