import { Notice, Plugin, request } from "obsidian";

export default class MyPlugin extends Plugin {
	async onload() {
		function replaceWebView() {
			let replacedCount = 0;
			document.querySelectorAll("webview").forEach(async (e) => {
				const link = e.getAttribute("src");

				if (link != null) {
					request(link).then(async (res) => {
						const ogImageRegex =
							/<meta\s+property="og:image"\s+content="([^"]+)"\s*\/?>/i;
						const match = res.match(ogImageRegex);
						if (match && match.length >= 2) {
							const img = new Image();
							img.src = match[1];

							e.replaceWith(img);

							replacedCount += 1;
						} else {
							console.log("no og:image");
						}
					});
				}
			});

			// ! fix this later

			if (replacedCount != 0) {
				let notice = `replaced ${replacedCount} ${
					replacedCount == 1 ? "webview" : "webviews"
				} if og:image was found`;

				new Notice(notice);
			} else {
				new Notice("no og:images found");
			}
		}

		document.addEventListener("keyup", (e) => {
			if (e.key == "s" && e.ctrlKey) {
				replaceWebView();
			}
		});

		document.addEventListener("paste", () => {
			setTimeout(() => {
				replaceWebView();
			}, 200);
		});

		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				setTimeout(() => {
					replaceWebView();
				}, 200);
			})
		);
	}
}
