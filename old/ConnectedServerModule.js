import ConnectedModule from "./ConnectedModule.js";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import fs from "fs/promises";

export default class ConnectedServerModule extends ConnectedModule {
	constructor(...args){
		this.instantiate(...args);
	}

	instantiate(...args){
		this.assign(...args);
		this.initialize();
	}

	initialize(){
		this.socket; // how do we "listen"?  I think the socket does all the calling?
	}

	assign(...args){
		return Object.assign(this, ...args);
	}
}