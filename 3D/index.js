import { App, el, div, View, h1, h2, h3, p, is, Base, icon } from "/module/App/App.js";
import HashRunner from "/module/App/HashRunner.js";

const app = window.app = await new App().ready;

new HashRunner();