import is from "/module/is.js";

export default class ClientSocket {
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

	open(){
		console.log("%csocket connected", "color: green; font-weight: bold;");
		this.app.rpc("log", "connected!!! woohoo");
		this._ready();
	}

	assign(...args){
		return Object.assign(this, ...args);
	}

	// message recieved handler
	message(res){
		console.log(res);
		const data = JSON.parse(res.data);
		// console.log("message", data);
		if (!data.module){
			console.error("must provide module name");
			return;
		}

		if (data.module == "app"){
			if (data.method && this.app[data.method]){
				// console.log("app."+data.method+"() found");
				this.app.exec(data.method, data.args);
			} else {
				console.error("app module, no matching method");
			}
		} else if (this.app[data.module]){
			// console.log("app."+data.module+" module found");
			this.app[data.module].exec(data.method, data.args);
		}
	}

	async send(obj){
		return this.ready.then(() => {
			this.ws.send(JSON.stringify(obj));
		});
	}
};