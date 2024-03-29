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

		let obsidianFilePath;

		const vaultLocation = this.app.vault.adapter.basePath;

		async function createDirIfNotExists() {
			try {
				await fs.readdir(path.join(vaultLocation, ".cache"));
			} catch (error) {
				await fs.mkdir(path.join(vaultLocation, ".cache"));
			}

			try {
				await fs.readdir(
					path.join(vaultLocation, ".cache", "website-previews")
				);
			} catch (error) {
				await fs.mkdir(
					path.join(vaultLocation, ".cache", "website-previews")
				);
			}
		}

		createDirIfNotExists();

		setTimeout(async () => {
			activeFile = this.app.workspace.getActiveFile();

			activePath = this.app.vault.getResourcePath(activeFile);

			activePath = activePath.split("/");

			activePath.pop();

			activePath = activePath.join("/");

			const filePath = this.app.workspace.getActiveFile().path;

			obsidianFilePath = encodeURI(filePath);

			obsidianFilePath = obsidianFilePath.split("/");

			obsidianFilePath.pop();

			obsidianFilePath = obsidianFilePath.join("/");

			activePath = activePath.replace(obsidianFilePath, "");
		}, 2000);

		async function replaceWebView() {
			document.querySelectorAll("webview").forEach(async (e) => {
				const link = e.getAttribute("src");

				const style =
					e.parentNode.parentNode.parentNode.getAttribute("style");

				const widthRegex = /width: (\d+)px;/;
				const heightRegex = /height: (\d+)px;/;

				const width = parseInt(style.match(widthRegex)[1]);
				const height = parseInt(style.match(heightRegex)[1]);

				if (link != null) {
					let imageAlreadyExists = false;

					const imageFileName =
						link
							.replaceAll(".", "-")
							.replaceAll("/", "-")
							.replaceAll(":", "-")
							.replaceAll("#", "-") +
						width +
						height +
						".jpg";

					const files = await fs.readdir(
						path.join(vaultLocation, ".cache", "website-previews")
					);

					files.forEach((file) => {
						if (file == imageFileName) {
							imageAlreadyExists = true;
						}
					});

					if (imageAlreadyExists) {
						const img = new Image();

						const imgPath =
							activePath +
							"/.cache/website-previews/" +
							imageFileName;

						img.src = imgPath;
						e.replaceWith(img);
					} else {
						// ? image not downloaded
					}
				}
			});
		}

		function downloadImages() {
			createDirIfNotExists();

			document.querySelectorAll("webview").forEach(async (e) => {
				const link = e.getAttribute("src");

				const style =
					e.parentNode.parentNode.parentNode.getAttribute("style");

				const widthRegex = /width: (\d+)px;/;
				const heightRegex = /height: (\d+)px;/;

				const width = parseInt(style.match(widthRegex)[1]);
				const height = parseInt(style.match(heightRegex)[1]);

				if (link != null) {
					const imageFileName =
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
						".cache",
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
											const noticeText =
												"downloaded: " + link;
											new Notice(noticeText);
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
				new Notice("downloading!");
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
		} catch (error) {
			// ! Fix later
		}
	}
}
