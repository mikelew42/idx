import Base from "/module/Base.js";
// import EventEmitter from "./EventEmitter.js";
// import { el, div, View, h1, h2, h3, p, is, icon } from "./View.js";
// import Test, { test } from "./Test.js";
import Socket from "/module/Socket.js";

export default class Component extends Base {
	initialize(){
		this.filename = this.filename || "props.json";
		this.props = this.props || {};

		if (!(this.socket instanceof Socket))
			this.socket = new Socket(this.socket);

		this.send = this.send.bind(this);
		this.load = this.load.bind(this);

		this.ready = Promise.all([this.socket.ready, 
			new Promise(res => this._ready = res)]);

		this.fetch();
	}
	set(name, value){
		this.props[name] = value;
		this.save();
	}
	get(name){
		const value = this.props[name];
		if (value.get)
			return value.get();
		else
			return value;


		/*
		component.get(name){
			const value = this.props[name];
			if (value.get)
				return value.get();
			else
				return value;
		}
		*/
	}

	fetch(){
		const url = import.meta.resolve("./" + this.filename);
		// console.log(url);

		fetch(url).then(async response => {
			// console.log("response", response);

			if (response.ok){
				// this.load(response.json());
				this.load(await response.json());

			} else if (response.statusText == "Not Found"){

				this.socket.rpc("write", 
					window.location.pathname + this.filename, 
					JSON.stringify(this.props, null, 4));

				console.log("Creating " + window.location.pathname + this.filename);

			} else {
				throw "Fetch response not ok: " + response.statusText;
			}
		});
	}

	load(props){
		this.props = props;
		this._ready();
	}

	save(){
		if (!this.saving)
			this.saving = setTimeout(this.send, 0);
	}

	send(){
		// console.log("sending", this.props);
		this.socket.rpc("write", window.location.pathname + this.filename, JSON.stringify(this.props, null, 4));
		this.saving = false;
	}

	setup(parent, name){
		// when added to a parent at parent[name]
	}
}