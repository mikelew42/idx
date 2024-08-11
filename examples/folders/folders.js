import { App, el, div, View, h1, h2, h3, p, is, Base, test, Test, Smart } from "/module/SmartApp.js";

export default class Folders extends Smart {

	initialize(){
		this.folders = [];
	}

	add(name){
		this.folders.push(name);
	}
}

/*

Drag and drop folders
Displayed as a tree of vtabs?


What's the drag and drop API?
Any draggable thing needs a list of droppable targets...

1. solid thing
2. start dragging => placeholder @ origin @ 20% opacity
                     placeholder @ mouse @ 20% opacity

                     if not a valid drop zone, show CANCEL cursor
                     if a valid drop zone, preview the thing @ 20% opacity in place, with a yellow cursor
3. invalid drop => cursor flashes red, animate preview back to origin
4. valid drop => cursor flashes green, preview becomes full opacity




 const draggable = document.getElementById('draggable');
    const dropzone = document.getElementById('dropzone');

    let offsetX, offsetY, startX, startY;

    const onDragStart = (event) => {
        event.preventDefault();
        const touch = event.touches ? event.touches[0] : event;

        startX = touch.clientX;
        startY = touch.clientY;
        const rect = draggable.getBoundingClientRect();
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchend', onDragEnd);
    };

    const onDrag = (event) => {
        event.preventDefault();
        const touch = event.touches ? event.touches[0] : event;

        const x = touch.clientX - offsetX;
        const y = touch.clientY - offsetY;

        draggable.style.left = `${x}px`;
        draggable.style.top = `${y}px`;
    };

    const onDragEnd = (event) => {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchend', onDragEnd);

        const dropzoneRect = dropzone.getBoundingClientRect();
        const draggableRect = draggable.getBoundingClientRect();

        if (
            draggableRect.left < dropzoneRect.right &&
            draggableRect.right > dropzoneRect.left &&
            draggableRect.top < dropzoneRect.bottom &&
            draggableRect.bottom > dropzoneRect.top
        ) {
            dropzone.appendChild(draggable);
            draggable.style.left = '0px';
            draggable.style.top = '0px';
        }
    };

    draggable.addEventListener('mousedown', onDragStart);
    draggable.addEventListener('touchstart', onDragStart);

*/