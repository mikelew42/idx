import Component from "../Component/Component.js";

export default class Thing extends Component {
	initialize(){
		this.file = new this.constructor.File({ name: "thing.json", relative: true });
	}

	static initialize(){
		this.file = new this.File({ name: "data.json" })
	}
}