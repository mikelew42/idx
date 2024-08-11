If we want to run tests, we might want to configure the body to be a "test" page.

Or, maybe not...

How do we define the styling of the page?  One way might be to define functions that load various CSS files.  Another might be to just add a class to the body...  That sounds like the better way.

ui.layout.basic(); 
or 

ui.body.ac("layout-2");

# A note about handling arguments

In my "ac" function, I don't handle array argument: view.ac(["arr", "of", "classes"]) won't work.  I _could_ set it up to handle that.  Can you destructure an array in place?  ...[]?  Why not just remove the brackets?

Well, if you have a variable, just do view.ac(...myarr_of_classes)

In this way, you keep the function definition shorter and faster, and you can still handle this case easily if needed.


# A note about abstractions

Above, I was considering some sort of document layout abstraction, where you'd use a library of functions to setup the proper layout.

Something like that might be required, but if all we're doing is adding a class, maybe it's better to _not_ abstract what's really going on.  Just simply use body.ac() if that's all you're doing...