import { App, el, div, View, h1, h2, h3, p, is, Base, test, Test } from "/module/SmartApp.js";
import List from "./List.js";
import List2 from "./List2.js";

const app = window.app = await new App().ready;

app.body.ac("body1");

Test.controls();

/*
Todo: clean all this up
- test controls
- test functions vs test suites
- import class -> test(List) -> detects class, finds class's tests, auto imports into test runner...
*/

test("List2", List2, app); // passing in the app?  
test("List", List, app); // passing in the app?  

test("two", () => {
	h1("one");
});
