

export default class Canvas {
	instantiate(){
		this.renderer = new THREE.WebGLRenderer();
		this.canvas = this.renderer.domElement;
		this.camera = new THREE.PerspectiveCamera();

		// this.scene gets passed in
		// this.
	}
	render(){
		this.renderer.render(this.scene, this.scene.camera || this.camera);
	}
}

/*

Should the Camera be part of the Scene?
- maybe you want some special fov or whatever
- maybe you need that far clipping plane to be really far
- so, maybe it makes sense for the camera to be part of the scene?

That way, the renderer uses the scene.camera, and we can just switch:

scene.camera = scene.camera1;
scene.camera = scene.camera2;

In order to have different cameras.


Should scene have a .render()?

If Scene were extended, and could be instantiated, it could work like a View, where you can put the scene wherever you want...?

It would be nice if you didn't have to have 2 different classes to view a scene...
Could scene.render() create a default canvas, if it doesn't already have one?

Does scene need one specific canvas?
- no we should be able to have multiple canvases for the same scene...

Can we have multiple scenes per canvas?
Yes, why not?  canvas.scene = canvas.scene1 || canvas.scene2;



Could we create a default canvas for a scene?

scene.render() -> if (!this.canvas) create default canvas/renderer?

But how would we have 2 canvases?



Let's think about the controls, and playback:
- sometimes we don't need animation
- the timeline should have a single point of control, we don't want to have to activate and deactivate a bunch of timelines independently
- but when it comes to changing the view camera, for example, and re-rendering..

user input -> camera position -> rerender

Do we call scene.render() or canvas.render()?

The THREE.js orbit controls take the renderer.domElement, and the camera, and doesn't really care about the scene nor renderer...



How do we create a secondary canvas?

canvas(scene1)
canvas(scene1).camera.position.x += 5;

I sort of wanted to create a quick version:


scene(s => {
	box();
	plane();
	grid();
});

Yet, this is probably a bit ambitious...  There's no way to keep the syntax that short and sweet.  I mean, it could work.  But it's bound to get bloated.  And I think it's more important to separate things out and keep it organized, and allow it to bloat in a manageable way.

Creating these little functions where you're not really sure what it's doing makes it unfamiliar and black magic.




So... Scene shouldn't be bound to Renderer?


Or at least, we need a way to add a secondary view to the scene?

One way, is for scene.render() to loop through all renderers...



*/