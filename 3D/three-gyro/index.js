import { App, el, div, View, h1, h2, h3, p, is, Base, icon } from "/module/App/App.js";
import * as THREE from "/module/lib/three.js";
import { OrbitControls } from '/three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "/three.js/examples/jsm/loaders/GLTFLoader.js";

window.THREE = THREE;
const app = window.app = await new App().ready;

// console.log(THREE);

const ui = div.c("ui", ui => {
	ui.calibrate = div.c("calibrate", "calibrate").click(calibrate);
	ui.fullscreen = div.c("fullscreen", "fullscreen").click(fullscreen);
});

function fullscreen(){
	document.documentElement.requestFullscreen();
}

const scene = window.scene = new THREE.Scene();
// scene.rotation.x = Math.PI / 2;
// console.log(scene);
const camera = scene.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraOffset = new THREE.Vector3(0, 5, 25);
camera.position.y = 2;
// camera.position.x = 5;
camera.position.z = 10;
// scene.add(camera);

const renderer = scene.renderer = new THREE.WebGLRenderer({ 
	alpha: true,
	antialias: true
});  // Enable transparency in the renderer
renderer.setClearColor( 0x000000, 0 );  // Set the background color to transparent (alpha = 0)
renderer.setPixelRatio(window.devicePixelRatio);


const controls = new OrbitControls(camera, renderer.domElement);
controls.update();



// Create a GridHelper
const size = 1000;        // Size of the grid (width/height)
const divisions = 100;   // Number of divisions in the grid
const gridHelper = new THREE.GridHelper(size, divisions);

// Add the GridHelper to the scene
scene.add(gridHelper);


// Add the helper to the scene or attach it to an object
scene.add(new THREE.AxesHelper(50));  // Add to scene to show world axes
// OR attach to an object to show its local axes
// object.add(axesHelper);













function resize(){
	renderer.setSize(window.innerWidth, window.innerHeight);
	// Update camera aspect ratio and projection matrix
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();


document.body.appendChild(renderer.domElement);

function quaternionMultiply(a, b) {
	return {
		w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
		x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
		y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
		z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
	};
}

function eulerToQuaternion(e) {
	var s = Math.PI / 180;
	var x = e.beta * s, y = e.gamma * s, z = e.alpha * s;
	var cX = Math.cos(x / 2);
	var cY = Math.cos(y / 2);
	var cZ = Math.cos(z / 2);
	var sX = Math.sin(x / 2);
	var sY = Math.sin(y / 2);
	var sZ = Math.sin(z / 2);
	var w = cX * cY * cZ - sX * sY * sZ;
	x = sX * cY * cZ - cX * sY * sZ;
	y = cX * sY * cZ + sX * cY * sZ;
	z = cX * cY * sZ + sX * sY * cZ;
	return {x:x, y:y, z:z, w:w};
}

function quaternionApply(v, a) {
	v = quaternionMultiply(a, {x:v.x,y:v.y,z:v.z,w:0});
	v = quaternionMultiply(v, {w:a.w, x:-a.x, y:-a.y, z:-a.z});
	return {x:v.x, y:v.y, z:v.z};
}

function vectorDot(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

function quaternionToEuler(q) {
	var s = 180 / Math.PI;
	var front = quaternionApply({x:0,y:1,z:0}, q);
	var alpha = (front.x == 0 && front.y == 0) ?
		0 : -Math.atan2(front.x, front.y);
	var beta = Math.atan2(front.z,Math.sqrt(front.x*front.x+front.y*front.y));
	var zgSide = {
		x: Math.cos(alpha),
		y: Math.sin(alpha),
		z: 0
	};
	var zgUp = {
		x: Math.sin(alpha) * Math.sin(beta),
		y: -Math.cos(alpha) * Math.sin(beta),
		z: Math.cos(beta)
	};
	var up = quaternionApply({x:0,y:0,z:1}, q);
	var gamma = Math.atan2(vectorDot(up, zgSide), vectorDot(up, zgUp));

	// wrap-around the value according to DeviceOrientation
	// Event Specification
	if (alpha < 0) alpha += 2 * Math.PI;
	if (gamma >= Math.PI * 0.5) {
		gamma -= Math.PI; alpha += Math.PI;
		if (beta > 0) beta = Math.PI - beta;
		else beta = -Math.PI - beta;
	} else if (gamma < Math.PI * -0.5) {
		gamma += Math.PI; alpha += Math.PI;
		if (beta > 0) beta = Math.PI - beta;
		else beta = -Math.PI - beta;
	}
	if (alpha >= 2 * Math.PI) alpha -= 2 * Math.PI;
	return {alpha: alpha * s, beta: beta * s, gamma: gamma * s};
}

function degToRad(deg){
	return deg * (Math.PI/180);
}

var degtorad = Math.PI / 180; // Degree-to-Radian conversion

function setOrientQuat( quat, alpha, beta, gamma ) {

  var _x = beta  ? beta  * degtorad : 0; // beta value
  var _y = gamma ? gamma * degtorad : 0; // gamma value
  var _z = alpha ? alpha * degtorad : 0; // alpha value

  var cX = Math.cos( _x/2 );
  var cY = Math.cos( _y/2 );
  var cZ = Math.cos( _z/2 );
  var sX = Math.sin( _x/2 );
  var sY = Math.sin( _y/2 );
  var sZ = Math.sin( _z/2 );

  //
  // ZXY quaternion construction.
  //

  quat.w = cX * cY * cZ - sX * sY * sZ;
  quat.x = sX * cY * cZ - cX * sY * sZ;
  quat.y = cX * sY * cZ + sX * cY * sZ;
  quat.z = cX * cY * sZ + sX * sY * cZ;
  
  // Try YXZ quaternion construction instead of ZXY
  // quat.w = cX * cY * cZ + sX * sY * sZ;
  // quat.x = sX * cY * cZ - cX * sY * sZ;
  // quat.y = cX * sY * cZ + sX * cY * sZ;
  // quat.z = cX * cY * sZ - sX * sY * cZ;
}

// var calibration = {
// 	x: 0,
// 	y: 0,
// 	z: 0,
// 	alpha: 0,
// 	beta: 0,
// 	gamma: 0,
// 	rawAlpha: 0,
// 	rawBeta: 0,
// 	rawGamma: 0
// };

// var measurements = {
// 	alpha: null,
// 	beta: null,
// 	gamma: null
// };

// function calibrate() {
// 	for (var i in measurements) {
// 		calibration[i] = (typeof measurements[i] === 'number') ? measurements[i] : 0;
// 	}
// };

window.calibrate = calibrate;

function calibrate(){
	// console.log("ghost", e.alpha, e.beta, e.gamma);

	// scene.ghost.rotation.z = -gamma;
	// scene.ghost.rotation.x = beta;
	// scene.ghost.rotation.y = alpha;
	// calibration.copy(quat).invert().multiply(offsetQuat);
	calibration.copy(offsetQuat).multiply(quat.clone().invert());

	// scene.ghost.quaternion.copy(quat).multiply(calibration);

}

var alpha, gamma, beta; 
const euler = new THREE.Euler(0,0,0,"YXZ"),
	quat = new THREE.Quaternion(),
	offset = new THREE.Euler(Math.PI/2, 0, 0),
	offsetQuat = new THREE.Quaternion().setFromEuler(offset),
	calibration = new THREE.Quaternion();

var first = true;
window.addEventListener("deviceorientation", (e) => {
	// console.log("absolute", e.absolute);

	// console.log("alpha: ", Math.round(e.alpha), "  beta: ", Math.round(e.beta), "  gamma: ", Math.round(e.gamma));
	alpha = degToRad(e.alpha);
	gamma = degToRad(e.gamma);
	beta = degToRad(e.beta);

	euler.set(beta, alpha, -gamma);
	quat.setFromEuler(euler);

	if (first && ( (alpha !== 0) && (beta !== 0) && (gamma !== 0) ) ){
		calibrate();
		first = false;
	}

})

const dir = new THREE.Vector3( 1, 2, 0 );

//normalize the direction vector (convert to vector of length 1)
dir.normalize();

const origin = new THREE.Vector3( 0, 0, 0 );
const length = 6;
const hex = 0xffff00;

const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper );




// window.addEventListener("devicemotion", e => {
// 	// console.log("motion", e)
// 	// dir.set(e.acceleration.x, e.acceleration.y, e.acceleration.z)
// 	// console.log(e.acceleration.x, e.acceleration.y, e.acceleration.z);
// });



const geometry = scene.geometry = new THREE.BoxGeometry(2.5,.5, 5);
const material = scene.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const black = new THREE.MeshStandardMaterial({ color: 0x000000 });
const cube = scene.cube = new THREE.Mesh(geometry, black);
scene.cube.cube = new THREE.Mesh(new THREE.BoxGeometry(2.5, .5, 1), material);
scene.cube.add(scene.cube.cube);
scene.cube.cube.scale.multiplyScalar(0.5);
scene.cube.cube.position.y += 0.3; 
scene.cube.cube.position.z -= 2;

scene.cube.rotation.order = "YXZ";
scene.add(cube);

const ghostMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
const ghostMat2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
scene.ghost = new THREE.Mesh(geometry, ghostMat);
scene.ghost.pillow = new THREE.Mesh(new THREE.BoxGeometry(2.5, .5, 1), ghostMat2);
scene.ghost.add(scene.ghost.pillow);
scene.ghost.pillow.scale.multiplyScalar(0.5);
scene.ghost.pillow.position.y += 0.3;
scene.ghost.pillow.position.z -= 2;

scene.ghost.rotation.order = "YXZ";
// scene.add(scene.ghost);

// Add an ambient light (provides soft, even lighting)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, intensity
scene.add(ambientLight);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  // Color: white, Intensity: 1

// Set the position of the light
directionalLight.position.set(10, 10, 10);  // Position in world space

// Optionally, set the target (what the light is "pointing at")
directionalLight.target.position.set(0, 0, 0);  // Default target is at (0, 0, 0)
// scene.add(directionalLight.target);  // Ensure the target is added to the scene

// Add the light to the scene
scene.add(directionalLight);

// Create a directional light
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);  // Color: white, Intensity: 1

// Set the position of the light
directionalLight2.position.set(5, 5, -5);  // Position in world space

// Optionally, set the target (what the light is "pointing at")
directionalLight2.target.position.set(0, 0, 0);  // Default target is at (0, 0, 0)
// scene.add(directionalLight.target);  // Ensure the target is added to the scene

// Add the light to the scene
scene.add(directionalLight2);


// // Add a point light (acts like a bulb that emits light in all directions)
// const pointLight = new THREE.PointLight(0xffffff, 100); // Color, intensity
// pointLight.position.set(5, 5, 5); // Set light position
// scene.add(pointLight);

// const pointLight2 = new THREE.PointLight(0xffffff, 100); // Color, intensity
// pointLight2.position.set(-15, -15, 5); // Set light position
// // scene.add(pointLight2);

// cube.rotation.x += 0.5;
// cube.rotation.y += 0.5;

var paused = false;
var boost = false;
document.addEventListener("keydown", e => {
	if (e.code == "KeyP"){
		paused = !paused;
	}
	if (e.code == "Space"){
		boost = true;
	}
});

document.addEventListener("keyup", e => {
	if (e.code == "Space"){
		boost = false;
	}	
});


const forward = new THREE.Vector3(0,0,0);

const zero = new THREE.Vector3(0,0,10);
var speed;

var rollForce = 0, pitchForce = 0;

function animate() {
	if (paused)
		return;

	// rotate();

	// ship.rotation.z += 0.01;

	// cube.order = "XZY";
	// cube.rotation.z = -gamma;
	// cube.rotation.x = beta;
	// cube.rotation.y = alpha;

	dir.set(0,1,0).applyQuaternion(quat);
	arrowHelper.setDirection(dir);
	arrowHelper.setLength(dir.length())

	scene.ghost.quaternion.copy(quat);
	// cube.quaternion.copy(quat).premultiply(calibration);
	cube.quaternion.copy(calibration.clone().multiply(quat));

	renderer.render( scene, camera );
}


var reverse = false;
function rotate(){
	if (cube.rotation.x > 1)
		reverse = true;
	else if (cube.rotation.x < -1)
		reverse = false;

	if (reverse)
		cube.rotation.x -= 0.001;
	else 
		cube.rotation.x += 0.001;

	cube.rotation.y += 0.01;
}
renderer.setAnimationLoop( animate );
// animate();

