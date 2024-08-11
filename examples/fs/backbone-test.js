
import "/module/backbone.js";
// Now you can use Backbone as usual
const MyModel = Backbone.Model.extend({
  defaults: {
    prop: 0
  }
});

const model = new MyModel();
model.on("change:prop", function(){
	debugger;
	this.set("prop", this.get("prop") + 1);
});
model.set('prop', model.get('prop') + 1);
console.log(model.get('prop')); // Should log 1