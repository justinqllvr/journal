const particleFrag = () => {
  return `
  precision mediump float;
        
  uniform sampler2D uTexture;
  varying vec2 vUv;
  uniform float uTime;
  uniform float scroll;

  void main()
  {
    //   vec4 image = texture2D(uTexture, vUv);
    //   gl_FragColor = image;
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
      `;
};
export default particleFrag;

// `
//             precision mediump float;

//             uniform sampler2D uTexture;  // Texture à utiliser
//             uniform vec2 puv;            // Coordonnées de texture (UV) de la particule
//             uniform vec2 uv;             // Coordonnées de texture (UV) du fragment

//             varying vec2 vUv;            // Coordonnées de texture (UV) transmises depuis le vertex shader

//             void main() {
//                 // pixel color
//                 vec4 colA = texture2D(uTexture, puv);

//                 // greyscale
//                 float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
//                 vec4 colB = vec4(grey, grey, grey, 1.0);

//                 // circle
//                 float border = 0.3;
//                 float radius = 0.5;
//                 float dist = radius - distance(uv, vec2(0.5));
//                 float t = smoothstep(0.0, border, dist);

//                 // final color
//                 vec4 color = colB;
//                 color.a = t;

//                 // (...)

//                 gl_FragColor = color;
//             }
//       `;
