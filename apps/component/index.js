import Component from "./Component.js";

const comp = window.comp = new Component({
	filename: "comp.json"
});

const comp2 = window.comp2 = new Component({
	socket: comp.socket
});

// // this isn't parallel...
// await comp.ready();
// comp.set("prop", "value2");
// comp.set("prop2", "value2");
// comp.set("prop3", "value2");

// await comp2.ready();
// comp2.set("prop2", "value2");


// how about:

comp.ready.then(() => {
	comp.set("prop", "value2");
	comp.set("prop2", "value2");
	comp.set("prop3", "value2");
});

comp2.ready.then(() => {
	comp2.set("prop3", 4);
});



// import Socket from "/module/Socket.js";

// window.socket = new Socket();


