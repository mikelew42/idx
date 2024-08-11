import { App, el, div, View, h1, h2, h3, p, is, Base, test, Test } from "/module/SmartApp.js";

const app = window.app = await new App().ready;

app.body.ac("body1");
View.stylesheet("styles.css");

Test.controls();

/*
Todo: clean all this up
- test controls
- test functions vs test suites
- import class -> test(List) -> detects class, finds class's tests, auto imports into test runner...
*/



test("three", () => {
	let _el_event, _doc_event;

	div.c("draggable", "draggable").attr("id", "myElement3").attr("contenteditable", "true");

	const myElement = document.getElementById('myElement3');

	myElement.addEventListener("pointerdown", e => {
		document.body.classList.add("no-select");
		myElement.classList.add("dragging");
		document.addEventListener("pointermove", pointermove);
		document.addEventListener("pointerup", pointerup);
		pointermove(e); // updates the target as self, immediately, even if user makes 0 pointermove, may or may not be necessary...
	});


	let last_target;

	function pointermove(e){
		let target = document.elementFromPoint(e.clientX, e.clientY);

		// console.log(target);

		if (last_target !== target){
			last_target?.classList.remove("target"); // last_target might not be defined at first
			target.classList.add("target");
			last_target = target;
		}
	}

	function pointerup(){
		myElement.classList.remove("dragging");
		last_target?.classList.remove("target");
		last_target = null; // if you don't clear this, the last_target will === target (self), and no class is added

		document.body.classList.remove("no-select");
		document.removeEventListener("pointermove", pointermove);
		document.removeEventListener("pointerup", pointerup);
	}

	/* If you click and hold, with no pointermove, the pointermove function never fires... You could initialize it by calling it immediately.  */

});

test("two", () => {
	let _el_event, _doc_event;

	div.c("draggable", "draggable").attr("id", "myElement2");

	const myElement = document.getElementById('myElement2');

	myElement.addEventListener("pointerdown", e => {
		document.body.classList.add("no-select");
		myElement.classList.add("dragging");
		document.addEventListener("pointermove", pointermove);
		document.addEventListener("pointerup", pointerup);
	});


	let last_target;

	function pointermove(e){
		let target = document.elementFromPoint(e.clientX, e.clientY);

		if (last_target !== target){
			last_target?.classList.remove("target"); // last_target might not be defined at first
			target.classList.add("target");
			last_target = target;
		}
	}

	function pointerup(){
		myElement.classList.remove("dragging");
		last_target?.classList.remove("target");
		document.body.classList.remove("no-select");
		document.removeEventListener("pointermove", pointermove);
		document.removeEventListener("pointerup", pointerup);
	}

});


test("one", () => {
	let _el_event, _doc_event;

	div("draggable").attr("id", "myElement1");

	const myElement = document.getElementById('myElement1');

	myElement.addEventListener("pointerdown", e => {
		document.addEventListener("pointermove", pointermove);
		document.addEventListener("pointerup", pointerup);
	});

	function pointermove(e){
		let target = document.elementFromPoint(e.clientX, e.clientY);
		console.log(target);
	}

	function pointerup(){
		document.removeEventListener("pointermove", pointermove);
		document.removeEventListener("pointerup", pointerup);
	}

});
