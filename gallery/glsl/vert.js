const vert = () => {
  return `
        precision mediump float;

        varying vec2 vUv; 
        uniform float scroll;
        uniform float uTime;

        void main()
        {
            vUv = uv; 
            vec3 pos = vec3(position.x, position.y, position.z);
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
        }`;
};

export default vert;
