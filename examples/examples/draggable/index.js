import App from "/module/App.js";
import Events from "/module/Events.js";
import { el, div, View, h1, h2, h3, p, is, Base } from "/module/View.js";

View.stylesheet("/styles.css");


// script.js
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');
    const handle = document.querySelector('.slider-handle');

    let isDragging = false;

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });

    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    function startDrag(event) {
        event.preventDefault();
        isDragging = true;
        document.body.style.userSelect = 'none';
    }

    function onDrag(event) {
        if (!isDragging) return;

        let clientX = event.clientX;
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
        }

        const sliderRect = slider.getBoundingClientRect();
        let newLeft = clientX - sliderRect.left;

        newLeft = Math.max(0, newLeft);
        newLeft = Math.min(sliderRect.width, newLeft);

        handle.style.left = `${newLeft}px`;
    }

    function stopDrag() {
        isDragging = false;
        document.body.style.userSelect = 'auto';
    }
});


// script.js
document.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // Prevent the default context menu from appearing

    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
});

document.addEventListener('click', function() {
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'none'; // Hide the context menu on any click
});

const menuItems = document.querySelectorAll('.context-menu ul li');
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        alert(`You clicked ${this.textContent}`);
    });
});



// class Slider extends Base {
// 	initialize(){
// 		this.render();
// 	}

// 	render(){
// 		this.sli
// 	}
// }