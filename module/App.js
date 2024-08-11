import Base from "./Base.js";
import EventEmitter from "./EventEmitter.js";
import { el, div, View, h1, h2, h3, p, is, icon } from "./View.js";
import Test, { test } from "./Test.js";
import Socket from "./Socket.js";

View.stylesheet("/module/base.css");




class App extends Base {


	initialize(){
		if (this.is_dev()){
			this.initialize_socket();
			this.initialize_dev_ready();
		} else {
			this.initialize_ready();
		}
		this.initialize_google_icon_font();
		this.initialize_body();
	}

	is_dev(){
		return window.location.hostname == "localhost";
	}

	initialize_dev_ready(){
		this.ready = Promise.all([this.socket.ready, this.DOMready()]).then(() => this);
	}

	DOMready(){
		return new Promise((res, rej) => {
			document.addEventListener('DOMContentLoaded', () => res(this));
		});
	}

	initialize_ready(){
		this.ready = this.DOMready();
	}

	initialize_body(){
		this.body = View.body().init();
	}

	initialize_saver(){
		this.saver = new Saver({ app: this }, this.saver);
	}

	initialize_google_icon_font(){
		View.stylesheet("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0");
	}

	initialize_socket(){
		this.socket = new Socket(this.socket); // you could pass socket: {config} to App this way...
	}
}

export { View, Base, EventEmitter, App, el, div, h1, h2, h3, p, is, icon, Test, test };