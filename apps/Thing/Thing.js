import Component from "/module/Component/Component.js";
import Dir from "/module/Dir/Dir.js";

export default class Thing extends Component {
	load_file(){
		// this.file = this.constructor.dir.instances.file(this.name + ".json");
		this.dir = this.constructor.dir.instances.dir(this.name);
		this.file = this.dir.file(this.name + ".json");
	}

	static meta(){
		return import.meta;
	}

	static config(){
		this.instances = [];

		// this.dir = new Dir({

		// });
		console.log(import.meta)

		this.dir = new Dir({
			name: "",
			meta: import.meta
		});

		this.dir.dir("instances");

		this.file = {
			name: this.name + "s.json",
			meta: import.meta
		};
	}

	static new(instance){
		instance.name = instance.name + (this.instances.push(instance) - 1);
		// this.emit("new", instance);
	}
}

await Thing.instantiate();

Thing.set({
	metar: "props"
})

/*

The problem with thing -> thing.json, is we can only have 1...

We might want thing1.json, thing2.json.

We might want Thing/instances/thing1.json, thing2.json

We might want Thing/instances.json [{thing1}, {thing2}]

We might want Thing/instances/thing1/data.json

It depends on how complex the data is...

So we might want variants of this thing...

*/