import Base from "/module/Base.js";
import File from "/module/File/File.js";
import is from "/module/is.js";


export default class Directory extends Base {
	initialize(){
		if (!this.name)
			throw "Must provide directory.name";

		if (this.meta){
			this.url = this.meta.resolve("./" + this.name);
			this.path = new URL(this.url).pathname;
		} else {
			this.path = window.location.pathname + this.name;
			this.url = window.location.href + this.name;
		}

		console.log("path", this.path);
		console.log("url", this.url);
	}
	file(name){
		// if filename.ext, we use this.filename
		// might be a problem if you have filename.ext1 and filename.ext2
		return this[remove_ext(name)] = new File({ name,
			meta: this.meta // might be undefined
		});
	}
}


function remove_ext(name){
	const parts = name.split(".");
	parts.pop();
	return parts;
}

/*

If Directory is just a helper for keeping track of paths:

So, essentially each component that has a directory can have a .dir object that can easily (make) load files...



*/