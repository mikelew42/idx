import Component from "/module/Component/Component.js";

export default class Note extends Component {
	static meta(){
		return import.meta;
	}
}

await Thing.instantiate();

Thing.set({
	meta: "props"
})

/*

The problem with thing -> thing.json, is we can only have 1...

We might want thing1.json, thing2.json.

We might want Thing/instances/thing1.json, thing2.json

We might want Thing/instances.json [{thing1}, {thing2}]

We might want Thing/instances/thing1/data.json

It depends on how complex the data is...

So we might want variants of this thing...

*/