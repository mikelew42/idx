import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import fs from "fs/promises";
import ConnectedModule from "./module/ConnectedModule.js";

export default class ServerSocket extends ConnectedModule {
	count = 0;

	initialize(){
		if (!this.app.server)
			console.error("must provide app.server");

		this.wss = new WebSocketServer({
			perMessageDeflate: false,
			server: this.app.server
		});

		this.wss.on("connection", this.connection.bind(this));

		this.ready = new Promise((res, rej) => {
			this._ready = res;
		});

		this.watcher = chokidar.watch("./");
	}

	connection(ws, req){
		this.ws = ws;
		this._ready();
		console.log("connected", ++this.count);
		ws.on("message", this.message.bind(this));
		const changed = this.changed.bind(this);
		
		this.watcher.on("change", changed);
	}

	async send(obj){
		return this.ready.then(() => {
			this.ws.send(JSON.stringify(obj));
		});
	}

	async message(data){
		data = JSON.parse(data.toString());
		console.log("message", data);

		if (data.module == "app"){
			if (data.method && this.app[data.method]){
				console.log("app."+data.method+"() found");
				this.app.exec(data.method, data.args);
			} else {
				console.error("app module, no matching method");
			}
		} else if (this.app[data.module]){
			console.log("app."+data.module+" module found");
			this.app[data.module].exec(data.method, data.args);
		} else {
			console.error("could not match message with module");
		}
	}

	changed(e){
		console.log(e, "changed, sending reload message");
		this.ws.send(JSON.stringify({ module:"reload" }), (err) => {
			if (err) console.log("livereload transmit error");
			else console.log("reload message sent");
		});
	}

	assign(...args){
		return Object.assign(this, ...args);
	}
}