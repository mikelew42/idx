import { App, el, div, View, h1, h2, h3, p, is, Base, test, Test } from "/module/App.js";

View.stylesheet("List.css");

export default function (app){
	this.view.ac("gray");
	console.log(app);

	const list = new List();
	list.make(10);
	list.render();
}

class Drag {

}

    function onDrag(event) {
        if (!isDragging) return;

        let clientX = event.clientX;
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
        }

        const sliderRect = slider.getBoundingClientRect();
        let newLeft = clientX - sliderRect.left;

        newLeft = Math.max(0, newLeft);
        newLeft = Math.min(sliderRect.width, newLeft);

        handle.style.left = `${newLeft}px`;
    }

    function stopDrag() {
        isDragging = false;
        document.body.style.userSelect = 'auto';
    }


/*

DragManager, singleton
- keeps a is_dragging boolean
- mousemove events can fire on all events, and just return false if !is_dragging
- must prioritize children over parent reordering?
	if both child has mousemove fire, but also the parent, the child needs to take precedence...

You could either have some sort of per-level tracking, where each level can only have 1 active drop zone.  


*/

class Item {}
class List extends Base {
	instantiate(...args){
		this.items = [];

		this.assign(...args);

		this.mousemove = this.mousemove.bind(this);
		this.mouseup = this.mouseup.bind(this);
		this.mousedown = this.mousedown.bind(this);
		this.dragover = this.dragover.bind(this);

		this.initialize();
	}

	render(){
		this.view = div.c("list", {
			name: this.name || "undefined",
			container: () => {
				this.each(item => item?.render())
			}
		});

		this.view.name.attr("draggable", "true").on("mousedown", this.mousedown);
		this.view.name.el.addEventListener("mousemove", this.dragover);

		this.view.name.on("drag", console.log);
	}

	/*

	Fuck... it's getting away from me:

	I don't like this "add events for everything" style...
	It might make the code a little simpler, but fuck...

	I'd have to check if anything is even being dragged, which means I need a global drag manager...



	*/

	mousedown(e){
		e.preventDefault();
		this.dragging = true; // we probably need to differentiate between clicks and drags, because this will fire for clicks
		this.view.ac("dragging");
		View.body().ac("dragging");
		document.addEventListener("mouseup", this.mouseup);
	}

	mouseup(){
		this.view.rc("dragging");
		// this.dragover.classList.remove("dragover");
		View.body().rc("dragging");
		// document.removeEventListener("mousemove", this.drag_handler);

	}

	dragover(e){

	}

	mousemove(e){
		// lets try to make this both the drag handler, and the dragover handler?
		console.log(e.clientX, e.clientY, e.target);

		if (this.dragging){

			// one issue with using e.target, is that we can't easily figure out if this is a drop target, and which List it belongs to...
			if (this.target !== e.target){
				if (this.target)
					this.target.classList.remove("dragover");
				this.target = e.target;
				this.target.classList.add("dragover");
			} else {
				// do nothing
			}


		} else if (e.target == this.view.name.el) {
			console.log("todo: potential drop target");
		} else if (e.target == this.view.container.el){
			console.log("todo: potential drop container");
		}





		// calculate drop zones
		// add a placeholder div for in-between and ac dragover for visual

	}

	/* 

	If you're calling this method, you have a handle on `this`?
	Well, the only case I can think of, is when you're chaining, and switch the chaining context, so you no longer actually have a handle on it..

	thing1.get("thing2").each(...)
		now, we don't have a handle on thing2, and calling the fn with the context isn't terrible and doesn't hurt anything...
	*/
	each(fn){
		for (let i = 0; i < this.items.length; i++){
			fn.call(this, this.items[i], i);
		}
		return this;
	}

	add(item){
		this.items.push(item);
		return this;
	}

	make(n){
		for (let i = 1; i <= n; i++){
			this.add(new this.constructor({ name: "item " + i}));
		}
		return this;
	}
}