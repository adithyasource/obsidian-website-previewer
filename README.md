# obsidian-website-previewer

<table>
<tbody>
<tr>
<td><a href="#" target="_blank">> download & setup</a></td>
</tr>
</tbody>
</table>

whenever you paste a link into obsidian's canvas, it generates a webview of it in its place. this is great but for larger files with a bunch of links, this is not ideal for performance. \
\
this plugin makes it so that you can just hit a hotkey (ctrl + shift + d) and a preview image of that website will be downloaded, saved to drive and replace the current webview.

## How to Download and Setup

- make sure your obsidian vault is created and python is installed
- for this you'll need the plugin's zip file from here
- then in the location of the vault, go to `.obsidian\plugins\` (create the plugins folder if it doesnt exist)
- here extract the zip file such that the contents of `.obsidian\plugins\obsidian-website-previewer` only contain the `main.js` and `manifest.json` files
- go here and download the zip file and extract it to a folder
- go into that folder and right click on an empty space and click on `open in terminal`
- type in `pip install virtualenv` followed by `python -m venv env`
- this will create a virtual environment for that specific python server
- then to activate that virtual environment, type in `.\env\Scripts\activate.bat`
- now the python server should spin up whenever you open `run.bat`
- in order to make sure that this server runs in the background, we must set it as a background service using NSSM
- download NSSM from here
- open its folder and go to `win64` and copy the directory of that folder by clicking on the top bar that shows you which folder you are in and copying the value (example: `C:\Users\USERNAME\Documents\nssm-2.24\win64`)
- search `Edit the System environment variables` in search and open it up
- click on `Environment Variables`
- in the bottom section, scroll down until you find `Path` in the `Variable` column and double click on it.
- click on new and paste in the directory of that folder
- now open up terminal or command prompt from the search bar and type in `nssm install obsidian-webview-replacer-api "LOCATION-OF-THE-API-FOLDER\run.bat"`
- then execute the following commands
  - `nssm set obsidian-webview-replacer-api AppStdout "LOCATION-OF-THE-API-FOLDER\logs.log"`
  - `nssm set obsidian-webview-replacer-api AppStdout "LOCATION-OF-THE-API-FOLDER\errors.log"`
  - `nssm set obsidian-webview-replacer-api AppRotateFiles 1`
  - `nssm set obsidian-webview-replacer-api AppRotateOnline 1`
  - `nssm set obsidian-webview-replacer-api AppRotateSeconds 86400`
  - `nssm set obsidian-webview-replacer-api AppRotateBytes 1048576`
  - `nssm start obsidian-webview-replacer-api`
  - `sc start obsidian-webview-replacer-api`
- make sure that the `obsidian-webview-replacer-api` is running by typing in `services.msc` in windows run (open it by pressing win + r) and then check if its status is running
- if it is not, please do open up an issue in the issues tab
- now whenever you open up a canvas with webviews inside, make sure to press the hotkey (default ctrl + shitft + d) in order to download the preview for all the webviews and save it locally
- next time you visit that canvas again, the website will use the already downloaded image as a preview
- if you want to delete the preview for that website, delete the image from the folder `VAULT-LOCATION\-\website-previews\`
- if you want to refresh the preview image by resizing it, switching to another page and back should reload the images and the older image will become invalid since it is a different size and you'll be able to download that image again


## Other Repositories For obsidian-website-previewer

<table>
<tbody>
<tr>
<td><a href="https://github.com/adithyasource/obsidian-website-previewer-api" target="_blank">obsidian-website-previewer-api</a> website screenshotter api</td>
</tr>
</tbody>
</table>

## License

This project is licensed under [Unlicense](https://unlicense.org).

## Acknowledgments

<table>
<tbody>
<tr>
<td><b>Libraries</b></td>
<td><a href="https://docs.obsidian.md/Home" target="_blank">Obsidian</a></td>
<td><a href="https://www.npmjs.com/package/jimp" target="_blank">Jimp</a></td>
</tr>
</tbody>
</table>
