import Events from "/module/Events.js";
import { el, div, View, h1, h2, h3, p, is, Base } from "/module/View.js";
import Smart from "/module/Smart.js";

class Thing extends Smart {
	instantiate(...args){
		this.assign(...args);
		// this.instantiate_props(); // before we set to a saver, there is no data..
	}
	
	initialize(){
		this.set("sub", new Sub(this.get("sub")));

		this.set("smart", new SmartSub());

		/*
		Do we have to do an idempotent initialization here?
		If no data, set it up?
		Or will set handle that?

		this.set("sub", new Sub()); //??
		*/
	}
}

class Sub extends Base {  // probably a bad idea to have non-smart instances within a smart instance's savable props...
	initialize(){
		console.log("this is a sub", this);
	}
}

class SmartSub extends Smart {
	initialize(){
		console.log("this is a smart sub", this);
	}
}

class Note extends Smart {
	initialize(){
		console.log("this is a note", this.props);
	}

	render(){
		this.view = div.c("note", () => {
			this.title = h3(this.get("title"));
			this.contents = p(this.get("content"));
		}).style({
			"padding": "10px",
			"margin-bottom": "10px",
			"background": "white"
		});
	}
}

class Notes extends Smart {
	initialize(){
		this.notes = this.get("notes");

		if (!this.notes){
			this.set("notes", []);
		}

		for (let i = 0; i < this.notes.length; i++){
			this.notes[i] = new Note({ saver: this.saver, props: this.notes[i] });
			this.notes[i].initialize();
		}

		this.render();
	}

	render(){
		this.view = div.c("notes", () => {
			h2("Notes");
			this.view_list = div.c("notes-list", view_list => {
				this.view_list = view_list; // update needs this reference...
				this.update();
			});
			this.view_add = div.c("notes-add", () => {
				this.view_add_title = div.c("notes-add-title", "title").attr("contenteditable", "true");
				this.view_add_content = div.c("notes-add-content", "content").attr("contenteditable", "true");
				this.view_add_btn = el("button", "add").click(() => {
					this.add(this.view_add_title.html(), this.view_add_content.html());
					this.update();
				});
			});
		})
	}

	update(){
		if (this.view_list){
			this.view_list.html("");
			this.view_list.append(() => {
				for (const note of this.notes){
					note.render();
				}
			});
		}
	}

	add(title, content){
		const note = new Note();
		note.props = {};
		note.set("title", title); // this triggers a save?
		note.set("content", content);
		note.saver = this.saver;
		this.notes.push(note);
		this.save();
	}
}


export default function smart(app){



const smart = window.smart = new Smart();

app.set("smart", smart);  // ?
app.set("thing", new Thing({ code_prop: 4448 }))

app.set("notes", new Notes());

}