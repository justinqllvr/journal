const frag = () => {
  return `
        precision mediump float;
        
        uniform sampler2D imageTexture;
        varying vec2 vUv;
        uniform float uTime;
        uniform float scroll;

        void main()
        {
            vec4 image = texture2D(imageTexture, vUv);
            image.x = image.x * sin(scroll);
            gl_FragColor = image;
        }
    `;
};

export default frag;
