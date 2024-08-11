import EventEmitter from "./EventEmitter.js";
import { el, div, View, h1, h2, h3, p, is, Base, icon } from "/module/View.js";

import FSView from "/module/FSView.js";

export default class Socket extends EventEmitter {
	initialize(){
		this.ws = new WebSocket("ws://" + window.location.host);
		this.ws.addEventListener("open", () => this.open());
		this.ws.addEventListener("message", res => this.message(res));

		this.ready = new Promise((res, rej) => {
			this._ready = res;
		});
	}
	open(){
		console.log("%cSocket connected.", "color: green; font-weight: bold;");
		this.rpc("log", "connected!");
		this._ready();
	}
	// message recieved handler
	message(res){
		// debugger;
		console.log(res);
		const data = JSON.parse(res.data);
		data.args = data.args || [];
		console.log(data.method + "(", ...data.args, ")");

		this[data.method](...data.args);
	}
	reload(){
		window.location.reload();
		// debugger;
	}

	async send(obj){
		// console.log("sending", obj);
		return this.ready.then(() => {
			this.ws.send(JSON.stringify(obj));
		});
	}

	rpc(method, ...args){
		this.send({ method, args })
	}
	ls(data){
		new FSView({ data })

	}

	cmd(res){
		console.log("cmd response:", res);
	}

	write(filename, data){
		this.rpc("write", filename, data);
	}
}

