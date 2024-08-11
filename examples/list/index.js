import { App, el, div, View, h1, h2, h3, p, is, Base } from "/module/App.js";
import List from "./List.js";

const app = window.app = await new App().ready;

// Initialization
const mainList = new List('Main List');
const subList1 = new List('Sub List 1');
const subList2 = new List('Sub List 2');

mainList.addList(subList1);
mainList.addList(subList2);

document.body.appendChild(mainList.element);

const secondList = new List("Second List");
secondList.addList(new List("S2.1"));
secondList.addList(new List("S2.2"));
document.body.appendChild(secondList.element);