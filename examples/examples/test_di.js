// testing dynamic import

import("./conditional.js").then(value => {
	console.log("imported ", value);
});