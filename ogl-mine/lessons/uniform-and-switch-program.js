const { canvas, gl } = setup();


const vertexShaderSource = `#version 300 es
	in vec4 position;

	void main() {
		gl_Position = position;
	}`;

const fragmentShaderSource = `#version 300 es
	precision highp float;

	uniform vec4 color;

	out vec4 outColor;

	void main() {
		outColor = color;
	}`;

const fragmentShaderSourceDark = `#version 300 es
	precision highp float;

	uniform vec4 color;

	out vec4 outColor;

	void main() {
		outColor = color;
}`;


// Compile shaders, link program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);


const fragmentShaderDark = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceDark);
const programDark = createProgram(gl, vertexShader, fragmentShaderDark);

var positionAttributeLocation = gl.getAttribLocation(program, "position");

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// three 2d points
var positions = [
	0, 0,
	0.3, 0.5,
	-0.3, 0.5,
	];

// Copy positions array into active ARRAY_BUFFER (positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);



// var vao = gl.createVertexArray();
// gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation); // affects the vao, not the program

gl.vertexAttribPointer(
	positionAttributeLocation,
	2, // size
	gl.FLOAT,  // type
	false, // normalize
	0, // stride 
	0 // offset
);



window.uni = function(r, g, b){
	gl.uniform4f(gl.getUniformLocation(current_program, "color"), r, g, b, 1.0); // RGBA
};

/*!!!
 * 
 * Just got an error, because useProgram was AFTER this uniform set
 * Apparently it doesn't care if
 * */
var current_program = program;
gl.useProgram(program);
uni(0.5, 0.5, 1);

gl.useProgram(programDark);
current_program = programDark;
uni(1, 0.5, 0.5);

gl.useProgram(program);
current_program = program;

// proof that uniforms are "bound" to the program
// set them up, then switch back and forth, and watch the same
// uniform attribute switch back and forth...

window.switchProgram = function(){
	if (current_program === program){
		gl.useProgram(programDark);
		current_program = programDark;
		draw()
	} else {
		gl.useProgram(program);
		current_program = program;
		draw();
	}
};



// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)

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

window.draw = draw;
resize();



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

function setup(){
	const canvas = document.createElement("canvas");
	const gl = window.gl = canvas.getContext("webgl2");

	canvas.style.display = "block";
	canvas.style.width = "100%";
	canvas.style.height = "100%";

	document.body.appendChild(canvas);

	return { canvas, gl }
}