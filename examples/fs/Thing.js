import EventEmitter from "/module/EventEmitter.js";
import { el, div, View, h1, h2, h3, p, is, Base } from "/module/View.js";


/*

Since this is a savable thing, we assume idempotence (we assume items are coming from storage).

And so, upon instantiation, the data should be accurate, so we don't need to change the data nor save it.

We really want to GET the data object, and link it in properly...

But how is it setup the first time?
Every time we extend a class, we have to initialize it with the saver, one time only?
This could be a static init function that checks if there's any data yet, and creates it that once.

*/
export default class Thing extends EventEmitter {

	/*

	.data => references the saver's data property

	Because the .data for each thing is always already in place, we don't need a .data() function
	We just need, on change, to saver.save();

	*/
	instantiate(...args) {
		this.events = {};
		this.props = {};
		this.assign(...args);
		this.constructor.register(this);
		this.initialize();
	}

	static setup(saver){
		this.singular = this.name.toLowerCase();
		this.plural = this.singular + "s";
		this.instances = this[this.plural] = [];
		this.saver = saver;

		this.initialize_data();
	}

	static initialize_data(){
		this.data = this.saver.get(this.name);
		
		// initial setup, runs once before data has been created
		if (!this.data){
			data = {
				name: this.name
			};

			data[this.plural] = [];

			this.saver.set(this.name, data);
		} else {
			// if there is data, instantiate?
			this.instantiate();
		}
	}

	static instantiate(){
		for (const data of this.data[this.plural]){
			new this({ data });
		}
	}

	static save(){
		this.saver.save();
	}

	static register(instance){
		this.instances.push(instance);
		if (!instance.data){
			instance.data = {};
			this.data[this.plural].push(instance.data);
			this.save();
		}
		this.view && this.update();
	}

	file(file){
		// register which File to save with
		// but maybe the entire class should do this?
	}

	save(){
		this.constructor.save();
	}

	set(name, value){
		this.data[name] = value;
		this.save();
	}

	get(name){
		return this.data[name];
	}

	prop(name, value){
		if (is.def(value)){
			this.props[name] = value;
			this.constructor.save();
			return this;
		} else {
			return this.props[name];
		}
	}

	each(fn){ // fn called with (value, name)
		for (const name in this.props){
			fn.call(this, this.props[name], name);
		}
		return this;
	}

	render(){
		this.view = div.c(this.constructor.singular, this.get("name"), () => {
			console.log("render here", this);
		})
	}


	static render(){
		this.view = div.c("list", {
			bar: () => {
				el("button", "clear").click(this.clear.bind(this))
			},
			contents: div(),
			entry: div().attr("contenteditable", "true").style({ background: "#fff" }).on("keypress", (v, e) => {
				if (e.keyCode == 13){
					e.preventDefault();
					new this().set("name", v.html());
					v.html("");
				}
			})
		});
		this.update();
	}

	static update(){
		this.view.contents.html("");
		this.view.contents.append(() => {
			for (const instance of this.instances){
				instance.render()
			}
		});
	}

	static clear(){
		this.data[this.plural] = [];
		this.save();
		this.update();
	}
	/*
	Should the collection loop all the props to regenerate data?  This is the wrong approach, because it possibly creates duplicate data, and doesn't try to maintain unchanged data.

	What we really want, is for individual properties to manage their own changes, only change the data that's necessary...

	If props aren't wrapped, and don't have events or references, the props could actually be the data.  But that's risky.

	But, instead of looping all the data, maybe data should be a prop, that's just a reference to the app.data's prop.  I think that makes sense.

	It's like an entire duplicate data structure, but I think that's what we need right now.
	*/

	// data(){
	// 	const data = {};
	// 	this.each((value, name) => {
	// 		if (value && is.fn(value.data)){
	// 			data[name] = value.data();
	// 		} else {
	// 			data[name] = value;
	// 		}
	// 	});
	// 	return data;
	// }
}








class Document extends Thing {
	/* create content classes, and automate the saving and instantiation */
}


/*

If the Collection can handle it's props,
and we can create an array prop,
then we could create a List class from the Collection?


*/













/*



There are 2 sort of separate use cases:
- saving records, like a database

- saving codeable content modules (with props we want to reference)


The question is, how are the properties handled?  Are they accessed on a sub object, or directly on the collection?
For many cases, with few props, we might be able to get away with a small number of fields, and attach them directly to the collection, so we don't need to do thing.coll.get("prop"), we can just do thing.coll.prop?

Or maybe, we use the collection to facilitate the mapping?
Or maybe Thing extends collection, so that the props juse magically appear on the thing?  thing.prop can be edited, and persisted.


For some situations, attaching all new things directly to the collection might produce namespace problems.  So the quarantine pattern, where the props aren't accessible... Might not be a bad idea.


coll.prop && coll.method()
vs

coll.get("prop") or coll.props.prop && coll.methods() // quarantined props


And if we're smart, we can use DirectProps + NestedCollections in order to have both:

Thing extends Collection
thing.direct_prop  // you can decide where to put shit
thing.deep.prop // you can nest bulky namespaces

And the thing itself handles its saving and loading, so that all the props are automatically saved and loaded properly?





If we need similar functionality for most classes (saving all the props...)...

To have a savable class, we either need to just JSON.stringify(this), manually create the data property by property, or automate the saving with something like a collection (where properties are created manually, and then can be looped through automatically).

Well, I think that might be excessive.  

When creating layers and documents and settings, everything needs to be savable.  But not EVERY class needs to be a collection??  I don't know...

It's really aobut being able to loop through the properties...


Could the add method, that adds a value, just look for a .name prop, and attach it?
This seems like a very simple way, not necessarily immune to name collisions...



What is the goal?
- looping?
- saving?
- automating the saving, loading, instantiation?




There might be room for different versions of this thing?

If we wrap each value, object or not, in a CollectionItem wrapper, with its own events:
- we can basically create events for non-object props
- we can basically create objects with evented props...
- it's a lot of extra data, but again, let's just get something working...


Maybe List is a better name?

Maybe Collection is for named props, like an obj, and List is like an array?
The Collection could have an array in addition to the named props, but the List never has named props?

I mean, it could have an array of objs with names, but the api for adding and references doesn't use them...


Folders and Files, and Lines
Views, Elements, Fragments, Attributes, Children
Users, Groups, Teams..

Querying, filtering, selecting, saving, loading, etc...

So much can be built on top of these.

How about View extends Collection?


How about this requirement for naming props?

1. If you use an array, you don't need to worry about the namespace.  You can't add methods to an object and keep its namespace clean...
2. If every time you create something, you have to decide, and then it's a pita to convert back and forth...

Could we auto-name props?

Could we just make the name optional?


coll.prop("propname", value);
or
coll.add(value);

// Named or unnamed...


But, if unnamed props --> arr.push, and named props get added to .props obj or whatever, then we have 2 different sets of data within...

This means that you could use the same class for either or, but not both...

But when you use coll.each, does it loop through props or the array?



What's the advantage of using named props?

1. When we want to create data structures where we can reference the things...


The problem with this, is that collections are meant to be dynamic, to allow things to be added, and we don't really want to worry about name collisions.  If you accidentally try to add something with the same prop name...

I suppose both of these use cases are legit and useful...



It seems useful to have object oriented item manipulations, like:
- remove
- promote (index--)
- demote (index++)


Maybe staying close to the array?

Can we extend the array to have events?



One of the benefits to doing this, is having item-level events that trigger list-level events:
- if one of the items changes, the whole thing fires a change notification.

Now, generally, we want to handle DOM updates in a granular way, but right now I'm doing bulk saving, so it might be easier to save the whole thing in a big chunk.






Let's start with DataObj and DataArray?  Or Savable? ObjS and ArrS?

Whatever their names, the idea is to let their API be as close as possible to the underlying, so you could swap one for the other?

Well, if the improvements are strictly debug, instrumentation, this makes sense.
If the improvements are events that are vital to the functioning of the app, this makes no sense...




Hmmm, if the prop method adds the value to both the props obj and items array, and .each always loops through the array, and counts on the properties having their names internally?  Maybe we have a winner...


*/