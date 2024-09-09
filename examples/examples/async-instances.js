class AsyncThing {
	constructor(){
		return this.ready();
	}

	async ready(){
		return this;
	}
}

const thing1 = await new AsyncThing();
console.log(thing1);

/*

One issue with this pattern, while it's kind of cool, it prevents you from Queuing up several async instances at once, to run "in parallel".

You're forced to await each new Thing, which means the next new Thing won't start it's business until the first Thing resolves.

This might be ok (a sequence of processes), but you lose the flexibility of using it in parallel.



The alternative pattern:

*/

class Thing {
	async ready(){
		return this;
	}
}

// begin the asynchrony, in parallel
const thing2 = new Thing();
const thing3 = new Thing();

// wait until they're all complete
await Promise.all([thing2.ready(), thing3.ready()]); // ugly syntax...
