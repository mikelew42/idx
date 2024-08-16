import EventEmitter from "../module/EventEmitter.js";

import fs from "fs";
import path from "path";

// for the cmd() method
import { exec } from "child_process";

import { WebSocketServer } from "ws";

import chokidar from "chokidar";

// could separate Reload/Watcher from Socket..


export default class SocketServer extends EventEmitter {
	count = 0;

	initialize(){
		this.wss = new WebSocketServer({
			perMessageDeflate: false,
			server: this.http_server
		});

		this.wss.on("connection", this.connection.bind(this));

		// this.ready = new Promise((res, rej) => {
		// 	this._ready = res;
		// });

		this.watcher = chokidar.watch([ 
			"./",
			"!**/*.json",
			"!**/.git", 
			this.server.dirname + "/module/" ]);
		
		this.watcher.on("change", this.changed.bind(this));

		this.sockets = [];
	}


	connection(ws, req){
		const socket = new this.constructor.Socket({
			socket_server: this,
			ws: ws,
			server: this.server
		});
		this.sockets.push(socket);
		// this.ws = ws;
		// this._ready();
		// console.log("connected", ++this.count);
		

		this.emit("connection", socket);
		console.log("new Socket, connected", this.sockets.length);
	}
	changed(e){
		console.log(e, "changed, sending " + this.sockets.length + " reload messages");
		for (const socket of this.sockets){
			socket.send({ method: "reload" });
		}
		// this.send({ module:"reload" });
	}
}

class Socket extends EventEmitter {
	initialize(){
		this.ws.on("message", this.message.bind(this));
		this.ws.on("close", () => {
			this.socket_server.sockets = this.socket_server.sockets.filter(socket => socket !== this);
		});
	}

	send(obj){
		this.ws.send(JSON.stringify(obj)); // error handling?
	}

	async message(data){
		data = JSON.parse(data.toString());
		data.args = data.args || [];
		console.log(data.method + "(", ...data.args, ")");

		this[data.method](...data.args);
	}

	log(){
		console.log(...arguments);
	}

	rpc(method, ...args){
		this.send({ method, args })
	}

	write(file, data){
		fs.writeFile(toRelativePath(file), data, err => {
			if (err) console.error(err);
			else console.log("File: ", file, " written successfully.");
		});

		//  /path/file.json  -> ./path/file.json
		//  file.json -> ./file.json
		//  ./file.json -> ./file.json
		//  ../file.json -> ../file.json
		// @author ChatGPT
		function toRelativePath(filePath) {
		  if (path.isAbsolute(filePath)) {
		    return `.${filePath}`;
		  } else if (!filePath.startsWith('./') && !filePath.startsWith('../')) {
		    return `./${filePath}`;
		  } else {
		    return filePath;
		  }
		}
	}

	ls(dir = "./") {
		this.rpc("ls", this.server.build_dir(dir));
	}

	cmd(cmd){

	    exec(cmd, (error, stdout, stderr) => {
	        if (error) {
	            console.error(`Error executing command: ${error.message}`);
	            return;
	        }

	        if (stderr) {
	            console.error(`stderr: ${stderr}`);
	            return;
	        }

	        console.log(`stdout: ${stdout}`);

	        this.rpc("cmd", stdout);
	    });

	}

	editor(contents){
		fs.writeFileSync("./testeditor", contents);
	}

}

SocketServer.Socket = Socket;