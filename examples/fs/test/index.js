import app from "/module/app.js";
import { el, div, View, h1, h2, h3, p, is } from "/module/View.js";

const body = View.body().init();

window.app = app;
// csocket.send("new message here"); // can't send before connection is properly opened...
// csocket.msg("sent when ready"); // woohoo
// csocket.file("test_file.ext", "here's soem data");
// csocket.file("/slash_test_file.ext", "here's soem data");
// csocket.file("./dot_slash_test_file.ext", "here's soem data");
// csocket.file("path/to/test_file.ext", "here's soem data");
// csocket.mkdir("")
div("hii");

console.group("This is a gorup");
console.log("this is inside the group");
console.log("this is inside the group");
console.log("this is inside the group");
console.log("this is inside the group");
console.groupEnd();