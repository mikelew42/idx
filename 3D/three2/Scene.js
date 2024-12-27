import * as THREE from "/module/lib/three.js";
import { GLTFLoader } from "/three.js/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from '/three.js/examples/jsm/controls/OrbitControls.js';
export default class Scene extends THREE.Scene {
	constructor(...args){
		super();
		this.instantiate(...args);
	}

	instantiate(...args){
		this.assign(...args);
		this.instantiate_renderer();
		this.instantiate_camera();
		this.instantiate_resize();
		this.initialize();
	}

	initialize(){

	}

	initialize_controls(){
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		// this.controls.update();
		this.controls.addEventListener("change", this.render);
	}

	instantiate_renderer(){
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		this.renderer.setClearColor(0x000000, 0);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(this.renderer.domElement);
		this.width = this.renderer.domElement.clientWidth;
		this.height = this.renderer.domElement.clientHeight;
		this.update = this.update.bind(this);
		this.render = this.render.bind(this);
	}

	instantiate_camera(){
		this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100000);
		this.camera.offset = new THREE.Vector3(0,2,10);
		this.camera.position.add(this.camera.offset);
	}

	instantiate_resize(){
		let resize = () => {
			// console.log(this.renderer.domElement);

			this.width = this.renderer.domElement.clientWidth;
			this.height = this.renderer.domElement.clientHeight;
			// console.log("resize", this.width, this.height);
			this.renderer.setSize(this.width, this.height);

			// undo THREE.js's attributes and css, so it's responsive
			// this.renderer.domElement.removeAttribute("width");
			// this.renderer.domElement.removeAttribute("height");
				// apparently the canvas needs these to render anything
			this.renderer.domElement.style.width = "";
			this.renderer.domElement.style.height = "";

			this.camera.aspect = this.width / this.height;
			this.camera.updateProjectionMatrix();
			this.render();
		};
		window.addEventListener("resize", resize);
		resize();
	}

	play(){
		this.renderer.setAnimationLoop(this.update);
	}

	assign(...args){
		return Object.assign(this, ...args);
	}

	update(){
		this.update_children();
	}

	render(){
		this.update();
		this.renderer.render(this, this.camera);
	}

	update_children(){
		for (const child of this.children){
			if (child.update)
				child.update();
		}
	}
}