import { App, el, div, View, h1, h2, h3, p, is, Base } from "/module/App.js";
import sidebar from "../sidebar.js";

const app = window.app = await new App().ready;

sidebar(() => {
	h1("One");
});