import { App, el, div, View, h1, h2, h3, p, is, Base } from "/module/App.js";

export default class List {
	add(name){
		this.lists.push(new List({ name }));
	}

	render(){
		this.view = div.c("list", 
			this.bar = div.c("bar", this.name).click(this.click.bind(this)),
			this.container = div.c("container", this.lists) // renders each list properly?			

			// this.container = div.c("container", () => {
			// 	for (const list in this.lists){
			// 		list.render();
			// 	}
			// })
		);
	}

	click(){

	}

}

