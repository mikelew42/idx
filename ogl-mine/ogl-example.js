import {
	Renderer,
	Camera,
	Transform,
	Program,
	Mesh,
	Sphere,
	Box,
	Orbit,
	AxesHelper,
	VertexNormalsHelper,
	FaceNormalsHelper,
	GridHelper,
} from '/node_modules/ogl/src/index.js';

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;

void main() {
	vNormal = normalize(normalMatrix * normal);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;

varying vec3 vNormal;

void main() {
	vec3 normal = normalize(vNormal);
	float lighting = dot(normal, normalize(vec3(1.0, 1.0, 1.0)));
	gl_FragColor.rgb = vec3(0.75) + lighting * 0.5;
	gl_FragColor.a = 1.0;
}
`;

{
	const renderer = new Renderer({ 
		// dpr: 2 
	});
	const gl = renderer.gl;
	gl.canvas.style.display = "block";
	document.body.appendChild(gl.canvas);
	gl.clearColor(1, 1, 1, 1);

	const camera = new Camera(gl, { fov: 35 });
	camera.position.set(1, 1, 7);
	camera.lookAt([0, 0, 0]);
	const controls = new Orbit(camera);

	function resize() {
		gl.canvas.style.width = "100%";
		gl.canvas.style.height = "100%";

		// console.log("window.innerWidth", window.innerWidth, "window.innerHeight", window.innerHeight);
		const computed = getComputedStyle(gl.canvas);
		console.log(computed.width, computed.height);
		renderer.setSize(parseInt(computed.width), parseInt(computed.height));
		camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
	}
	window.addEventListener('resize', resize, false);
	resize();

	const scene = new Transform();

	const sphereGeometry = new Sphere(gl);
	const cubeGeometry = new Box(gl);

	const program = new Program(gl, { vertex, fragment });

	const sphere = new Mesh(gl, { geometry: sphereGeometry, program });
	sphere.position.set(-0.75, 0.5, 0);
	sphere.setParent(scene);

	const sphereVertNorms = new VertexNormalsHelper(sphere);
	sphereVertNorms.setParent(scene);

	const sphereFaceNorms = new FaceNormalsHelper(sphere);
	sphereFaceNorms.setParent(scene);

	const cube = new Mesh(gl, { geometry: cubeGeometry, program });
	cube.position.set(0.75, 0.5, 0);
	cube.setParent(scene);

	const cubeVertNorms = new VertexNormalsHelper(cube);
	cubeVertNorms.setParent(scene);

	const cubeFaceNorms = new FaceNormalsHelper(cube);
	cubeFaceNorms.setParent(scene);

	const grid = new GridHelper(gl, { size: 10, divisions: 10 });
    grid.position.y = -0.001; // shift down a little to avoid z-fighting with axes helper
    grid.setParent(scene);

    const axes = new AxesHelper(gl, { size: 6, symmetric: true });
    axes.setParent(scene);

    requestAnimationFrame(update);
    function update(t) {
    	requestAnimationFrame(update);

    	sphere.scale.y = Math.cos(t * 0.001) * 2;
    	cube.rotation.y -= 0.01;

    	controls.update();
    	renderer.render({ scene, camera });
    }
}