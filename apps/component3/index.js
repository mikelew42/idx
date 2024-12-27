import Component from "/module/Component/Component.js";
import Thing from "../Thing/Thing.js";
// import File from "/module/File/File.js";

// window.file = new File({
// 	name: "test.file",
// 	path: "test"
// });

window.comp = new Component({
	initialize(){
		this.set({
			prop1:41,
			prop2: 3
		});
	}
});

console.log("before new Thing()");
window.thing = new Thing();
console.log("after new Thing()");

await thing.ready;
console.log("thing.ready");
thing.set({
	one: true,
	three: "four"
})

Thing.set({
	"this is": "so meta"
});
