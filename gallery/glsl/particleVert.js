const particleVert = () => {
  return `
  precision mediump float;

  attribute float index;    // Instance index
  attribute vec3 offset;      // Instance offset
  attribute vec3 position;
  attribute vec2 uv;
  attribute float angle;
  
  uniform float uRandom;      // Randomization factor
  uniform float uTime;        // Time uniform
  uniform float uDepth;       // Depth factor
  uniform float uSize;        // Particle size factor
  uniform vec2 uTextureSize;        // Particle size factor
  uniform sampler2D uTouch;
  
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;

  varying vec2 vUv; 
  varying vec2 vPUv;
  varying vec3 vOffset;
  varying float vIndex;

  float random(float n) {
    return fract(sin(n) * 43758.5453123);
  }
  
  void main() {
    // particle uv
	  vec2 puv = offset.xy / uTextureSize ;
	  vPUv = puv;
    vIndex = index;

    //Interraction
    vec3 displaced = offset;
    float rand = random(index);

    float radius = 50.;

    float t = texture2D(uTouch, puv).r;
    displaced.x += cos(angle) * radius * t;
    displaced.y += sin(angle) * radius * t;




	  // displaced.x += cos(angle * 5.) * t * 20.0 * rand;
	  // displaced.y += sin(angle) * t * 20.0 * rand;

    // vec4 displacedPosition = vec4(displaced, 1.0)
    // vec4 finalPosition = vec4(position + displacedPostion, 1.0);

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(displaced, 1.0);
	  mvPosition.xyz += position * 2.;
	  vec4 finalPosition = projectionMatrix * mvPosition;

    gl_Position = finalPosition;
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
