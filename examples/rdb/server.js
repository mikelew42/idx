import chokidar from "chokidar";
import fs from "fs";
import { glob } from "glob";


// Function to indent each line of a given text
function indentText(text, indentation) {
	return text.split('\n').map(line => indentation + line).join('\n');
}

async function compiler(templates){
	const watcher = chokidar.watch(templates);

	console.log("Watching ", templates);

	watcher.on("change", async (template_name) => {
		console.log(template_name, " changed");

		const template_data = fs.readFileSync(template_name, 'utf-8');

		const files = await glob("public/**/index.html");

		console.log("files", files);

		files.forEach(filePath => {
			let content = fs.readFileSync(filePath, 'utf-8');

			// Detect the indentation of the header/footer comment		
			const headerMatch = content.match(new RegExp(`(\\r?\\n)([ \\t]*)<!-- ${template_name} -->`));
			const footerMatch = content.match(new RegExp(`(\\r?\\n)([ \\t]*)<!-- /${template_name} -->`));

			if (headerMatch && footerMatch) {
				const newline = headerMatch[1];
				const indentation = headerMatch[2]; // detect indentation of html comment
				const indentedContent = indentText(template_data, indentation); // indent the content
				const regex = new RegExp(`<!-- ${template_name} -->[\\s\\S]*<!-- /${template_name} -->`);
				
				content = content.replace(regex, `<!-- ${template_name} -->\n${indentedContent}\n${indentation}<!-- /${template_name} -->`);

				fs.writeFileSync(filePath, content, 'utf-8');
				console.log(`${filePath} has been updated.`);
			} else {
				console.log(`Could not find matching comment tags for ${template_name} in ${filePath}.`)
			}

		});

	});
}

compiler(["header.html", "footer.html"]);