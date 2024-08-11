How do we extend the view class?

There were some patterns I used to use...

Thing {
	View = ThingView;
	this.view = new (this.constructor).View() // all these fancy features are probably not really necessary... just override shit to make it faster?
}

The problem is with all the references, and even the lack of references:
- there was an issue where:

var view = new View({
	init(){
		view.something = whatever;
	}
})

It was something like this.  I don't believe "this" would have worked... The problem was that the init code was trying to run before the value was returned to the parent scope, and the variable wasn't defined yet.  There are probably work arounds for this, just not sure exactly what the problem was.


anyway,

Part of the trick is all the refs...

Inside ThingView, we have this.thing, to reference back to the object.  This isn't really a problem... Just makes me wonder if some things can just be views, so you can just use this for everything.  The problem there, is the name collisions...

HAVING OBJECTS THAT HAVE METHODS AND DATA IS TRICKY
Because then you have to worry about potential collisions.

An alternative would be to use some sort of special model object that tracks all the properties, or something...

# Another Issue:  One View vs Multiple Views?

Most of the time, one view is fine.  The problem is when we might want another view of the same object, and keep them all in sync.  To do that, is quite a bit harder...

With one view, we can simply manipulate the view from the object (thing.view.ac("whatever")).

However, with multiple views, we must either loop (thing.views.forEach(...)), or... do it in a decoupled way (which is probably best).  But that means pub/sub:  the view must subscribe to the necessary changes.

Now, you could just have an update function that automatically just recalculates everything.  For the vast majority of simple websites, this is fine.  But once you try to do something that's performance heavy (like a graphic design app, or especially video or heavy graphics), now you have to be careful.


Is it necessary to extend the View class?
Another way is to just create a factory function that creates a view... And in many ways, this is just as easy.  However, if it's something you might need to *extend again*, that's when using a class is the better option (so that you can more easily structure and cherry pick the necessary functions for override).

If you just create and modify a generic new View() from a factory function, you might need to break that into several sub functions.  This isn't necessarily worse, and you avoid having an extra file.  However, using the file system to track changes, find specific functions, etc... Keeping files small is good.