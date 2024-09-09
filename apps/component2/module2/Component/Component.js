import File from "/module/File/File.js";

export default class Component {

	constructor(...args){
		this.instantiate(...args);
	}

	instantiate(...args){
		this.configure(...args);
		this.initialize();
	}

	configure(...args){
		let Component = this.constructor; // dynamic lookup

		this.name = Component.name.toLowerCase();
		this.classname = Component.constructor.name;

		this.assign(...args);
		
	}

	configure_file(){
		this.file = new Component.File({ 
			name: "comp.json" 
		});
	}

	assign(...args){
		return Object.assign(this, ...args);
	}

	initialize(){} // leave empty for extension

	ready(){
		if (!this.ready){
			this.ready = Promise.all([
				this.file.ready,
				this.constructor.meta.ready
			]);
		}
		return this.ready;
	}

	save(){
		this.file.stringify(this.data);
	}

	static initialize(){
		this.meta = new this.File({
			name: "meta.json",
			meta: import.meta
		});
	}
}

Component.File = File; // 1
Component.initialize(); // 2


// // dir need to create files
// class Dir extends Array {
// 	file(name){
// 		const file = new File({ name });
// 		this.push(file);
// 		return file;
// 	}
// }

// Component.instances = new Dir();