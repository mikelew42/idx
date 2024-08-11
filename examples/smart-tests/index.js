import { App, el, div, View, h1, h2, h3, p, is, Base, Smart, EventEmitter, Test, test } from "/module/SmartApp.js";

const app = window.app = await new App().ready;

test("one", () => {
	div("App Properties");

	for (const prop in app.props){
		div(prop + ": " + app.props[prop]);
	}
});