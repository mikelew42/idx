import { App, el, div, View, h1, h2, h3, p, is, Base, test, Test, EventEmitter } from "/module/App.js";

View.stylesheet("List.css");

export default function (app){
	this.view.ac("gray");
	console.log(app);

	const list = new List({ name: "Root" });
	list.make(10);
	list.render();
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

function findClosestNumber(array, inputNumber) {
	// debugger;
    // Initialize variables to store the closest number and the smallest difference
    let closestNumber = array[0];
    let smallestDifference = Math.abs(array[0] - inputNumber);
    let index = 0;

    // Loop through the array
    for (let i = 1; i < array.length; i++) {
        // Calculate the difference between the current array element and the input number
        const currentDifference = Math.abs(array[i] - inputNumber);

        // If the current difference is smaller than the smallest difference found so far
        if (currentDifference < smallestDifference) {
            // Update the smallest difference and the closest number
            smallestDifference = currentDifference;
            closestNumber = array[i];
            index = i;
        }
    }

    // Return the closest number found
    return { value: closestNumber, index };
}

// Example usage
const array = [2, 5, 8, 14, 25];
const inputNumber = 10;
const closest = findClosestNumber(array, inputNumber);
console.log(`The closest number to ${inputNumber} is `, closest);


class Item {}
class List extends EventEmitter {
	instantiate(...args){
		this.items = [];

		this.assign(...args);

		this.mousemove = this.mousemove.bind(this);
		this.mouseup = this.mouseup.bind(this);
		this.mousedown = this.mousedown.bind(this);

		this.initialize();
	}

	render(){
		this.view = div.c("list " + this.name.replace(" ", ""), {
			bar: {
				name: div(this.name || "undefined"),
				add: div("add").click(() => this.add()),
				delete: div("delete").click(() => this.parent.remove(this))
			},
			container: div()
		});

		this.view.name = this.view.bar.name;

		this.update();

		this.view.name.on("pointerdown", this.mousedown);
	}

	update(){
		// because we don't auto-render (upon instantiation)
		// we can new List().add() which triggers update...
		if (!this.view)
			return;
		this.view.container.empty().append(() => {
			this.each(item => item?.render());
		});
	}

	/*

	Fuck... it's getting away from me:

	I don't like this "add events for everything" style...
	It might make the code a little simpler, but fuck...

	I'd have to check if anything is even being dragged, which means I need a global drag manager...



	*/

	mousedown(e){
		if (!this.cursor){
			this.cursor = div.c("drag-cursor");
		}
		e.preventDefault();
		document.addEventListener("pointermove", this.mousemove);
		this.dragging = true; // we probably need to differentiate between clicks and drags, because this will fire for clicks
		this.view.ac("dragging");
		View.body().ac("dragging");
		document.addEventListener("pointerup", this.mouseup);
	}

	mousemove(e){
		// lets try to make this both the drag handler, and the dragover handler?

				// this affects the layout...
				// this.cursor.remove(); // might affect the childElementCount below

		if (this.dragging){

			// one issue with using e.target, is that we can't easily figure out if this is a drop target, and which List it belongs to...
			if (this.target !== e.target){
				console.log(e.clientX, e.clientY, e.target);

				if (this.target){
					this.target.classList.remove("dragover");
				}

				if (this.target_list){
					this.target_list.view.rc("dragover");
				}
				this.last_target = this.target;
				this.target = e.target;
				
				// this.target.classList.add("dragover");
				// this should be merged with the below target lookup, just testing something
				this.target_list = this.get_item_from_target(this.target);
				// if (this.target_list ) this.target_list.view.ac("dragover");
				if (this.target_list && this.target_list !== this) this.target_list.view.ac("dragover");
			}

			// if drop target == this.parent && index == this.index, no cursor,  
			// had problems with target.classList.contains("container"), due to .test > .container same class name...
			if (this.target.matches(".list > .container")){

				if (this.last_target !== this.target){

				}
				console.log("container target");
				const target_list = this.get_item_from_target(this.target);
				
				// assume dom children match list children?  now we allow the cursor...
				// if (target_list.items.length !== this.target.childElementCount){
				// 	console.warn("mismatch, might cause problems, shouldn't happen");
				// }

				const real_children = Array.from(this.target.children).filter(c => c !== this.cursor.el);
				// console.log("real", real_children);

				// y coordinate midpoints for each child
				const midpoints = [];
				for (const child of real_children){
					midpoints.push(
						child.getBoundingClientRect().top 
					 + (child.getBoundingClientRect().height / 2)
					);
				}

				// returns { value, index }

				console.log("midpoints", midpoints);
				const nearest = findClosestNumber(midpoints, e.clientY);

				if (e.clientY < nearest.value){
					// nearest.insert_index = Math.max(0, nearest.index - 1); // ensures we don't go below 0
					nearest.insert_index = nearest.index; // ensures we don't go below 0
				} else {
					nearest.insert_index = nearest.index + 1;
				}

				nearest.el = real_children[nearest.insert_index];

				console.log(nearest);

				if (nearest.el !== this.last_nearest_el){
					this.last_nearest_el = nearest.el;
					console.log("new target...");
					this.target.insertBefore(this.cursor.el, nearest.el);
					this.target.classList.add("has-cursor");
					// setTimeout(() => this.cursor.ac("grow"), 0);
					this.cursor.ac("grow");
				} else {
					console.log("same target...")
				}
				// this.cursor.ac("grow");
			} else {
				this.clear_cursor();
			}
		} else {
			// mousemove handler should be removed on mouseup, and dragging=false
			console.warn("this shouldn't happen...");
		}
	}

	clear_cursor(){
		this.cursor.el.parentElement?.classList.remove("has-cursor");
		this.cursor.remove().rc("grow");
		delete this.last_nearest_el; // clear this so it updates properly
	}

	mouseup(e){
		this.dragging = false;
		document.removeEventListener("pointermove", this.mousemove);
		document.removeEventListener("pointerup", this.mouseup);
		this.view.rc("dragging");
		View.body().rc("dragging");
		this.target?.classList.remove("dragover");
		this.clear_cursor();

		const target = this.get_item_from_target(e.target);


		// debugger;
		if (target && target !== this){
			if (this.is_descendant(target)){
				console.warn(`Can't drop a parent (${this.name}) into a child (${target.name})`);
				return;
			}
			
			this.parent.remove(this);
			target.add(this);
		}

	}

	// note: items are lists, for now
	get_item_from_target(target, search_parents = true){

		if (this.view.el.contains(target)){
			// maybe its this, maybe its a child...

			var child_match;
			this.each(child => {
				child_match = child.get_item_from_target(target, false);
				if (child_match) return false;
			});

			if (child_match){
				return child_match;
			}

			return this;
		} else if (search_parents){
			// parent match?
			var parent = this.parent?.get_item_from_target(target);
			if (parent){
				return parent;
			}
		}
		return false;
	}

	is_descendant(child){
		var found = false;
		this.each(item => {
			if (item === child){
				console.log(``)
				found = true;
				return false;
			} else {
				found = item.is_descendant(child)
				if (found){
					return false;
				}
			}
		});
		return found;
	}

	insert(item, index) {
		// Use splice to insert the item at the specified index
		this.items.splice(index, 0, item);
		this.update();
		return this;
	}

	remove(child){
		this.each((item, i) => {
			if (item === child){
				this.items.splice(i, 1);
			}
		});
		this.update();
	}

	find(fn){
		var result;
		this.each(function find(v, i){
			if (fn(v, i)){
				result = v;
				return false;
			}
		});
		return result;
	}

	each(fn){
		for (let i = 0; i < this.items.length; i++){
			if (fn.call(this, this.items[i], i) === false)
				return this; // return false to stop early
		}
		return this;
	}

	add(item){
		if (!item){
			item = new this.constructor({ 
				name: "item" + this.items.length 
			});
		}
		item.parent = this;
		this.items.push(item);
		this.update();
		return this;
	}

	make(n){
		for (let i = 1; i <= n; i++){
			this.add(new this.constructor({ name: "item " + i }));
		}
		return this;
	}
}