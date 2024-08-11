import { App, el, div, View, h1, h2, h3, p, is, Base } from "/module/App.js";
import Module1 from "./Module1.js";

const app = window.app = await new App().ready;

/*

It seems import statements are evaluated before any other code, so all dependencies are available before this file begins.  For that reason, putting a console.log statement above an import statement isn't the same as putting one above a function call, for example... it doesn't follow the proper order.

*/