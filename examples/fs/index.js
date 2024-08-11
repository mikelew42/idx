import App from "/module/App.js";
import EventEmitter from "/module/EventEmitter.js";
import { el, div, View, h1, h2, h3, p, is, Base } from "/module/View.js";
import Thing from "./Thing.js";
import smart from "./smart.js";



// if we instantiate app in app.js, we could just import that and say `await app.ready;`
// the problem is, then we need an extra import?
// eventualy for "production", we could use app.js as the single file -

const app = window.app = await new App().ready;

app.body.style({ "background": "#eee"})




// Thing.setup(app.data);
// Thing.render();


smart(app);


