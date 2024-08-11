import { App, el, div, View, h1, h2, h3, p, is, Base } from "/module/App.js";

View.stylesheet("./sidebar.css");  // this <link> element gets chucked into the page, and the url is relative
// not sure if there's a way to use JS path resolution (relative to this file), without using fetch or something?  I think fetch is relative to URL also, not file...

/*

The only way I see this happening:

if window.location.path === "sidebar" (if we're at localhost/sidebar/)
then add that <base> path to the html, so "./sidebar.css" will point to /sidebar/sidebar.css
and if it's "mounted" directly (localhost), there's no base, and it will point to localhost/sidebar.css

I think that would work...

It's sort of a strange edge case, maybe I should just get used to running everything from the base, consistently.

*/

function anchor(name, path){
	const a = el("a", name).attr("href", path);
	if (window.location.pathname == path)
		a.ac("active");
}

function sidebar(){
	el.c("aside", "sidebar", () => {
		anchor("Home", "./");
		anchor("One", "./one/");
	})
}

/*

A note about portability:  you can't have root hrefs if you want to nest this code on a sub /path/.


*/

export default function site(content){
	sidebar();
	div.c("content", content);
}