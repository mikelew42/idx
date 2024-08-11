import ConnectedModule from "./ConnectedModule.js"

export default class ConnectedClientModule extends ConnectedModule {
	constructor(...args){
		this.instantiate(...args);
	}

	instantiate(...args){
		this.name = this.constructor.name;
		this.assign(...args);
		this.initialize();
	}

	initialize(){
		this.ws = new WebSocket("ws://" + window.location.host);
		this.ws.addEventListener("open", () => this.connected.bind(this));
		this.ws.addEventListener("message", res => this.message(res));

		this.ready = new Promise((res, rej) => {
			this._ready = res;
		});
	}

	assign(...args){
		return Object.assign(this, ...args);
	}

	connected(){
		console.log("%csocket connected", "color: green; font-weight: bold;");
		this.send({ module: "socket", message: "connected!"});
		this._ready();
	}

	async send(obj){
		return this.ready.then(() => {
			this.ws.send(JSON.stringify(obj));
		});
	}

	reload(){
		window.location.reload();
	}

	on_message(res){
		const data = JSON.parse(res.data);
		if (data.module){
			this[data.module].exec(data.method, ...data.args);
		} else if (data.method) {
			this.exec(data.method, ...data.args);
		} else {
			console.error("unknown message", data);
		}
	}

	// maybe this should be called "red", because it's the response.
	// pairing response handler methods with the request name makes sense, but might get confusign...
	read(){
		if (data.method == "read") {
			console.log("read file (" + data.path + "): ", data);
			console.log(data.data.toString())
		}
		// fs.read response

	}
}

class FileSystem extends ConnectedClientModule {

}

const fs = new FileSystem({
	socket
});