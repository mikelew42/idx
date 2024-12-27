import Panel from "./Panel.js";
import { View, Base, Events, App, el, div, h1, h2, h3, p, is, icon, Test, test, app } from "/module/app.js";

console.log("adding stylesheet");
// View.stylesheet("/Panel/panel.css");
await app.css("/Panel/panel.css");

const panel = window.panel = new Panel();

await Promise.all([app.ready, panel.ready]);
// panel.set({
// 	prop1: "value2",
// 	prop2: "value3"
// });

console.log(panel.data);

// div.c("panels panels-four", () => {
// 	div.c("panel leftleft", "leftleft");
// 	div.c("draggable left").on("pointerdown", pointerdown);
// 	div.c("panel leftright", "leftright");
// 	div.c("draggable center").on("pointerdown", pointerdown);
// 	div.c("panel rightleft", "rightleft");
// 	div.c("draggable right").on("pointerdown", pointerdown);
// 	div.c("panel rightright", "rightright");
// });


function pointerdown(){
	//
}

/*

An issue with loading component files in the constructor:
- if we want to RENDER these components...
- we need to wait for app.ready before we can render


A few ways to handle this:
- just await app.ready, and then instantiate, auto render, and load, all at the same time...
- one problem there, is that the data won't be ready...


So, in order to render once the data has loaded, we need to wait for it.  And to wait for it, it needs to be instantiated.  So, we sort of need to preinstantiate, to allow it to load, and then render when ready.

Also, we probably need a Panels manager...

So... 
Components auto-initialize, when they're ready.  But I don't think we want to auto-render...

*/


class Panels extends Base {
	initialize(){
		this.panels = [];
		this.handles = {};
		this.pointermove = this.pointermove.bind(this);
		this.pointerup = this.pointerup.bind(this);
	}

	push(...args){
		return this.panels.push(...args);
	}

	panel(name){
		const panel = new Panel({ name, parent: this });
		this.push(panel);
		return panel;
	}

	render(){
		this.view = div.c("panels panels-" + (this.panels.length + 1), () => {
			for (let i = 0; i < this.panels.length; i++ ){
				this.panels[i].render();
				if (i < this.panels.length - 1)
					this.render_handle(i);
			}
		});

		window.addEventListener("resize", this.resize.bind(this));
		// this.resize();
	}

	resize(){
		// this.move(0);
	}

	render_handle(i){
		this.handles[i] = div.c("draggable left", { vis: div() }).on("pointerdown", this.pointerdown.bind(this, i));
	}

	pointerdown(i, e){

		if (this.panels.length < 2){
			console.error("shouldn't have a drag handle..");
		} else if (this.panels.length === 2){
			this.last_x = e.clientX;
			document.addEventListener("pointermove", this.pointermove);
			document.addEventListener("pointerup", this.pointerup);
			document.body.classList.add("ew-resize");
		}

		const rect = this.handles[i].el.getBoundingClientRect()
		// mouse to handle offset, - is left, + is right
		this.original_offset = e.clientX - (rect.left + rect.width/2);
		console.log("original offset", this.original_offset);
		
	}

	pointermove(e){
		this.move(e.clientX - this.last_x, e);
		this.last_x = e.clientX;
	}

	move(delta_x, e){
		console.group("move");
		console.log("delta_x", delta_x);
		const style = window.getComputedStyle(this.view.el);
		const content_width = this.view.el.clientWidth - parseFloat(style.paddingLeft) - parseFloat (style.paddingRight);

		const left = this.panels[0].view.el.getBoundingClientRect().width;
		const right = this.panels[1].view.el.getBoundingClientRect().width;

		const rect = this.handles[0].el.getBoundingClientRect();
		// mouse to handle offset
		const offset = e.clientX - (rect.left + rect.width / 2) - this.original_offset;

		if (offset < 0){
			this.handles[0].vis.style({
				width: Math.abs(offset) + "px",
				right: ((rect.width/2) - this.original_offset) + "px",
				left: "auto"
			});
		} else {
			this.handles[0].vis.style({
				left: ((rect.width/2) + this.original_offset) + "px",
				width: Math.abs(offset) + "px",
				right: "auto"
			});
		}
		// this.handles[0].vis.style("width", offset + "px");
		console.log("offset", offset);

		console.log("left", left);
		console.log("right", right);

		const new_left = left + delta_x + offset;
		const new_right = right - delta_x - offset;

		console.log("new_left", new_left);
		console.log("new_right", new_right);

		const perc_left = (new_left / content_width) * 100;
		const perc_right = (new_right / content_width) * 100;

		console.log("perc_left", perc_left)
		console.log("perc_right", perc_right)

		this.panels[0].view.style("flex", `1 1 ${perc_left - 5}%`);
		this.panels[1].view.style("flex", `1 1 ${perc_right - 5}%`);
		console.groupEnd("pointermove");
	}
	pointerup(){
		document.removeEventListener("pointermove", this.pointermove);
		document.removeEventListener("pointerup", this.pointerup);
			document.body.classList.remove("ew-resize");

	}
}


const panels = window.panels = new Panels();
panels.panel("yo pointermove pointerup ew-resize yo pointermove pointerup ew-resize left");
panels.panel("yo pointermove pointerup ew-resize yo pointermove pointerup ew-resize 2"); 


panels.render();

/*

We'll need to do some math.
1. We need the full content area of the panels container, on resize.
2. We need the gap, and the width of the divider.

Resize logic
We need to convert pixels to percentages?

But if you "fix" these percentages, then the behavior of the whole thing changes.  For example, if you drag the center handle of a 4 column layout, and fix 2 of the columns to 15% each, for example...

Maybe it works properly?

Or, should they be sort of... fixed?

Once you drag any of the handles, they become fixed in place?

The only way to do that, is to lock the columns to pixel positions.

Also, you'd need to sort of... track which columns have been fixed...

Once you drag any handle, it sets % to all of them?

The tricky part is, when you re-resize things, does the behavior change?


Ok, so Blender basically fixes the locations.  But they're still relative.  So we basically need to compute % whenever a handle moves.

If you compute the % for all the panels, you might get rounding errors...

I guess we can deal with that later.



*/