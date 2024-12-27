import path from "path";
import url from "url";
import https from "https";
import fs from "fs";

export default {
	directorize: true,
	initialize(){
		this.initialize_server();

		// this is bad, won't work unless I set this up similarly...
		this.express_app.use("/three.js", this.express.static(this.dirname + "/../../three.js/"));
		this.listen();
	},

	initialize_http_server(){
		const dirname = path.dirname(url.fileURLToPath(import.meta.url))
		const privateKey = fs.readFileSync(path.join(dirname, 'key.pem'), 'utf8');
		const certificate = fs.readFileSync(path.join(dirname, 'cert.pem'), 'utf8');
		const credentials = { key: privateKey, cert: certificate };
		// this.https_server = https.createServer(credentials, this.express_app);
		this.http_server = https.createServer(credentials, this.express_app);
		// this.http_server = http.createServer(this.express_app);
	},

	listen(){
		this.http_server.listen(443, () => {
			console.log("HTTPS Secure Server running on port 443");
		});
	}
};