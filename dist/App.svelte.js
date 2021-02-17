/* src/App.svelte generated by Svelte v3.32.3 */
import {
	SvelteComponent,
	append,
	attr,
	detach,
	element,
	init,
	insert,
	listen,
	noop,
	safe_not_equal,
	set_data,
	space,
	text
} from "../_snowpack/pkg/svelte/internal.js";

import { onMount } from "../_snowpack/pkg/svelte.js";

function create_fragment(ctx) {
	let h1;
	let t1;
	let p0;
	let t3;
	let h2;
	let t5;
	let br;
	let t6;
	let button;
	let t8;
	let p1;
	let t9;
	let div;
	let p2;
	let t10;
	let code;
	let t11;
	let t12;
	let mounted;
	let dispose;

	return {
		c() {
			h1 = element("h1");
			h1.textContent = "Tweak KICAD pos file for JLC assembly";
			t1 = space();
			p0 = element("p");
			p0.textContent = "Click button below to select pos file to modify, \nit will then ask you to save the tweaked file";
			t3 = space();
			h2 = element("h2");
			h2.textContent = "Must use google chrome... I used a file picker that only works in chrome...";
			t5 = space();
			br = element("br");
			t6 = space();
			button = element("button");
			button.textContent = "google file picker";
			t8 = space();
			p1 = element("p");
			t9 = space();
			div = element("div");
			p2 = element("p");
			t10 = text("Page has been open for ");
			code = element("code");
			t11 = text(/*count*/ ctx[0]);
			t12 = text(" seconds.");
			attr(div, "class", "App");
		},
		m(target, anchor) {
			insert(target, h1, anchor);
			insert(target, t1, anchor);
			insert(target, p0, anchor);
			insert(target, t3, anchor);
			insert(target, h2, anchor);
			insert(target, t5, anchor);
			insert(target, br, anchor);
			insert(target, t6, anchor);
			insert(target, button, anchor);
			insert(target, t8, anchor);
			insert(target, p1, anchor);
			insert(target, t9, anchor);
			insert(target, div, anchor);
			append(div, p2);
			append(p2, t10);
			append(p2, code);
			append(code, t11);
			append(p2, t12);

			if (!mounted) {
				dispose = listen(button, "click", /*google_file_picker*/ ctx[1]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*count*/ 1) set_data(t11, /*count*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(h1);
			if (detaching) detach(t1);
			if (detaching) detach(p0);
			if (detaching) detach(t3);
			if (detaching) detach(h2);
			if (detaching) detach(t5);
			if (detaching) detach(br);
			if (detaching) detach(t6);
			if (detaching) detach(button);
			if (detaching) detach(t8);
			if (detaching) detach(p1);
			if (detaching) detach(t9);
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

function rotate(data, angle) {
	// console.log('rotate', data, typeof(angle))
	data[5] = Number(data[5]) + Number(angle);

	data[5] %= 360;
	return data;
}

async function getNewFileHandle() {
	const options = {
		types: [
			{
				description: "CSV position files",
				accept: { "text/csv": [".csv"] },
				suggestedName: "name.csv"
			}
		]
	};

	const handle = await window.showSaveFilePicker(options);
	return handle;
}

async function google_directory_picker(event) {
	let fileHandle;

	// [fileHandle] = await window.showOpenFilePicker();
	// console.log(fileHandle)
	const dirHandle = await window.showDirectoryPicker();

	for await (const entry of dirHandle.values()) {
		// console.log('entry', entry)
		if (entry.name.endsWith("-pos.csv")) {
			console.log(entry.kind, entry.name);
		}
	}

	console.log(dirHandle);
}

function instance($$self, $$props, $$invalidate) {
	let papa;
	let corrections;
	let count = 0;

	onMount(async () => {
		papa = await import("../_snowpack/pkg/papaparse.js");

		papa.parse("corrections.csv", {
			download: true,
			complete(results, file) {
				console.log("Parsing complete:", results, file);
				corrections = {};

				for (const row of results.data) {
					console.log("row", row);

					if (row.length > 1) {
						corrections[row[0]] = row.slice(1).map(s => s.trim());
					}
				}

				console.log("corrections", corrections);
			}
		}); // quoteChar: '',

		const interval = setInterval(() => $$invalidate(0, count++, count), 1000);

		return () => {
			clearInterval(interval);
		};
	});

	const handle = promise => {
		return promise.then(data => [data, undefined]).catch(error => Promise.resolve([undefined, error]));
	};

	function tweak(parsed) {
		let idx = 0;

		for (let name of parsed[0]) {
			// console.log(name)
			name = name.replace("PosX", "Mid X");

			name = name.replace("PosY", "Mid Y");
			name = name.replace("Ref", "Designator");
			name = name.replace("Rot", "Rotation");
			name = name.replace("Side", "Layer");
			parsed[0][idx] = name;
			idx = idx + 1;
		} // console.log(name);

		console.log(parsed[0]);

		for (let data of parsed) {
			if (data[1] in corrections) {
				let [footprint, angle] = corrections[data[1]];

				if (data[2] == footprint) {
					data = rotate(data, angle);
				}
			}
		}
	}

	async function google_file_picker(event) {
		let fileHandle, error;

		let options = {
			types: [
				{
					description: "Text Files",
					accept: { "text/csv": [".csv"] }
				}
			]
		};

		console.log(options);
		[fileHandle, error] = await handle(window.showOpenFilePicker(options));

		if (fileHandle) {
			fileHandle = fileHandle[0];
			console.log("Got file", fileHandle);
			const file = await fileHandle.getFile();
			const contents = await file.text();
			console.log("contents\n", contents);
			let options = { quoteChar: "\"" };
			let parsed = papa.parse(contents, options);
			console.log("parsed", parsed);
			tweak(parsed.data);
			console.log("tweaked", parsed);
			console.log("unparsed\n", papa.unparse(parsed));
			fileHandle = await getNewFileHandle();
			const writable = await fileHandle.createWritable();
			await writable.write(papa.unparse(parsed));
			await writable.close();
		} else {
			throw error;
		}
	}

	function update() {
		console.log("corrections", corrections);
	}

	return [count, google_file_picker];
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default App;