import File from "/module/File/File.js";
import is from "/module/is.js";

export default class Component {

	constructor(...args){
		this.instantiate(...args).catch(e => {
			console.error("new " + this.constructor.name + "().instantiate()", e)
		});
		// surprisingly, this makes the console log errors in a different (better?) order (the order in which they occur)
	}

	async instantiate(...args){
		this.config(...args);
		await this.load(); // load the file
		this.initialize(); // then initialize
	}

	initialize(){} // leave empty for extension
	
	config(...args){
		this.name = this.constructor.name.toLowerCase();
		this.classname = this.constructor.name;

		this.File = this.constructor.File; // so load() works on the Class

		this.constructor.new(this);

		this.assign(...args);
	}

	async load(){
		this.file = new this.File(this.file || {
			name: this.name + ".json"
		});

		// this needs to be set without await
		this.ready = this.file.ready.then(() => this);

		// the constructor will finish while we're waiting
		await this.ready;
			// well, the constructor finishes
			// initialize is delayed
			// also, await new Component().ready is also delayed

		// this is how data is passed to the file
			// (by manipulating this object)
		this.data = this.file.data;
	}

	set(name, value){
		if (is.pojo(name)){
			for (const prop in name){
				this.set(prop, name[prop]);
			}
		} else if (value?.setup){
			value.setup(this, name);
		} else {
			const current = this.data[name];

			if (current?.set){
				current.set(value);
			} else {
				this.data[name] = value;	
			}
		}

		this.save();
		
		return this;
	}

	setup(parent, name){
		this.parent = parent;
		this.name = name;


	}

	get(name){
		const value = this.data[name];
		if (value.get)
			return value.get();
		else
			return value;
	}

	assign(...args){
		return Object.assign(this, ...args);
	}

	save(){
		this.file.save();
	}

	static assign(...args){
		return Object.assign(this, ...args);
	}

	static config(){
		this.instances = [];

		this.file = {
			name: this.name + "s.json",
			meta: this.meta()
		};
	}

	// this needs to be rewritten in each file
	static meta(){
		return import.meta;
	}

	static new(instance){
		this.instances.push(instance);
		// this.emit("new", instance);
	}
}

Component.File = File; // 1

Component.assign = Component.prototype.assign;
Component.save = Component.prototype.save;
Component.get = Component.prototype.get;
Component.set = Component.prototype.set;
Component.instantiate = Component.prototype.instantiate;
Component.initialize = Component.prototype.initialize;
Component.load = Component.prototype.load;

// Component.instantiate(); // 2 // shared /module/ can't save...
Component.instances = []; // for now...

// // dir need to create files
// class Dir extends Array {
// 	file(name){
// 		const file = new File({ name });
// 		this.push(file);
// 		return file;
// 	}
// }

// Component.instances = new Dir();