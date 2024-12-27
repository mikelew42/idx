let initialDistance = 0;
let initialMidPoint = { x: 0, y: 0 };
let isPinching = false;

const element = document.getElementById('canvas'); // Example element (e.g., a WebGL canvas)

// Helper function to calculate the distance between two touch points
function getDistance(touches) {
  const [touch1, touch2] = touches;
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Helper function to find the midpoint between two touches
function getMidPoint(touches) {
  const [touch1, touch2] = touches;
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

// Touchstart event: Detect if two fingers are touching
element.addEventListener('touchstart', (event) => {
  if (event.touches.length === 2) {
    isPinching = true;
    initialDistance = getDistance(event.touches);
    initialMidPoint = getMidPoint(event.touches);
  }
});

// Touchmove event: Handle pinch zoom and two-finger pan
element.addEventListener('touchmove', (event) => {
  if (isPinching && event.touches.length === 2) {
    event.preventDefault(); // Prevent scrolling

    const newDistance = getDistance(event.touches);
    const midPoint = getMidPoint(event.touches);

    // Calculate zoom factor based on the change in distance
    const zoomFactor = newDistance / initialDistance;
    console.log(`Zoom Factor: ${zoomFactor}`);

    // Calculate pan offset based on the movement of the midpoint
    const dx = midPoint.x - initialMidPoint.x;
    const dy = midPoint.y - initialMidPoint.y;
    console.log(`Pan: dx=${dx}, dy=${dy}`);

    // Update initial values for smooth interactions
    initialDistance = newDistance;
    initialMidPoint = midPoint;
  }
});

// Touchend event: Reset state when fingers are lifted
element.addEventListener('touchend', (event) => {
  if (event.touches.length < 2) {
    isPinching = false;
  }
});
