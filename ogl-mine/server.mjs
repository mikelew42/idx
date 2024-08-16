export default {
	directorize: true,
	initialize(){
		this.initialize_server();
		this.express_app.use("/node_modules/ogl", this.express.static(this.dirname + "/../node_modules/ogl"));
		this.listen();
	}
};