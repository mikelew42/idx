class NakedComponent {}

/*

Basically, we put the properties on the object, rather than quarantining them.

This presents several challenges:

# Namespacing

If you want events (.on, .off, .emit, .events), or any other methods, you can't use those names for props, obviously.


# Syncing

You could let the UI just update the component directly.  This isn't a terrible way to do it, avoiding events entirely?

However, events allow bi-directional binding.


# Events

Without events, you can't have the UI update when the code changes a property...  When it comes to many things, you'll have scripts (animations, etc) that control properties, and update them over time.  And we'll want to be able to inspect these.


# Magic get/set

Without magic get/set methods, it seems it would be tricky to make this work.  And setting up all of these in code is a pita.  Sure, we could automate it...



# Unifying the API

In order to allow NakedComponents to work with the QuarantinedComponents, might be a little tricky.

If we can simplify the BaseComponent API, it might help...

*/