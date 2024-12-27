import Events from "./module/Events.class.js";

import chokidar from "chokidar";

/* Must pass .socket property */
export default class Reload extends Base {
	initialize(){
		if (!this.socket_server)
			throw "must provide socket_server to new Reload instance";

		// this.socket_server.on("connection", socket => {
		// 	this.push
		// });

		this.watcher = chokidar.watch("./");
		this.watcher.on("change", this.changed.bind(this));
	}

	changed(e){
		console.log(e, "changed, sending reload messages");
		this.socket_server.sockets.forEach(socket => {
			socket.send({ module: "reload" });
		});
	}
}