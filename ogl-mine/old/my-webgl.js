class Scene {
	constructor(){
		this.canvas = document.createElement("canvas");
		this.canvas.style.display = "block";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		document.body.appendChild(this.canvas);

		this.gl = this.canvas.getContext("webgl2");

		const width = window.innerWidth * devicePixelRatio;
		const height = window.innerHeight * devicePixelRatio;
		this.canvas.width = width;
		this.canvas.height = height;
		this.gl.viewport(0, 0, width, height );

		this.shaders();
		this.box = new Box({ gl: this.gl, program: this.program });
		this.render();
	}

	shaders(){
		this.program = new Program({
			gl: this.gl,
			// vertex: `#version 300 es
			// 	in vec3 position;

			// 	void main(){
			// 		gl_Position = vec4(position, 1);
			// }`,
			vertex: /* glsl */ `#version 300 es
				in vec3 position;
				in vec3 normal;

				uniform mat4 mat;
				uniform mat4 modelViewMatrix;
				uniform mat4 projectionMatrix;
				uniform mat3 normalMatrix;

				out vec3 vNormal;

				void main() {
				    vNormal = normalize(normalMatrix * normal);
				    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				    gl_Position = mat * vec4(position, 1.0);
			}`,
			fragment: `#version 300 es
				precision mediump float;
				out vec4 color;

				void main(){
					color = vec4(0.5, .3, 0, 1);
			}`

		});

		this.program.use();
	}

	render() {
	    this.gl.clearColor(0, 0, 0, 0);
	    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	    
	    this.box.draw();

	    // requestAnimationFrame(this.render.bind(this));
	}
}

class Box {
	constructor(...args){
		this.assign(...args);

		this.data = new Float32Array([
			// Front face
			-0.5, -0.5,  0.5, // Bottom-left 0
			 0.5, -0.5,  0.5, // Bottom-right 1
			 0.5,  0.5,  0.5, // Top-right 2
			-0.5,  0.5,  0.5, // Top-left 3

			// Back face
			-0.5, -0.5, -0.5, // Bottom-left 4
			-0.5,  0.5, -0.5, // Top-left 5
			 0.5,  0.5, -0.5, // Top-right 6
			 0.5, -0.5, -0.5, // Bottom-right 7
		]);

		this.indices = new Uint16Array([
			0, 1, 2, 0, 2, 3, // front face
			7, 4, 5, 7, 5, 6, // back face
			3, 2, 6, 3, 6, 5, // top face
			4, 7, 1, 4, 1, 0, // bottom face
			1, 7, 6, 1, 6, 2, // right face
			4, 0, 3, 4, 3, 5  // left face
		]);

		this.mat = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0
		];

		this.updateDataBuffers();
	}

	updateDataBuffers(){
		if (!this.gl)
			throw "no gl";

		this.vao = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.vao);

		this.buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
		
		this.ibuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

		// Enable the vertex attribute for position
		const positionAttribLocation = this.gl.getAttribLocation(this.program.program, "position");
		this.gl.enableVertexAttribArray(positionAttribLocation);
		this.gl.vertexAttribPointer(positionAttribLocation, 3, this.gl.FLOAT, false, 0, 0);

		// make sure useProgram (it should be)
		this.gl.uniformMatrix4fv(
			this.gl.getUniformLocation(this.program.program, "mat"), false, this.mat);
	}

	draw() {
		this.gl.bindVertexArray(this.vao);

		// this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibuffer);
		// gpt gave me this code, but now gpt says this is bound to the vao..

		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
	}

	assign(...args){
		return Object.assign(this, ...args);
	}
}


class Renderer {}


class Program {
	constructor(...args){
		this.assign(...args);

		// Create empty shaders and attach to program
		this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.program = this.gl.createProgram();
		this.gl.attachShader(this.program, this.vertexShader);
		this.gl.attachShader(this.program, this.fragmentShader);

		// Compile shaders with source
		this.setShaders({ vertex: this.vertex, fragment: this.fragment });
	}

	setShaders({ vertex, fragment }) {
	    if (vertex) {
	        // compile vertex shader and log errors
	        this.gl.shaderSource(this.vertexShader, vertex);
	        this.gl.compileShader(this.vertexShader);
	        if (this.gl.getShaderInfoLog(this.vertexShader) !== '') {
	            console.warn(`${this.gl.getShaderInfoLog(this.vertexShader)}\nVertex Shader\n${addLineNumbers(vertex)}`);
	        }
	    }

	    if (fragment) {
	        // compile fragment shader and log errors
	        this.gl.shaderSource(this.fragmentShader, fragment);
	        this.gl.compileShader(this.fragmentShader);
	        if (this.gl.getShaderInfoLog(this.fragmentShader) !== '') {
	            console.warn(`${this.gl.getShaderInfoLog(this.fragmentShader)}\nFragment Shader\n${addLineNumbers(fragment)}`);
	        }
	    }

	    // compile program and log errors
	    this.gl.linkProgram(this.program);
	    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
	        return console.warn(this.gl.getProgramInfoLog(this.program));
	    }
	}

	use(){
		this.gl.useProgram(this.program);
	}

	assign(...args){
		return Object.assign(this, ...args);
	}
}

// class Shader.Attribute {}
// class Shader.Uniform {}
// class Shader.Uniform.Type {}
// class VAO {}
// class GLBuffer {}



function addLineNumbers(string) {
    let lines = string.split('\n');
    for (let i = 0; i < lines.length; i++) {
        lines[i] = i + 1 + ': ' + lines[i];
    }
    return lines.join('\n');
}



const scene = new Scene();

    // const now = performance.now();

    // for (let i = 0; i < 1000; i++){
    //     scene.render();
    // }

    // console.log(performance.now() - now);