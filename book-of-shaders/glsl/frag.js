const frag = () => {
  return `
  precision mediump float;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec2 uRes;

  float plot(vec2 st) {    
    return smoothstep(0.02, 0.0, abs(st.y - st.x));
  }

  void main()
  {
    vec2 st = gl_FragCoord.xy/uRes;

    float y = st.x;

    vec3 color = vec3(y);

    // Plot a line
    float pct = plot(st);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

	gl_FragColor = vec4(color,1.0);
  }
    `;
};

export default frag;
