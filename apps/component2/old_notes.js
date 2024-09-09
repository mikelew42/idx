import Base from "/module/Base.js";
import File from "./File.js";

export default class Component extends Base {
	initialize(){
		this.file = new this.constructor.File({ 
			name: "comp.json" 
		});

		this.meta = new this.constructor.File({ 
			name: "meta.json",
			meta: import.meta
		});
	}

	ready(){
		return this.parent.ready();
	}

	save(){
		this.parent.save();
	}
}

class Saver {

	save(){
		this.send();
	}

	send(){}

	ready(){
		return new Promise();
	}
}

Component.File = File;


// dir need to create files
class Dir extends Array {
	file(name){
		const file = new File({ name });
		this.push(file);
		return file;
	}
}

class MyClass {}
MyClass.instances = new Dir();

/*
How does a Dir save its contents?
If the Dir is created and controlled by components, it's not necessarily bad if Dir extends Array, and is iterable?

And it can have all the methods for saving and whatnot...

So, a Dir can have files and dir, and components?

If you call dir.save(), does it automatically re-save everything?

Because no data is actually saved in dir, only in files... The data that produces a file should be properly linked to save into that file.


So what is a Dir component???

Maybe it's just a component that has a .dir?
And sub components can use it (parent.dir) in order to either:
- create its own dir (this.dir)
- or create its own file (this.file)

If it creates its own dir...
then when you .save() the thing, does it actually save anything directly?

I don't think we want to loop through all the things, and save them all, that defeats the purpose.

So, a component might have a dir, and a file...

Maybe Class.dir => the "instances" directory?
Or, Class.dir = the containing dir of the file
Class.dir.instances = the instances dir
Class.dir.whatever = any arbitrary dir

Class.data = file(data.json)
or
Class.file.data = data.json...

So, Class.dir and Class.file need to be super methods, bound to the class?
We would need to manually configure these, or call some Class.initialize() method...

Also, super methods might not be terribly easy to setup.  I could look at my old code on GitHub.

Or, they're just instances.

Class.dir = new Directory(Class.name);

And any files (like data.json) could be Class.data, Class.settings, etc.



So, we have components that take a filename as an instantiation argument.

new Component({filename: "file.json"}); -> file.json



We have components that might have a predefined filename:

this.settings = new Settings(); // -> settings.json



We have components that might have their own directory.  This directory might be Class.dir.  And then inside this directory, they might save their instances in an instances directory.

I think the Class.dir.instances would work fine, and makes sense.

If instances is filled with sub directories, we need to decide how to handle that.

I think the actual objects should be stored at Class.instances[]
And the Class.dir.instances... sub directories might not need to be stored in the dir.instances object?  

But, to create and load them, there needs to be an instance of each instances dir object?

Are we ever actually "loading" a dir?  In this sense, we can sort of just rely on the prescribed structure, and just request files?  Dir don't have any data...

But still, it's not necessarily a bad idea to have a dir object for each dir, so that we can easily create files in the appropriate place.

But, do we want to instantiate an instance of a class when we can just store a string?  Maybe this will solve itself.



So, the Dir are really just for organization, they don't really do much.

But, we might want dir.mkdir("newdir")...
And probably will want dir.ls() -> an array of files and dir?
Maybe the dir extends array, so that you can actually iterate it?
- we probably don't want to use array modifier functions on the dir, except internally
- but even so, if the dir changes, we probably just want to reload from the file system, rather than try to modify the array directly



Anyway...


If a Component is configured to save to its own /instances/ directory...
- then it's not really a "library" component...

Maybe a Component doesn't need the save configuration in the library.

And when you want to use it in your site, you...
- copy and paste it into the static site
- and modify the code directly to create the save config?


Maybe the Component can even copy itself into your site's /module/ directory?

1. You import the thing from URL.
2. Upon loading, the Component detects its a static site, and tries to install itself?

Well, you might want some control over this process.  But, upon installing itself (copying itself into a local directory, sort of like "git clone"), it could also prompt you to configure how to save the instances.

But, that's way down the road ....... .... ...........


Anyway


If we want to import a component, and configure how it's saved...


Some components could be orphan components:
- they aren't saved to the Component directory
- maybe the Component is CDN hosted or in a shared dir, or bundled, or whatever?
- but, it's not meant to be saved to its own directory
- it's meant to be added to a file (or dir?)



Dir can't be saved to a file...

So if a component is configured as a dir (it requires multiple files), then it can't be added to a file.  It must be added to a dir...

So, component.parent.dir.add(component.dir) ????

Or, component.dir = component.parent.dir.mkdir(this.name)???
And then for each file:

component.datajson = component.dir.file("data.json")
component.subjson = component.dir.file("sub.json");

Or maybe
component.dir.data
component.dir.sub
component.dir.Sub
much cleaner..




Or, a component is configured as a file.
It has its own file?
Or it creates a new file based on its parent?
I think these are all options, you have to decide...



Or, a component is an orphan.  No file or dir.  And when you add it to another, it gets added, and saved?  This is the Smart object pattern.

But this still could vary greatly...?

Well, you basically have an embedded component, where it literally gets added to the parent's file?



Yea, so you have 3 conditions?
- file
- dir
- neither?

Because all the saving gets done in a file, maybe comp.save() -> comp.file.save()?
And each comp maps to a specific file.  And that file can be shared?

Well, 2 components shouldn't save to the same file independently...




The way the saver is set up, it is configured to stringify a single object, every time.  But multiple sub components can be embedded.




If you wanted an embedded component, you'd have to do something similar.



But I think most components would either be files or dir.
And whether that component is saved to its Class directory as instances, maybe just a config option?



Basically, is it a local component or embedded?
But, embedded here could mean:
- embedded in another file.json (needs to be added to the stringified data)
- embedded in another dir as its own file or even dir



Hybrid detection
If you add a component to another, and another has its own dir, then the newly added component can be added to a new file in that dir.  Easy peasy.
If you add a component to another, and another is just a file, you'd have to embed the newly added component, basically adding it to the parent's props.


*/