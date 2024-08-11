import { App, Base, View, is, el, h1, h2, h3, p, div } from "/module/App.js";


const app = window.app = export default new App();

/*


App vs app use case:
I just tried to use a new App for a new site, and I didn't have (nor want) data.json, and it tried to load it automatically.  This is where having a site-wide app.js file might be better, so that you can configure these things "once and for all".



If we want to REDUCE THE NUMBER OF REQUESTS for live websites, we could bring all the things into this file, and then in index.js, we simply import this one file.

Could we bundle all this directly into the index.html, to further reduce the number of requests?  Probably...












If you don't want to import App and create a new App on every page, 
or if all pages have the same config (which is likely...)

But, we don't really want extra files...?

Let's get it working properly first.





What does the app do?

Right now, it's the socket and data stuff, neither of which are really necessary on the app.  The app could generally just be a naked container for orchestrating everything else.

What's the difference between instantiating here or there?  I think it's really just the style, whether you want to manually do it on every page or not.  

Also, you could hybrid approach - on each new page, you could either import the default app.js, or import the App class and make your own...









*/