import ConnectedModule from "./module/ConnectedModule.js";
import ServerSocket from "./ServerSocket.js";

export default class App extends ConnectedModule {
	initialize(){
		this.socket = new ServerSocket({ app: this });
	}

	method1(){
		console.log("this is app.method1()", arguments);
	}

	pong(...args){
		this.rpc("pong", ...args);
	}
};