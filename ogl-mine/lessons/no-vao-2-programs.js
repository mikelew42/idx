/* * *
 *
 * LESSONS
 * 
 * You don't need to use VAOs.  They just store the ARRAY_BUFFER config.
 *    And ELEMENT_BUFFER config?
 * 
 * You can only bind one ARRAY_BUFFER at a time.  However, when you configure
 * an array buffer to an attributeLocation, gl remembers.  So you can have
 * multiple ARRAY_BUFFERs configured (active for drawing), but only one bound
 * for configuration (bindBuffer).
 * 
 * When you configure the attributeLocations, it's NOT bound to the program.
 * If you change program, the current attributeLocation config remains.
 * 
 * VAOs, it seems, just makes switching faster.  Also, the uploaded data, not 
 * sure how GL manages the VRAM, but seems like you only need to upload the data
 * once, and then VAO recalls the config.
 *
 * * */

const canvas = document.createElement("canvas");
const gl = window.gl = canvas.getContext("webgl2");

canvas.style.display = "block";
canvas.style.width = "100%";
canvas.style.height = "100%";

document.body.appendChild(canvas);




var vertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 color;

out vec4 fcolor;
 
// all shaders have a main function
void main() {
  fcolor = color;
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;
 
var fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
 
in vec4 fcolor;
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = fcolor;
}
`;

var fragmentShaderSourceBlack = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
 
in vec4 fcolor;
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = fcolor - vec4(0.5, 0.5, 0.5, 0);
}
`;

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
var fragmentShaderBlack = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceBlack);

const program = createProgram(gl, vertexShader, fragmentShader);
const programBlack = createProgram(gl, vertexShader, fragmentShaderBlack);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
console.log(positionAttributeLocation)

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// three 2d points
var positions = [
  0, 0,
  0.3, 0.5,
  -0.3, 0.5,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);



// var vao = gl.createVertexArray();
// gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation); // affects the vao, not the program
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset)




var colorBuffer = gl.createBuffer();
var colors = [
    0.2, 0.5, 1, 1,
    0.5, 1, 0.6, 1,
    1, 0.2, 0.5, 1
];
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

const colorAttribLocation = gl.getAttribLocation(program, "color");
console.log(colorAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);
gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);



// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Bind the attribute/buffer set we want.
// gl.bindVertexArray(vao);



function draw(){
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 3;
	gl.drawArrays(primitiveType, offset, count);
}

function resize(){
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	draw();
}

window.addEventListener("resize", resize);

resize();