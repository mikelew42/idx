import Base from "./module/Base.js";

import express from "express";
import http from "http";
import url from "url";
import path from "path";
import fs from "fs";
import chokidar from "chokidar";

import SocketServer from "./SocketServer.js";



export default class Server extends Base {

	instantiate(...args){
		this.assign(...args);
		this.config();
	}

	config(){
		const filePath = path.resolve(process.cwd(), 'server.mjs');
		const fileUrl = url.pathToFileURL(filePath).href;
		if (fs.existsSync(filePath)) {
		  import(fileUrl)
		    .then((module) => {
		      const config = module.default;
		      // Use the default export from the server.js file
		      if (typeof config === 'object') {
		      	console.log("server.mjs config", config);
		        this.assign(config);
		      } else {
		        console.log('server.mjs default export is not an object.');
		      }
		      this.initialize();
		    })
		    .catch((error) => {
		      console.error('Error importing server.mjs:', error);
		      this.initialize();
		    });
		} else {
		  console.log('No server.mjs file found.');
		  this.initialize();
		}
	}

	initialize(){
		this.initialize_server();
		
		// use server.mjs file to export default { directory: true }
		if (this.directory){
			this.initialize_directory();
		}

		this.listen();
	}

	initialize_server(){
		this.webroot = process.cwd();
		this.express_app = express();

		this.express_app.use(express.static(this.webroot));

		this.dirname = path.dirname(url.fileURLToPath(import.meta.url));

		this.express_app.use("/module", express.static(this.dirname + "/module"));

		this.http_server = http.createServer(this.express_app);

		this.socket_server = new this.constructor.SocketServer({ 
			http_server: this.http_server,
			server: this
		});
	}

	listen(){
		this.http_server.listen(80, () => {
			console.log("Listening (" + this.webroot + ")");
		});
	}

	initialize_directory(){
		this.watcher = chokidar.watch([ 
			"./",
			"!**/*.json",
			"!**/.git", 
			"!**/node_modules/**" ]);
		
		this.watcher.on("add", this.update_directory.bind(this));
		this.watcher.on("addDir", this.update_directory.bind(this));
		this.watcher.on("unlink", this.update_directory.bind(this));
		this.watcher.on("unlinkDir", this.update_directory.bind(this));

		this.update_directory();
	}

	update_directory(e){
		console.log("Rebuilding directory.json", e);
		fs.writeFileSync("./directory.json", JSON.stringify({ files: this.build_dir("./") }, null, "\t"));
	}

	build_dir(dir, parent){
		const data = fs.readdirSync(dir, { withFileTypes: true });

		console.log(dir, data);

		const result = data.map(file => {
			const new_file = {};
			console.log(file);
			new_file.name = file.name;
			new_file.path = file.path.replace(/\\/g, '/');
			new_file.full = path.join(new_file.path, new_file.name).replace(/\\/g, '/');
			if (file.isFile()){
				console.log("it's a file...");
				new_file.type = "file";
			} else {
				new_file.type = "dir";
				console.log("it's a dir...");
				if (new_file.name !== ".git" && new_file.name !== "node_modules"){
					new_file.children = this.build_dir(new_file.full);
				}
			}

			return new_file;
		});

		console.log(result);

		return result;
	}

}

Server.SocketServer = SocketServer;