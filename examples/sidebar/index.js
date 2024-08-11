import { App, el, div, View, h1, h2, h3, p, is, Base } from "/module/App.js";
import sidebar from "./sidebar.js";

const app = window.app = await new App().ready;

sidebar(() => {
	h1("Home");
	p("Relative navigation is hard.");

	p("We can use relative paths to fix a few errors, but the problem is that at some point, you need to decide where this thing is going to live, or come up with a more advanced window.location checking system.");
});