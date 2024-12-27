import Events from "/module/Events.js";

export default class Module1 extends Events {

}

/*

Event based dependency modification?

Let's say we want to extend or modify some class.  Instead  of creating a second version of it, and require a bunch of switching back and forth, and deciding which to use, what if we use events?

Class.use(Thing) -> Thing.install(Class);

To set that up, you'd have to go into the Class file, and import the Thing, and use it...

If you want to keep the Thing decoupled, it's way better to do the opposite:

in Thing.js:
import Class;
// then just install here...

Class.on("class event")...



Event based systems...

They're a bit harder to debug - you don't have much control over everything.  I think there are certain things that are easier than others.

If you're triggering some reaction that has little affect on other things, it's probably not a big deal.

But as a general module installation process, I'm not sure that would work well..



Let's consider:

If you have a very generic Item system, and you want plugins...
- load
- install, config
- init
- ready


Adding any feature, like draggable, icon buttons, etc...

Some things might be template variants (adding a button, or anything really).

For templating, you could have insertion or order priority... 

For example, -999 could be the absolutely first, 999 could be absolutely last, 0 is default (and would be append if there's no other priority).  But it's basically a sort value.  So if you had 8 things all appending to the same box, you could have a rough system to sort them left, right, center...  Not sure abou tthat.


Anyway, so any UI + Code module might have:
[] UI
[] Code
[] Data
[] Config
[] Versions

When we write the code, we have access to all the things.  And even so, it can get tricky.
- 90% of the time, figuring out the right order is easy, because we're working with isolate parts, and it's relatively orderly.
- that 10% of the time, when you need 2 different things to cooperate with proper timing or ordering, it can get kind of annoying:
  
  sometimes you don't have access to the specific thing
  or if you do, the part that's important has run or loaded yet

Using events could solve some of this.

One of the major bummers to using events, is that you have to wrap your content modules in a callback?

Well, you could setup that app.ready promise, I like how that works...

And promises are worth waiting for :D

	It's probably much safer to use promises than events, for many things.


Anyway, so Event-based content modules...?

How do you have so many things get installed properly?

I think, generally speaking, you need to configure everything properly:
- choose the right element for a certain click handler
- choose the proper container for a certain show/hide toggle


I've often wondered if having an ExpandableIconItemWithMenu is a good idea, trying to bake so many things into one...

In some ways, you need somewhere to put the config.  And until you have the Wundertool, it's probably not a bad idea to jsut create a class that manually configures all the things.

Yet, being able to toggle things is nice.

And setting this up with code also promotes proper architecture for later.

Even though you don't have the Wundertool, it's nice to be able to just comment out a line, and turn a whole piece of complexity on/off.  It helps you narrow things down, isolate the problem, simplify, etc.


So, how do you create a "Module" that Modifies another?
- you could Module.prototype.method = override // this is bad
		you don't want to fuck everyone else...
- you could use Module and/or instance events, in order to react, observe, bind, or even modify what it's doing.
- this isn't the worst idea...


Emitting events is sort of like publishing certain parts of the class, creating an API...


One of the big problems with events, is change events, and retriggering a change.

Basically, you want change:prop events, and changed event...

And lock any subsequent changes in the change:prop event, in order to prevent recursion.

But, if changed triggers another change, you might get stuck in a loop anyway....

I don't know if you can ever really prevent it, unless you track your call stack or something.





*/