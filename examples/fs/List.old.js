class List extends Base {
	initialize(){
		this.items = app.data.get('items');
	}

	add(item){
		this.items.push(item);
		app.data.set("items", this.items);
		this.view && this.update();
		return this;
	}

	render(){
		this.view = div.c("list", {
			bar: () => {
				el("button", "clear").click(this.clear.bind(this))
			},
			contents: div(),
			entry: div().attr("contenteditable", "true").style({ background: "#fff" }).on("keypress", (v, e) => {
				if (e.keyCode == 13){
					e.preventDefault();
					this.add(v.html());
					v.html("");
				}
			})
		});
		this.update();
	}

	update(){
		this.view.contents.html("");
		this.view.contents.append(() => {
			for (const item of this.items){
				div(item).attr("contenteditable", "true");  // editing will be tricky, because we need to change the specific item
			}
		});
	}

	clear(){
		this.items = [];
		app.data.set("items", []);
		this.update();
	}
}





// window.list = new List({ app });

// list.render();