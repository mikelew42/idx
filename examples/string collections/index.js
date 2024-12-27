import { App, el, div, View, h1, h2, h3, p, is, Base, Events } from "/module/App.js";

const app = window.app = await new App().ready;


class Item extends Events {
	value(value){
		if (is.def(value)){
			this.value = value;
			this.emit("changed", value);
			return this;
		} else {
			return this.value;
		}
	}
}


class Collection extends Events {

	instantiate(...args){
		this.items = [];
		super.instantiate(...args);
	}

	add(item){
		if (item instanceof Item){
			this.items.push(item);
			this.emit("added", item);
			
			item.on("changed", () => {
				this.emit("changed", item);
			})
		} else if (is.pojo(item)){
			for (const prop of item){
				this[prop] = item[prop];
				this.add(item[prop]);
			}
		} else if (is.str(item)){

		}
	}
}


/*


coll.add({
	start_lt: "<",
	tag: str_value,
		attr: attr_coll,
	start_gt: ">",
	contents: str_coll,
	end_lt_slash: "</",
	tag: str_value,
	end_gt: ">"
});


*/

class StringCollection extends Collection {
	
	value(){
		var str = "";

		for (const item of this.items){
			str += item.value();
		}

		return str;
	}
}

class StringValue extends Item {

	instantiate(value){
		super.instantiate();
		this.value(value); // .events needs to be created before this is set...
	}

	value(value){
		if (is.def(value) && value !== this._value){
			this._value = value;
			this.emit("changed");
			return this;
		} else {
			return this._value;
		}
	}
}


class CollView extends View {
	render(){
		for (const item of this.coll.items){
			// console.log(item);
			new ItemView({ item });
		}

		this.output = div.c("output", this.coll.value());

		this.coll.on("changed", () => this.update())
	}

	update(){
		this.output.html(this.coll.value());
		console.log(this.output.html());
	}
}

class ItemView extends View {
	render(){
		this.append(this.item.value()).attr("contenteditable", "true").on("input", (...args) => {
			this.item.value(this.html());
		});
	}
}

app.body.ac("body1");
h1("Edit these values, watch them concatenate in realtime.????");

const coll = new StringCollection();

coll.add(new StringValue("value"));
coll.add(new StringValue("value"));
coll.add(new StringValue("value"));

new CollView({ coll });