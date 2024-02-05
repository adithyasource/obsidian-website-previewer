// @ts-ignore
// @ts-nocheck

import { Plugin } from "obsidian";

import fs from "fs/promises";

import Jimp from "jimp";
import path from "path";

export default class MyPlugin extends Plugin {
	async onload() {
		setTimeout(() => {
			const activeFile = this.app.workspace.getActiveFile();

			let activePath = this.app.vault.getResourcePath(activeFile);

			activePath = activePath.split("/");

			activePath.pop();

			activePath = activePath.join("/");

			const vaultLocation = this.app.vault.adapter.basePath;

			async function replaceWebView() {
				let replacedCount = 0;
				let missingDownloads = 0;

				document.querySelectorAll("webview").forEach(async (e) => {
					const link = e.getAttribute("src");

					let style =
						e.parentNode.parentNode.parentNode.getAttribute(
							"style"
						);

					let widthRegex = /width: (\d+)px;/;
					let heightRegex = /height: (\d+)px;/;

					let width = parseInt(style.match(widthRegex)[1]);
					let height = parseInt(style.match(heightRegex)[1]);

					if (link != null) {
						let imageAlreadyExists = false;

						let imageFileName =
							link
								.replaceAll(".", "-")
								.replaceAll("/", "-")
								.replaceAll(":", "-")
								.replaceAll("#", "-") +
							width +
							height +
							".jpg";

						let files = await fs.readdir(
							path.join(vaultLocation, "-", "website-previews")
						);

						files.forEach((file) => {
							if (file == imageFileName) {
								imageAlreadyExists = true;
							}
						});

						if (imageAlreadyExists) {
							console.log("img alr exist");
							const img = new Image();

							let imgPath =
								activePath +
								"/-/website-previews/" +
								imageFileName;

							img.src = imgPath;
							console.log(imgPath);
							e.replaceWith(img);

							console.log(img);
						} else {
							// ? image not downloaded
							missingDownloads += 1;
						}
					}
				});
			}

			function downloadImages() {
				document.querySelectorAll("webview").forEach(async (e) => {
					const link = e.getAttribute("src");

					let style =
						e.parentNode.parentNode.parentNode.getAttribute(
							"style"
						);

					let widthRegex = /width: (\d+)px;/;
					let heightRegex = /height: (\d+)px;/;

					let width = parseInt(style.match(widthRegex)[1]);
					let height = parseInt(style.match(heightRegex)[1]);

					if (link != null) {
						let imageFileName =
							link
								.replaceAll(".", "-")
								.replaceAll("/", "-")
								.replaceAll(":", "-")
								.replaceAll("#", "-") +
							width +
							height +
							".jpg";

						const outputPath = path.join(
							vaultLocation,
							"-",
							"website-previews",
							imageFileName
						);
						fetch(
							"http://127.0.0.1:5002/api?" +
								new URLSearchParams({
									url: link,
									width: width,
									height: height,
								})
						).then((res) => {
							res.json().then((jsonres) => {
								const buffer: Buffer = Buffer.from(jsonres.img);
								Jimp.read(buffer, (err: Error, image: Jimp) => {
									if (err) {
										console.error(err);
									} else {
										image.write(
											outputPath,
											(err: Error) => {
												if (err) {
													console.error(err);
												} else {
													console.log(
														"Image saved successfully"
													);
												}
											}
										);
									}
								});
							});
						});
					}
				});
			}

			document.addEventListener("keyup", async (e) => {
				if (e.key == "r" && e.ctrlKey && e.altKey) {
					replaceWebView();
					console.log("res");
				}
			});

			document.addEventListener("keyup", async (e) => {
				if (e.key == "d" && e.ctrlKey && e.altKey) {
					console.log("donloading");
					downloadImages();
				}
			});

			this.registerEvent(
				this.app.workspace.on("file-open", () => {
					setTimeout(() => {
						replaceWebView();
					}, 2000);
				})
			);

			try {
				setInterval(() => {
					replaceWebView();
				}, 2000);
			} catch (error) {}
		}, 1000);
	}
}
