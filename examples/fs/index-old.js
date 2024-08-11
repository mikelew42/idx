import App from "/module/App.js";
import { el, div, View, h1, h2, h3, p, is, Base } from "/module/View.js";


function icon(name){
	return el.c("span", "material-symbols-rounded", name);
}

const body = View.body().init();
const app = window.app = new App();

// h1("This is index.js").style({
// 	"color": "blue", 
// 	"font-size": "100px", 
// 	"font-family": "Tahoma",
// 	"font-weight": "bold"
// });

// icon("folder");
// icon("folder_open");

// div.c("file-edit-test", () => {

// 	h3("file edit test");

// 	div.c("file-contents", "edit here").attr("contenteditable", true).on("input", d => {
// 		app.rpc("editor", d.html());
// 	});
// })

class List extends Base {
	initialize(){
		this.items = [];
	}

	add(item){
		this.items.push(item);
		return this;
	}

	render(){
		this.div = div.c("list");
		this.update();
	}

	update(){
		this.div.html("");
		this.div.append(() => {
			for (const item of this.items){
				div(item).attr("contenteditable", "true");
			}
		});
	}
}

app.loadables.list = List;

const list = new List();

list.add("one").add(true).add(3);
list.render();