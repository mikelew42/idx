import Base from "/module/Base.js";
import socket from "/module/socket.js";

File.socket = socket;

export default class File extends Base {

	initialize(){
		if (!this.name)
			throw "Must provide file.name";

		// pass `meta: import.meta` for script-relative file
		if (this.meta){
			this.url = this.meta.resolve("./" + this.name);
			this.path = new URL(this.url).pathname;
		} else {
			this.path = window.location.pathname + this.name;
			this.url = window.location.href + this.name;
		}

		console.log("path", this.path);
		console.log("url", this.url);


		if (!this.constructor.socket)
			this.constructor.socket = new Socket();

		this.send = this.send.bind(this);
		this.load = this.load.bind(this);

		this.ready = Promise.all([
			this.constructor.socket.ready, 
			new Promise(res => this._ready = res)
		]);

		this.fetch();
	}

	fetch(){

		fetch(this.url).then(response => {
			// console.log("response", response);

			if (response.ok){
				response.json().then(data => this.load(data));

			} else if (response.statusText == "Not Found"){
				// create an empty json file
				this.stringify({});

			} else {
				throw "Fetch response not ok: " + response.statusText;
			}
		});
	}

	load(data){
		this.data = data;
		this._ready();
	}

	stringify(data){
		this.data = JSON.stringify(data, null, 4);
		this.save();
	}

	save(){
		if (!this.saving)
			this.saving = setTimeout(this.send, 0);
	}

	send(){
		// console.log("sending", this.props);
		this.constructor.socket.rpc("write", this.path, this.data);
		this.saving = false;
	}
}

/*
Might we need module-relative files AND path-relative files?

module/
	Thing/
		Thing.js
		data.json

path/
	index.js
	thing.json

Maybe Thing.js, even when imported from any arbitrary path, might want to save something to it's own data.json.

But it also might want to create a thing.json at the current path, in order to save path-relative data.

*/