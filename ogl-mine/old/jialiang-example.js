// Go to Line 153 for the start of Uniform Buffer Object related code and intro

// Prerequsite:

// You at least know what uniforms are in the context of WebGL
// and mininally understand the concepts involved in creating a square in WebGL

// Prepare our canvas

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

// Prepare our 2 shaders
// One of them will render objects with the supplied color
// The other will render objects with the inverse of the supplied color

const vertexShaderSource_normal = `#version 300 es
  layout(location = 0) in vec3 a_Position;

  // THIS IS CALLED A UNIFORM BLOCK
  uniform Settings {
    float u_PointSize;
    vec3 u_Color;
  };

  out vec4 color;

  void main(void) {
    color = vec4(u_Color, 1.0);

    gl_PointSize = u_PointSize;
    gl_Position = vec4(a_Position, 1.0);
  }
`;

const vertexShaderSource_inverted = `#version 300 es
  layout(location = 0) in vec3 a_Position;

  uniform Settings {
    float u_PointSize;
    vec3 u_Color;
  };

  out vec4 color;

  void main(void) {
    color = vec4(
      1.0 - u_Color.r, 
      1.0 - u_Color.g, 
      1.0 - u_Color.b, 
      1.0
    );

    gl_PointSize = u_PointSize;
    gl_Position = vec4(a_Position, 1.0);
  }
`;

const fragmentShaderSource = `#version 300 es
  precision mediump float;

  in vec4 color;
  out vec4 finalColor;

  void main(void) {
    finalColor = color;
  }
`;

const vertexShader_normal = gl.createShader(gl.VERTEX_SHADER);
const vertexShader_inverted = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader_normal, vertexShaderSource_normal);
gl.shaderSource(vertexShader_inverted, vertexShaderSource_inverted);
gl.shaderSource(fragmentShader, fragmentShaderSource);

gl.compileShader(vertexShader_normal);
gl.compileShader(vertexShader_inverted);
gl.compileShader(fragmentShader);

const program_normal = gl.createProgram();
const program_inverted = gl.createProgram();

gl.attachShader(program_normal, vertexShader_normal);
gl.attachShader(program_normal, fragmentShader);

gl.attachShader(program_inverted, vertexShader_inverted);
gl.attachShader(program_inverted, fragmentShader);

gl.linkProgram(program_normal);
gl.linkProgram(program_inverted);

// Prepare Vertex Array Object
// Our 2 squares will both share a single VAO

const vao = gl.createVertexArray();

gl.bindVertexArray(vao);

// prettier-ignore
const positionArray = new Float32Array([
  -0.5, 0, 0,
  0.5, 0, 0
]);
const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.bindVertexArray(null);

//
//
//
//
//
//
//
//
//
//

// ==================
// PREPARING THE UNIFORM BUFFER OBJECT
// ==================

/**
 * UBO is a fancy new way to push uniforms to the GPU introduced in WebGL2
 * Instead of pushing each uniform individually for each shader program,
 * we can now do this instead:
 *
 * - Defined your uniforms as a struct (uniform block) in your shaders (See line 46 to 50)
 * - Link your uniform block to an appropriate uniform buffer which contains the data for the uniform block
 * - If you use the same uniform block across multiple programs, you can link them to the same uniform buffer
 * - You only need to update this buffer once for the change to be reflected in all programs.
 *
 * Regardless if you like it or not (which I don't due to how convoluted it is),
 * you have to learn how to use it unless
 * you want to leave performance at the table, especially for complex WebGL applications.
 **/

//
//
//
//
//

/**
 * Things in PART A need only be done for each unique Uniform Block
 * Unique Uniform Block as in Uniform Blocks with the same structure (same variable name, order and type)
 **/

// ==== START OF PART A ====

// Get the index of the Uniform Block from any program
const blockIndex = gl.getUniformBlockIndex(program_normal, "Settings");

// Get the size of the Uniform Block in bytes
const blockSize = gl.getActiveUniformBlockParameter(
  program_normal,
  blockIndex,
  gl.UNIFORM_BLOCK_DATA_SIZE
);

// Create Uniform Buffer to store our data
const uboBuffer = gl.createBuffer();

// Bind it to tell WebGL we are working on this buffer
gl.bindBuffer(gl.UNIFORM_BUFFER, uboBuffer);

// Allocate memory for our buffer equal to the size of our Uniform Block
// We use dynamic draw because we expect to respecify the contents of the buffer frequently
gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);

// Unbind buffer when we're done using it for now
// Good practice to avoid unintentionally working on it
gl.bindBuffer(gl.UNIFORM_BUFFER, null);

// Bind the buffer to a binding point
// Think of it as storing the buffer into a special UBO ArrayList
// The second argument is the index you want to store your Uniform Buffer in
// Let's say you have 2 unique UBO, you'll store the first one in index 0 and the second one in index 1
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uboBuffer);

// Name of the member variables inside of our Uniform Block
const uboVariableNames = ["u_PointSize", "u_Color"];

// Get the respective index of the member variables inside our Uniform Block
const uboVariableIndices = gl.getUniformIndices(
  program_normal,
  uboVariableNames
);

// Get the offset of the member variables inside our Uniform Block in bytes
const uboVariableOffsets = gl.getActiveUniforms(
  program_normal,
  uboVariableIndices,
  gl.UNIFORM_OFFSET
);

// Create an object to map each variable name to its respective index and offset
const uboVariableInfo = {};

uboVariableNames.forEach((name, index) => {
  uboVariableInfo[name] = {
    index: uboVariableIndices[index],
    offset: uboVariableOffsets[index],
  };
});

// ==== END OF PART A ====

//
//
//
//
//

/**
 * Things in PART B is done for each program that will be using the same UBO
 **/

// ==== START OF PART B ====

let index;

// The 3rd argument is the binding point of our Uniform Buffer
// uniformBlockBinding tells WebGL to
// link the Uniform Block inside of this program
// to the Uniform Buffer at index X of our Special UBO ArrayList
//
// Remember that we placed our UBO at index 0 of our Special UBO ArrayList in line 213 in Part A

index = gl.getUniformBlockIndex(program_normal, "Settings");
gl.uniformBlockBinding(program_normal, index, 0);

index = gl.getUniformBlockIndex(program_inverted, "Settings");
gl.uniformBlockBinding(program_inverted, index, 0);

// ==== END OF PART B ====

//
//
//
//
//

/**
 * Things in PART C is done whenever the uniform data changes
 **/

const onRender = () => {
  // ==== START OF PART C ====

  gl.bindBuffer(gl.UNIFORM_BUFFER, uboBuffer);

  // Push some data to our Uniform Buffer

  gl.bufferSubData(
    gl.UNIFORM_BUFFER,
    uboVariableInfo["u_PointSize"].offset,
    new Float32Array([Math.random() * 100.0 + 100.0]),
    0
  );
  gl.bufferSubData(
    gl.UNIFORM_BUFFER,
    uboVariableInfo["u_Color"].offset,
    new Float32Array([Math.random(), 0.25, 0.25]),
    0
  );

  gl.bindBuffer(gl.UNIFORM_BUFFER, null);

  // ==== END OF PART C ====

  gl.bindVertexArray(vao);

  gl.useProgram(program_normal);
  gl.drawArrays(gl.POINTS, 0, 1);

  gl.useProgram(program_inverted);
  gl.drawArrays(gl.POINTS, 1, 1);

  gl.bindVertexArray(null);

  setTimeout(() => {
    requestAnimationFrame(onRender);
  }, 200);
};

requestAnimationFrame(onRender);


// Note:

// If you want to declare the same Uniform Block in both fragment and vertex shaders in the same program,
// you need to make sure both are using the same float precision e.g. "precision mediump float;"

// Otherwise you'll get a X is not linkable between attached shaders.
// With that said, you can always declare the uniform only in your vertex shader and pass the values to the fragment shader,
// e.g. "out float X;"