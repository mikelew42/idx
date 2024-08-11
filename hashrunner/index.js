import { App, el, div, View, h1, h2, h3, p, is, Base } from "/module/App.js";

const app = window.app = await new App().ready;



class HashRunner extends Base {
	async initialize(){
		const directory = await fetch("/directory.json").json();
		this.files = directory.files;
		if (window.location.hash){}
	}
}