import { App, el, div, View, h1, h2, h3, p, is, Base, Test, test } from "/module/App.js";

const app = window.app = await new App().ready;

app.body.style("padding", "2em");

h1("hello sub");