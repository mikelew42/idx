import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import fs from "fs/promises";

export default class ServerSocket {
	
	count = 0;

	constructor(...args){
		this.instantiate(...args);
	}

	instantiate(...args){
		this.assign(...args);
		this.initialize();
	}

	initialize(){
		if (!this.server)
			throw "must define .server";

		this.wss = new WebSocketServer({
			perMessageDeflate: false,
			server: this.server
		});

		this.wss.on("connection", this.connection.bind(this));

		this.watcher = chokidar.watch("./");
	}

	connection(ws, req){
		this.ws = ws;
		console.log("connected", ++this.count);
		
		const changed = this.changed.bind(this);
		
		this.watcher.on("change", changed);

		ws.on("close", () => this.watcher.off("change", changed));
		ws.on("message", this.message.bind(this));
	}

	async message(data){
		// console.log("data", data.toString());

		// console.log("process.cwd()", process.cwd());
		// console.log("dirname", this.dirname);
		data = JSON.parse(data.toString());
		if (data.method == "write"){
			fs.writeFile(data.path, data.data);
		} else if (data.method == "read"){
			const file_data = await fs.readFile(data.path, {encoding: "utf8"});
			console.log(file_data);
			this.ws.send(JSON.stringify({ 
				module: "fs",
				method: "read",
				path: data.path,
				data: file_data
			}));
		} else if (data.method == "delete"){
			fs.unlink(data.path);
		} else if (data.method == "mkdir"){
			fs.mkdir(data.path);		
		} else if (data.method == "rm"){
			fs.rm(data.path, data.options);
		} else {
			console.log("unknown method", data);
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