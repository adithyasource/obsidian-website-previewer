// @ts-ignore
// @ts-nocheck

import { Notice, Plugin, request } from "obsidian";

import fs from "fs/promises";

import Jimp from "jimp";
import path from "path";

export default class MyPlugin extends Plugin {
	async onload() {
		const activeFile = this.app.workspace.getActiveFile();

		let activePath = this.app.vault.getResourcePath(activeFile);

		activePath = activePath.split("/");

		activePath.pop();

		activePath = activePath.join("/");

		const vaultLocation = this.app.vault.adapter.basePath;

		function replaceWebView() {
			let replacedCount = 0;

			document.querySelectorAll("webview").forEach(async (e) => {
				const link = e.getAttribute("src");

				if (link != null) {
					let imageAlreadyExists = false;

					let imageFileName =
						link
							.replaceAll(".", "-")
							.replaceAll("/", "-")
							.replaceAll(":", "-") + ".jpg";

					let files = await fs.readdir(path.join(vaultLocation, "-"));

					files.forEach((file) => {
						if (file == imageFileName) {
							imageAlreadyExists = true;
						}
					});

					console.error("up" + imageAlreadyExists);

					if (imageAlreadyExists) {
						console.log("img alr exist");
						const img = new Image();
						let imgPath = activePath + "/-/" + imageFileName;

						img.src = imgPath;
						console.log(imgPath);
						e.replaceWith(img);

						console.log(img);
					} else {
						console.log("gotta download boss");
					}

					// request(link).then(async (res) => {
					// 	const ogImageRegex =
					// 		/<meta\s+property="og:image"\s+content="([^"]+)"\s*\/?>/i;
					// 	const match = res.match(ogImageRegex);
					// 	if (match && match.length >= 2) {
					// 		const img = new Image();
					// 		img.src = match[1];
					// 		e.replaceWith(img);
					// 		replacedCount += 1;
					// 	} else {
					// 		console.log("no og:image");
					// 	}
					// });
				}
			});

			// ! fix this later

			if (replacedCount != 0) {
				const notice = `replaced ${replacedCount} ${
					replacedCount == 1 ? "webview" : "webviews"
				} if og:image was found`;

				new Notice(notice);
			} else {
				new Notice("no og:images found");
			}
		}

		function downloadImages() {
			document.querySelectorAll("webview").forEach(async (e) => {
				const link = e.getAttribute("src");

				if (link != null) {
					let imageFileName =
						link
							.replaceAll(".", "-")
							.replaceAll("/", "-")
							.replaceAll(":", "-") + ".jpg";

					const outputPath = path.join(
						vaultLocation,
						"-",
						imageFileName
					);
					fetch(
						"http://127.0.0.1:5002/api?" +
							new URLSearchParams({
								url: link,
							})
					).then((res) => {
						res.json().then((jsonres) => {
							const buffer: Buffer = Buffer.from(jsonres.img);
							Jimp.read(buffer, (err: Error, image: Jimp) => {
								if (err) {
									console.error(err);
								} else {
									image.write(outputPath, (err: Error) => {
										if (err) {
											console.error(err);
										} else {
											console.log(
												"Image saved successfully"
											);
										}
									});
								}
							});
						});
					});
				}
			});
		}

		document.addEventListener("keyup", async (e) => {
			if (e.key == "s" && e.ctrlKey) {
				replaceWebView();
				console.log("res");
			}
		});

		document.addEventListener("keyup", async (e) => {
			if (e.key == "d" && e.ctrlKey) {
				console.log("donloading");
				downloadImages();
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
