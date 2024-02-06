// @ts-ignore
// @ts-nocheck

import { Notice, Plugin } from "obsidian";

import fs from "fs/promises";

import Jimp from "jimp";
import path from "path";

export default class MyPlugin extends Plugin {
	async onload() {
		let activeFile;

		let activePath;

		let vaultLocation = this.app.vault.adapter.basePath;

		setTimeout(async () => {
			activeFile = this.app.workspace.getActiveFile();
			activePath = this.app.vault.getResourcePath(activeFile);

			activePath = activePath.split("/");

			activePath.pop();

			activePath = activePath.join("/");
		}, 2000);

		async function createDirIfNotExists() {
			try {
				await fs.readdir(path.join(vaultLocation, "-"));
			} catch (error) {
				await fs.mkdir(path.join(vaultLocation, "-"));
			}

			try {
				await fs.readdir(
					path.join(vaultLocation, "-", "website-previews")
				);
			} catch (error) {
				await fs.mkdir(
					path.join(vaultLocation, "-", "website-previews")
				);
			}
		}

		async function replaceWebView() {
			let replacedCount = 0;
			let missingDownloads = 0;

			document.querySelectorAll("webview").forEach(async (e) => {
				const link = e.getAttribute("src");

				let style =
					e.parentNode.parentNode.parentNode.getAttribute("style");

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
						const img = new Image();

						let imgPath =
							activePath + "/-/website-previews/" + imageFileName;

						img.src = imgPath;
						e.replaceWith(img);
					} else {
						// ? image not downloaded
						missingDownloads += 1;
					}
				}
			});
		}

		function downloadImages() {
			createDirIfNotExists();

			document.querySelectorAll("webview").forEach(async (e) => {
				const link = e.getAttribute("src");

				let style =
					e.parentNode.parentNode.parentNode.getAttribute("style");

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
									image.write(outputPath, (err: Error) => {
										if (err) {
											console.error(err);
										} else {
											console.log("downloaded: " + link);
										}
									});
								}
							});
						});
					});
				}
			});
		}

		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				setTimeout(() => {
					replaceWebView();
				}, 2000);
			})
		);

		this.addCommand({
			id: "obsidian-website-previewer-download",
			name: "downloads images for links that dont have it yet",
			callback: () => {
				downloadImages();
				new Notice("downloading! check dev console for progress");
			},
			hotkeys: [
				{
					modifiers: ["Mod", "Shift"],
					key: "d",
				},
			],
		});

		try {
			setInterval(() => {
				replaceWebView();
			}, 2000);
		} catch (error) {}
	}
}
