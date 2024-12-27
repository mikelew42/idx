import Component from "/module/Component/Component.js";
import { View, Base, el, div, h1, h2, h3, p, is, icon } from "/module/View/View.js";

export default class Panel extends Base {
	initialize(){

	}

	render(){
		this.view = div.c("panel " + this.name, this.name);
	}

	layout(){

	}
}