import express from "express";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";
import http from "http";
import url, { URL } from "url";
import { File, Directory } from "./FS.js";
import path from "path";
import ServerSocket from "./ServerSocket.js";

const app = express();

// const site = "public";
// const webroot = __dirname + "/" + site;
const webroot = process.cwd();

app.use(express.static(webroot));

// console.log(webroot);
// console.log(import.meta.url);
// console.log(url.fileURLToPath(import.meta.url));
const dirname = path.dirname(url.fileURLToPath(import.meta.url));
// console.log("dirname", dirname);

// the first "/module" is the url path (localhost/module), the second one is the fs dir (./module)
app.use("/module", express.static(dirname + "/module"));

const server = http.createServer(app);
const app2 = {};
const socket = new ServerSocket({ server, dirname, app: app2 });


server.listen(80, function(){
	console.log("Listening (" + webroot + ")");
});