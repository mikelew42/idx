import { el, div, View, h1, h2, h3, p, is, Base } from "/module/View.js";

export default class Vid extends Base {

	async initialize(){
		// debugger;
		const video = this.video = el("video").attr("autoplay", "true").attr("width", "640").attr("height", "480").el;
		const canvas = this.canvas = el("canvas").attr("width", "640").attr("height", "480").el;
		const context = this.context = this.canvas.getContext("2d");
		const fps_view = div.c("fps");

		let lastTime = performance.now();
		let frameCount = 0;
		let fps = 0;

	  // Access the webcam
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true });
				video.srcObject = stream;
			} catch (error) {
				console.error('Error accessing webcam:', error);
			}

	  // Process video frames
			video.addEventListener('play', () => {
				const processFrame = () => {
					if (video.paused || video.ended) return;

	      // Draw the video frame to the canvas
					context.drawImage(video, 0, 0, canvas.width, canvas.height);

	      // Get the image data
					const frame = context.getImageData(0, 0, canvas.width, canvas.height);
					const data = frame.data;

	      // Process the pixel data
					for (let i = 0; i < data.length; i += 4) {
						const red = data[i];
						const green = data[i + 1];
						const blue = data[i + 2];
						const alpha = data[i + 3];

	        // Example: Convert to grayscale
						const avg = (red + green + blue) / 3;
						data[i] = avg;
						data[i + 1] = avg;
						data[i + 2] = avg;
					}

	      // Put the processed data back to the canvas
					context.putImageData(frame, 0, 0);


					// Measure FPS
					frameCount++;
					const now = performance.now();
					const elapsed = now - lastTime;

					if (elapsed >= 1000) {
						fps = frameCount / (elapsed / 1000);
						frameCount = 0;
						lastTime = now;

						// Update the FPS display
						fps_view.html(`FPS: ${fps.toFixed(2)}`);
						}

	      // Process the next frame
					requestAnimationFrame(processFrame);
				};

	    // Start processing frames
				processFrame();
			});
	}
}
