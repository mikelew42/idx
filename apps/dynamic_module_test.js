// Step 1: Create a Blob from your ES module code
const code = `console.log('Hello from Blob!');`;
// const code = `export default function() { console.log('Hello from Blob!'); }`;
const blob = new Blob([code], { type: 'application/javascript' });

// Step 2: Create a Blob URL
const blobUrl = URL.createObjectURL(blob);

// Step 3: Dynamically load the Blob module
const script = document.createElement('script');
script.type = 'module';
// script.textContent = `export * as module from '${blobUrl}'; module.sayHello();`;
script.src = blobUrl;

document.body.appendChild(script);

console.log(blobUrl);

// Clean up the Blob URL when no longer needed
// URL.revokeObjectURL(blobUrl);
