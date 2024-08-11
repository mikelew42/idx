import express from "express";
import http from "http";
import url, { URL } from "url";
import path from "path";
import App from "./App.js";

const exp = express();
const webroot = process.cwd();

exp.use(express.static(webroot));

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

exp.use("/module", express.static(dirname + "/module"));

const server = http.createServer(exp);

const app = new App({ server, dirname });

server.listen(80, function(){
	console.log("Listening (" + webroot + ")");
});