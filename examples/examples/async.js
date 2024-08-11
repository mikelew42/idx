class AsyncTest {
	constructor(){
		const prom = new Promise((res, rej) => {
			setTimeout(() => {
				res(this);
			}, 2000)
		});
		return prom;
	}
}

console.log(new AsyncTest());

const test = await new AsyncTest();
console.log(test)

/*

This works.

We can await new Thing();

But, it's a little crazy, and it's just as easy to just use the .ready property:

const thing = await new Thing().ready; // can resolve with the ready thing, just as easily as without the .ready...
*/