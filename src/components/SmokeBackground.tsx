"use client";

import { useEffect, useRef } from "react";

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time*2.65+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 q=(FC-.5*R)/R.y;
  vec2 uv=q;
  uv.x+=.12;
  uv*=vec2(2.25,1.08);

  float centerDistance=length(q*vec2(1.05,1.28));
  float quietCore=1.0-smoothstep(.34,.57,centerDistance);
  float outerStage=smoothstep(.42,.76,centerDistance);

  vec2 rightToLeft=vec2(T*.105, sin(T*.22)*.16);
  vec2 driftA=vec2(T*.087, -T*.026);
  vec2 driftB=vec2(T*.052, T*.041);

  float broad=fbm(uv*.62+rightToLeft);
  float stream=fbm(vec2(uv.x*.46+T*.14, uv.y*2.15+broad*1.1));
  float swirl=fbm(uv*1.26+vec2(stream*2.8, -broad*1.15)+driftA);
  float ribbon=fbm(vec2(uv.x*1.18+T*.16, uv.y*3.1+swirl*2.6)-driftB);
  float detail=fbm(uv*4.8+vec2(ribbon*3.2, stream*2.0)+vec2(T*.18, -T*.055));
  float fine=noise(uv*11.5+detail*3.7+vec2(T*.22, -T*.08));

  float folded=1.0-abs(2.0*swirl-1.0);
  float smoke=smoothstep(.18, .9, broad*.36+stream*.56+folded*.48+ribbon*.34+fine*.12);
  float wisps=smoothstep(.3,.84,folded*detail*1.05+ribbon*.72+stream*.22);
  float hotVein=smoothstep(.58,.98,detail*.72+ribbon*.72);
  float darkVein=smoothstep(.48,.9,fbm(vec2(uv.x*.88+T*.11, uv.y*3.8)-vec2(swirl*1.3,broad*2.3)));
  float pulse=.82+.18*sin(T*1.25+uv.x*2.4+uv.y*1.1);

  smoke*=mix(.16,1.0,outerStage);
  wisps*=mix(.22,1.0,outerStage);
  hotVein*=mix(.14,1.0,outerStage);
  darkVein*=mix(.08,1.0,outerStage);

  vec3 deep=vec3(.006,.0,.002);
  vec3 ember=u_color*1.28;
  vec3 hot=vec3(1.0,.035,.13);
  vec3 col=mix(deep, ember, smoke*.86*pulse);
  col+=u_color*wisps*.82;
  col+=hot*hotVein*.38;
  col=mix(col, deep, darkVein*.32);
  col=mix(col, deep+u_color*.11, quietCore*.72);

  float vignette=smoothstep(1.76,.13,length(q*vec2(.85,1.05)));
  col*=vignette;
  col=mix(vec3(0),col,min(time*.24,1.));
  O=vec4(clamp(col,0.,1.),1);
}`;

class Renderer {
  private readonly vertexSrc =
    "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}";
  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  private gl: WebGL2RenderingContext | null;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private color: [number, number, number] = [0.78, 0, 0.16];

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2");
    if (!this.gl) return;
    this.setup(fragmentSource);
    this.init();
  }

  updateColor(newColor: [number, number, number]) {
    this.color = newColor;
  }

  updateScale() {
    if (!this.gl) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const dpr = isMobile ? 1 : Math.max(1, Math.min(window.devicePixelRatio, 2));
    const { innerWidth: width, innerHeight: height } = window;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    if (!this.gl) return;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(`Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`);
    }
  }

  reset() {
    const { gl, program, vs, fs } = this;
    if (!gl || !program) return;
    if (vs) {
      gl.detachShader(program, vs);
      gl.deleteShader(vs);
    }
    if (fs) {
      gl.detachShader(program, fs);
      gl.deleteShader(fs);
    }
    gl.deleteProgram(program);
    this.program = null;
  }

  private setup(fragmentSource: string) {
    if (!this.gl) return;
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!this.vs || !this.fs || !program) return;
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, fragmentSource);
    this.program = program;
    gl.attachShader(program, this.vs);
    gl.attachShader(program, this.fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program linking error: ${gl.getProgramInfoLog(program)}`);
    }
  }

  private init() {
    if (!this.gl || !this.program) return;
    const gl = this.gl;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this;
    if (!gl || !program || !buffer || !gl.isProgram(program)) return;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f(gl.getUniformLocation(program, "resolution"), canvas.width, canvas.height);
    gl.uniform1f(gl.getUniformLocation(program, "time"), now * 1e-3);
    gl.uniform3fv(gl.getUniformLocation(program, "u_color"), this.color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : null;
}

export default function SmokeBackground({ smokeColor = "#c9002b" }: { smokeColor?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer(canvasRef.current, fragmentShaderSource);
    rendererRef.current = renderer;

    const handleResize = () => renderer.updateScale();
    handleResize();
    window.addEventListener("resize", handleResize);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const frameInterval = isMobile ? 1000 / 30 : 0;
    let animationFrameId = 0;
    let lastFrame = 0;
    const loop = (now: number) => {
      animationFrameId = requestAnimationFrame(loop);
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      renderer.render(now);
    };
    loop(0);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.reset();
    };
  }, []);

  useEffect(() => {
    const rgbColor = hexToRgb(smokeColor);
    if (rgbColor) rendererRef.current?.updateColor(rgbColor);
  }, [smokeColor]);

  return <canvas ref={canvasRef} className="smoke-canvas" aria-hidden="true" />;
}
