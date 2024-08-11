import { App, el, div, View, h1, h2, h3, p, is, Base } from "/module/App.js";

const app = window.app = await new App().ready;

app.body.ac("pad1em");

class Tabs extends Base {

	initialize(){
		this.tabs = [];

		View.stylesheet("tabs.css");
	}

	add(label, content){
		this.tabs.push({ label, content });
		return this;
	}

	render(){
		this.view = div.c("tabs", {
			labels: () => {
				for (const tab of this.tabs){
					tab.$label = div.c("label", tab.label).click(() => {
						this.activate(tab);
					});
				}
			},
			contents: () => {
				for (const tab of this.tabs){
					tab.$content = div.c("content", tab.content);
				}
			}
		});

		this.activate(this.tabs[0]);
	}

	activate(tab){
		if (this.active_tab){
			this.active_tab.$label.rc("active");
			this.active_tab.$content.rc("active");
		}

		tab.$label.ac("active");
		tab.$content.ac("active");
		this.active_tab = tab;
	}
}

const tabs = app.tabs = new Tabs();

tabs.add("one", () => {
	h3("Notes");
	p("This works by:");
	el("ul", () => {
		el("li", "auto rendering all contents");
		el("li", "hiding all but the active");
		el("li", "defaults to activating the first tab");
	});

	p("In the Tests system, all tests auto run unless there's an isolated test.  In that case, only the iso'd test runs.")
});
tabs.add("contenteditable", () => {
	div().attr("contenteditable", "true");
});
tabs.add("three", "three content");

tabs.render();

/*

We could also make tabs() a quickie function:

tabs({
	one(){
		
	}
	two(){
		
	}
	three(){
		
	}
})

It's just that you don't have much control over the tab content or styling...

You could potentially have array pairs:
tabs([btn, content], [btn, content])

*/