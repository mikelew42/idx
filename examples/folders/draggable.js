/*

What's the API?

new Draggable({
	draggable: view,
	dropzones: [views]
})


This is where ViewCollections would be great.  Any place where you could pass one, you could pass many...


new Draggable({
	draggable: folders,
	droppable: folders
});

Basically, all folders can be dropped onto any folders...?
The only complication there is that you might want to exclude self...


What are the drop zones?

First, when you pick something up, does it attach to the cursor's current position?  Probably should, makes most sense that way....

But then when you get to the drop zone:
1. maybe you have a container

So, you *dragover* a dropzone, and the preview could appear in the contents, probably at the end, unless the cursor moves inside the list...



Ugh, ok, let's think this through

Is the folder expanded or collapsed?
If it's collapsed, and you try to drop onto the folder, it should probably expand and show the preview at the end.
If it's open, and you try to drop onto the folder, it should just show the preview at the end..
If it's open, and you dragover the container, depending on your mouse coordinates, the item will appear at different locations.

Instead of having some blue bar or whatever, why not just display the thing?


Let's say you have a list of things.

The first thing has a top and bottom Y value.  There's probably some padding and spacing, but we need to identify the thresholds.

- if it's below the parent's namebar, and above the midpoint of the first item, it should go above the first item.
	What about IN the first item?
	Yea...

So, we basically need to split the areas.
If it's at the bottom 20% of the parent, or top 20% of the first item, that gives you a decent drop region for index 0.

If it's 60% center (20% to 80%) on item 1, it goes inside.


What's the problem with figma and other drop zones?
1. there's some sort of width calculation that gets in the way (like, if it's too wide, it won't go).
2. i'm not sure what the condition is, but sometimes it just doesn't want to go inside a container...


If you drag the last item out of a container, and the height or width collapse to 0, you might want to "prop" it open with a min w/h.

I think maybe what's going on, is that the drop zones for certain targets sort of... dominate others.

It might be possible for this to happen, unless you have some sort of smart mitigation.

Could you provide the actual coordinates for all drop zones?  And then, calculate all the overlap, and try to mitigate it?

For example, for any x, y coordinates that have multiple claims, try to split them fairly?
This could get tricky.  For one-dimension, it's not terribly hard.

Also, it's not just the items that have claim, but any spot in-between...



For any list:
	Is the parent a drop zone?  If not, that could change its own 0 index drop zone...
	Are the children drop zones?  If not, that could change the size of hte drop zones...

Use a combination of X and Y?
Normally, if you hover around, you can get something to nest or unnest.


Consider the following hierarchy:

parent
	child1
	child2
	[potential child3]
[potential uncle2]
uncle

When we're dragging into the list, do we want the item under child2 (as child3), or do we want the item above uncle, as uncle2?

This could be done via x coordinate.  Basically, you could create triangular regions, where 

*/