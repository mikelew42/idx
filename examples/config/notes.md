Some notes about this Property system so far:

# Property Type

Do we need a StringProperty, NumberProperty, etc?

For rendering, not a bad idea...

But, JavaScript is loosely typed, and so should these fields...

Do we destroy the old property+view, and render a fresh one?  Not a bad idea...

Creating transitions between each property type would be foolish, and there isn't a great way to do it...


# Property Casting

When an input field changes, we could:
1. trim it? no, maybe not
2. check it's length
	if 4 or 5 characters, check for truthy values (true, false, and all capitalizations)
		i'd probably just... lowercase it, and see if it's === "true" or "false"
3. if it's not boolean, try parseInt and parseFloat


if (parseInt(value).toString() === value) => its an integer
if (parseFloat(value).toString() === value) => it's probably a float?

# Rendering

The whole point of having the object version of these fields, is to have some render logic, so we can obj.render() -> render all props.

BUT, do we want to have the render logic attached?  I mean, it's somewhat separate, and the thing functions properly without it.

But, it's a little easier to just chuck it in there, for now.



# DAta Initialization...

Fuck, this gets confusing.

There are 2 paths: manual instantiation, and auto instantiation:
- I'm not really sure I got the auto instantiation to work?
- For manual instantiation, that is, originating from code, we need to load the data.
- Also, if there is no data to load, we need to create it.

For the Smart objects, there wasn't much to it..

The big trick was, waiting to initialize both the .props and calling initialize(), until it was .set to a parent Smart object...



# Events...

The Smart objects don't have events.  Don't really need them... the .set method just automatically triggers the save.

But now, with Properties all wrapped up, when the UI changes the property, we're not going to automatically get a save.  Unless we add a bunch of events?  I generally don't like that idea - we should keep the events empty as much as possible.

UI -> Property -> change event, where the Property's Smarter parent listens to all properties?

Seems likely to get out of sync...

What if the UI uses the parent to set the property?

I wrote this originally where the prop.set() was independent of the parent.

I think we could potentially have use cases where we'd want to use Property without a parent, but generally speaking, we could make a separate class.

Considering that these Property instances are coupled with the Smarter parent class, then it's not the worst option to just... parent.set(prop, value)?

Another alternative, is that the Property could just get a ref to parent, and call this.parent.save()

The question is, should the save happen before or after the change event?


I'm still not really sure if the change event can trigger an additional, nested change?


# JSON.stringify(this.app.props)?

With the old smart objects, we literally just JSON stringified everything...

But, the smarter object should be on the app.props, and it should get stringified properly?