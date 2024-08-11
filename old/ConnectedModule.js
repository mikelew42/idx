export default class ConnectedModule {
	constructor(...args){
		this.instantiate(...args);
	}

	instantiate(...args){
		this.name = this.constructor.name.toLowerCase();
		this.assign(...args);
		this.initialize();
	}

	initialize(){}

	assign(...args){
		return Object.assign(this, ...args);
	}

	async rpc(method, ...args){
		return await this.socket.send({
			module: this.name,
			method,
			args: args
		}); // can we setup a socket request+response system?
	}

	exec(method, args){
		// console.log("exec", method, args);
		if (this[method]){
			if (args){
				this[method](...args);
			} else {
				this[method]();
			}
		} else {
			console.error("no such method");
		}
	}

	log(...args){
		console.log(...args);
	}

	ping(method, ...args){
		this.rpc("pong", method, ...args);
	}
	// no no, just do app.rpc("rpc", "log", "args");  this works
	pong(method, ...args){
		this.rpc(method, ...args);
	}
}