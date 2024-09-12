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

console.log("before thing.ready");
window.thing = await new Thing().ready;
console.log("after thing.ready");

thing.set({
	one: true,
	three: "four"
})

Thing.set({
	"this is": "so meta"
});
