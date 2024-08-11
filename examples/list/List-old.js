export default class List {
    constructor(name) {
        this.name = name;
        this.lists = [];
        this.element = this.createElement();
        this.placeholder = null;

    }

    createElement() {
        const div = document.createElement('div');
        div.classList.add('list');
        div.innerText = this.name;
        div.addEventListener('mousedown', this.onMouseDown.bind(this));
        div.addEventListener('touchstart', this.onTouchStart.bind(this));
        return div;
    }

    addList(list) {
        this.lists.push(list);
        this.element.appendChild(list.element);
    }

    onMouseDown(event) {
        this.startDrag(event.clientX, event.clientY, event);
    }

    onTouchStart(event) {
        const touch = event.touches[0];
        this.startDrag(touch.clientX, touch.clientY, event);
    }

    startDrag(x, y, event) {
        event.preventDefault();
        this.draggedElement = this.element;
        this.offsetX = x - this.element.getBoundingClientRect().left;
        this.offsetY = y - this.element.getBoundingClientRect().top;

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onMouseMove(event) {
        this.moveAt(event.clientX, event.clientY);
    }

    onTouchMove(event) {
        const touch = event.touches[0];
        this.moveAt(touch.clientX, touch.clientY);
    }

    moveAt(x, y) {
        this.draggedElement.style.position = 'absolute';
        this.draggedElement.style.zIndex = 1000;
        this.draggedElement.style.left = `${x - this.offsetX}px`;
        this.draggedElement.style.top = `${y - this.offsetY}px`;

        this.detectDropZone(x, y);
    }

    detectDropZone(x, y) {
        const elements = document.elementsFromPoint(x, y);
        const placeholder = document.querySelector('.placeholder');

        if (placeholder) {
            placeholder.remove();
        }

        elements.forEach(el => {
            if (el.classList.contains('list') && el !== this.draggedElement) {
                this.createPlaceholder(el);
            }
        });
    }

    createPlaceholder(target) {
        const rect = target.getBoundingClientRect();
        this.placeholder = document.createElement('div');
        this.placeholder.classList.add('placeholder');
        this.placeholder.style.top = `${rect.bottom}px`;
        target.parentNode.insertBefore(this.placeholder, target.nextSibling);
    }

    onMouseUp() {
        this.endDrag();
    }

    onTouchEnd() {
        this.endDrag();
    }

    endDrag() {
        if (this.placeholder) {
            this.placeholder.parentNode.insertBefore(this.draggedElement, this.placeholder);
            this.placeholder.remove();
        }

        this.draggedElement.style.position = '';
        this.draggedElement.style.zIndex = '';
        this.draggedElement.style.left = '';
        this.draggedElement.style.top = '';

        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
        document.removeEventListener('touchmove', this.onTouchMove.bind(this));
        document.removeEventListener('mouseup', this.onMouseUp.bind(this));
        document.removeEventListener('touchend', this.onTouchEnd.bind(this));
    }
}