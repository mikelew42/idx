import { App, el, div, View, h1, h2, h3, p, is, Base, Smart, EventEmitter } from "/module/SmartApp.js";

View.stylesheet("./styles.css");

const app = window.app = await new App().ready;

class Config extends Smart {}

export function config(){
	return new Config().append(arguments);
}

/*

Should Config extend SmartView?

Or, should Config just be Smart and have a .view?

It just occurred to me, that instead of writing these config panels manually (which you might want to do sometimes),
it might be more useful to just automatically render all the props...

Unless you want more precise control...

Sections, menus, etc?
*/

class Smarter extends Smart {

	instantiate(...args){
		this.assign(...args);
		// this.initialize(); // do this after?
	}

	toJSON(){
		const ret = {}; // json return data
		for (const name in this.props){
			ret[name] = this.props[name].value; // we need to "unwrap" the prop.values
		}
		return ret;
	}

	get(name){
		return this.props[name].value;
	}

	/*
	This is quite confusing.
	1. A smart object needs to be set to a parent smart object.
	2. We assume the parent smart object is already initialized with data...?
	*/
	set(name, value){
		// if the property is also a smart object, we need to do some setup
		if (value instanceof Smart){
			value.setup(this, name);
		} else if(this.props[name]){
			this.props[name].set(value);
		} else {
			this.props[name] = new Property({ parent: this }).set(value);
		}

		this.save();

		if (is.obj(value) || is.arr(value) || is.class(value)){
			if (!is.def(this[name]))
				this[name] = value;
			else
				console.warn("promote prop conflict");
		}

		return this; // ?
	}

	// when we parent.set("child", child), the parent.set will in turn call this
	setup(parent, name){
		const data = parent.props[name];
		
		// add smarter instance directly into parent.props
		// toJSON will be called to convert this.props
		parent.props[name] = this; 

		this.name = name; // why not?

		// set this before .initialize(), so initialize can .set child smart objects
		this.saver = parent.saver;

		if (this.props)
			console.warn("hmm?");

		this.props = {};
		if (is.def(data)){
			for (const prop in data){

				this.props[prop] = new Property({ 
					parent: this, 
					name: prop 
				}).set(data[prop]);
			}

		}
		
		this.initialize();

	}


	render(){
		this.view = div.c("smarter", () => {
			for (const name in this.props){
				this.props[name].render()
			}
		})
	}
}
class Property extends EventEmitter {

	// value;

	get(){
		return this.value;
	}
	
	set(value){
		if (value !== this.value){
			console.log("set", value);
			this.value = value;
			this.emit("change", this.value);
			// i'm going to do change event first, save second, so the UI updates first.  even though my node save is blocking, this save call is just a little network blast, so shouldn't slow it down much
			this.parent?.save(); 
		} else {
			console.warn("Re-setting identical value?"); // probably a mistake...
		}
		return this;
	}
	
	render(){
		console.log(this.value);
		// this.value is an object, and so appending the object results in an attempt to append each of the members... this is potentially dangerous?
		this.view = div.c("property", v => {
				v.name = div.c("name", this.name);
				v.value = div.c("value", this.value)
					.attr("contenteditable", "true")
					.on("input", event => {
						console.log("input");
						this.set(v.value.el.innerHTML);
					});
			})


		this.on("change", value => {
			if (this.view.value.el.innerHTML !== value){
				console.log("ui update new value", value);
				this.view.value.el.innerHTML = value;
			} else {
				console.log("ui: value is identical, no change needed", value);
			}
		});
	}

}

const prop = window.prop = new Property().set(5);
prop.render();

const smarter = window.smarter = new Smarter();
app.set("smarter", smarter);

smarter.render();
/*

prop.on("change", (value, origin){
	if (origin === this)
		return;

	// continue with response
});

This way, we can easily identify where the change originated from.
You could even use a number or string to compare to... 
Not sure how I feel about that.. It could be optional.  But it is a nice way to do it...


Before I fall down this rabbit hole, let's think:

How do we prevent infinite recursion?

1. User uses control
2. el change event
3. prop.set("new value")
4. prop.emits "change" event
5. UI should not update...

One quick and easy way, is to just discard the duplicate update, because the values should be identical...

However, we probably want a way to... prop.set("new value", false);

The false arg could be an "emit" boolean, which basically means, don't emit...


If you want to filter or validate new values, in the change event, then you could just set the value with emit = false.

The problem with that, is that other handlers won't know of the new value...

I could use a "changed" event, also, which could be "read only", locking the property from changing again...

But, we probably don't want 2 events firing for every property update...?
Well, these "Smarter" objects are not supposed to be performant...

If you need faster bindings, there's surely a better way, probably without events.  Can you have bindings without events?
- you can have hard-coded "callbacks"

Anyway

1. The app changes a Property (prop.set("new value"))
2. prop.emit("change")
3. UI should update


In the UI update logic, if we receive a change event from the property, we don't want to
-> update the control to the new value
-> trigger the control's change event
-> try to re-set the value

If it's an identical value, it gets ignored, so it's nbd... but still...

So, how do we, on the UI side, prevent re-set on change?

prop.on("change", (value, origin) => {
	if (origin === this)
		return; // is this necessary? if we prevent re-set, maybe this never happens?

	this.mute("change"); // temporarily mute the change event
	this.el.value = value; // might trigger this to emit a change event...
	this.unmute("change"); // restore the change event
});

ui.on("change", (value) => {
	// origin is the user... this is a ui control
	prop.set(value, this);
});

So, if the prop changes, we update the UI without a UI.change event.
If the UI changes, we update the prop, with a prop.change event, but we track the origin of the change (the ui control), so that we can ignore the change?

Is the origin check necessary on the 
*/