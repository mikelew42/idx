import { App, el, div, View, h1, h2, h3, p, is, Base, icon } from "/module/App.js";
import HashRunner from "/module/HashRunner.js";

const app = window.app = await new App().ready;

new HashRunner();

console.log(import.meta);
console.log(import.meta.resolve("./path"));