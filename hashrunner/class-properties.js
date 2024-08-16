// class One {
// 	prop = 5;

// 	constructor(){
// 		console.log(this); // 2
// 	}
// }

// class Two extends One {
// 	prop = console.log("setting Two.prop") || 10; // 3 ????
// 	constructor(){
// 		console.group("Two.constructor()"); // 1
// 		super();
// 		console.log("this from Two", this); // 4
// 		console.groupEnd();
// 	}
// }

// console.log("one", new One());
// console.log("two", new Two());

/*

We have to call super before we can touch `this`.

In order to have any sort of init with the new props... 

You could just have an empty super()?
*/

class Base {
	prop = 5;
	constructor(){} // empty
}

class Mine extends Base {
	prop = 10;
	constructor(){
		super();
		// new props will be available here...
		this.initialize();
	}

	initialize(){
		console.log("initialize", this);
	}
}

class Third extends Mine {
	prop = 15;

	constructor(){
		super();
		this.initialize();
	}
}

console.log("base", new Base());
console.log("mine", new Mine());
console.log("third", new Third());