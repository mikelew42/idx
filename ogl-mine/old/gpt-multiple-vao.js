const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl2");
document.body.appendChild(canvas);

canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio;
gl.viewport(
  0,
  0,
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
);

// Create VAO 1
var vao1 = gl.createVertexArray();
gl.bindVertexArray(vao1);

// Setup buffers and attributes for VAO 1
var positionBuffer1 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  // vertices for object 1
  -0.5, -0.5,
   0.5, -0.5,
   0.0,  0.5
]), gl.STATIC_DRAW);

var positionLocation = gl.getAttribLocation(program1, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Unbind VAO 1
gl.bindVertexArray(null);

// Create VAO 2
var vao2 = gl.createVertexArray();
gl.bindVertexArray(vao2);

// Setup buffers and attributes for VAO 2
var positionBuffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  // vertices for object 2
  -0.5, -0.5,
  -0.5,  0.5,
   0.5,  0.5,
   0.5, -0.5
]), gl.STATIC_DRAW);

positionLocation = gl.getAttribLocation(program2, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Unbind VAO 2
gl.bindVertexArray(null);

// Rendering Loop
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Use Program 1 and VAO 1
  gl.useProgram(program1);
  gl.bindVertexArray(vao1);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Use Program 2 and VAO 2
  gl.useProgram(program2);
  gl.bindVertexArray(vao2);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  requestAnimationFrame(render);
}

render();
