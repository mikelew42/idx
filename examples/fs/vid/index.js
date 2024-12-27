import App from "/module/App.js";
import Events from "/module/Events.js";
import { el, div, View, h1, h2, h3, p, is, Base } from "/module/View.js";
import Thing from "/Thing.js";
import smart from "/smart.js";

import Vid from "/vid-test.js";

const app = window.app = await new App().ready;
const vid = new Vid();