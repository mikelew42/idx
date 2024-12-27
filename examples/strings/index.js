import { App, el, div, View, h1, h2, h3, p, is, icon, Base, Events } from "/module/App.js";

const app = window.app = await new App().ready;

class ArrayValueView extends View {
	render(){
		this.$value = div.c("value", this.value);
		this.$remove = icon("close").click(() => {
			this.remove();
			this.array.splice(this.i, 1);
		});
	}
}

class ArrayView extends View {
	render(){
		this.children = [];
		for (let i = 0; i < this.array.length; i++){
			this.children.push(new ArrayValueView({ value: this.array[i], array_view: this, i, array: this.array }));
		}
	}
}
// vs

h1("Hi");
p("This is a paragraph.", el("span", "span"), "and more");
app.array_view = new ArrayView({
	array: [1, true, "three"]
});

app.array_view2 = new ArrayView({
	array: [1, true, "three", 1, true, "three"]
});

/*

What about drag and drop, reordering, adding new (at any location?)

Drag and drop + order => need to... splice?

*/