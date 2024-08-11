import is from "./is.js";

class ClientSocket {
	constructor(...args){
		this.instantiate(...args);
	}

	instantiate(...args){
		this.assign(...args);
		this.initialize();
	}

	initialize(){
		this.ws = new WebSocket("ws://" + window.location.host);
		this.ws.addEventListener("open", () => this.open());
		this.ws.addEventListener("message", res => this.message(res));

		this.ready = new Promise((res, rej) => {
			this._ready = res;
		});
	}

	assign(...args){
		return Object.assign(this, ...args);
	}

	message(res){
		const data = JSON.parse(res.data);
		if (data.module === "reload"){
			window.location.reload();
		} else if (data.method == "read") {
			console.log("read file (" + data.path + "): ", data);
			console.log(data.data.toString())
		} else {
			console.log("message from server:", res.data);
		}
	}

	async send(obj){
		return this.ready.then(() => {
			this.ws.send(JSON.stringify(obj));
		});
	}

	msg(msg){
		this.send({ module: "socket", message: msg});
	}

	mkdir(path){
		this.send({
			module: "fs",
			method: "mkdir",
			path: path
		});
	}

	open(){
		console.log("%csocket connected", "color: green; font-weight: bold;");
		this.send({ module: "socket", method:"log", args: [["connected!"]]});
		this._ready();
	}

	async file(path, data){
		// console.log("file", path, data);
		const obj = {
			module: "fs",
			method: data ? "write" : "read",
			data: data,
			path: path
		};
		return this.send(obj);
	}
}

export { ClientSocket };
export default new ClientSocket();