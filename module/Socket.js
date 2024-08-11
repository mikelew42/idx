import EventEmitter from "./EventEmitter.js";
import { el, div, View, h1, h2, h3, p, is, Base, icon } from "/module/View.js";

export default class Socket extends EventEmitter {
	initialize(){
		this.ws = new WebSocket("ws://" + window.location.host);
		this.ws.addEventListener("open", () => this.open());
		this.ws.addEventListener("message", res => this.message(res));

		this.ready = new Promise((res, rej) => {
			this._ready = res;
		});
	}
	open(){
		console.log("%cSocket connected.", "color: green; font-weight: bold;");
		this.rpc("log", "connected!");
		this._ready();
	}
	// message recieved handler
	message(res){
		// debugger;
		console.log(res);
		const data = JSON.parse(res.data);
		data.args = data.args || [];
		console.log(data.method + "(", ...data.args, ")");

		this[data.method](...data.args);
	}
	reload(){
		window.location.reload();
		// debugger;
	}

	async send(obj){
		// console.log("sending", obj);
		return this.ready.then(() => {
			this.ws.send(JSON.stringify(obj));
		});
	}

	rpc(method, ...args){
		this.send({ method, args })
	}
	ls(data){
		new FSView({ data })

	}

	cmd(res){
		console.log("cmd response:", res);
	}

	write(filename, data){
		this.rpc("write", filename, data);
	}
}

View.stylesheet("/module/fs.css");
class FSView extends View {
	render(){
		this.bar = div.c("bar", icon("file_copy"), "File System");
		this.children = div.c("children", () => {
			this.files(this.data);
		});
	}

	files(files){
		for (const fd of files){
			if (fd.type == "file"){
				this.file(fd);
			} else {
				this.dir(fd);
			}
		}
	}

	file(fd){
		div.c("file", icon("draft"), fd.name);
	}

	dir(fd){
		const $dir = div.c("dir", {
			bar: {
				folder_icon: icon("folder"), 
				name: fd.name, 
				link_icon: icon("chevron_right")
			},
			children: div(() => {
				this.files(fd.children);
			}).css("display", "none")
		});

		$dir.bar.name.click(() => {
			$dir.children.ac("yes").toggle();
		});

		$dir.bar.link_icon.click(() => {
			window.location = fd.full;
		});
	}
}