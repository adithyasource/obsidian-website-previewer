# obsidian-website-previewer

⚠️ DEPRECATED: MIGHT NOT WORK ⚠️

<table>
<tbody>
<tr>
<td><a href="#how-to-download-and-setup-tested-and-verified-on-windows-only">> download & setup</a></td>
</tr>
</tbody>
</table>

whenever you paste a link into obsidian's canvas, it generates a webview of it in its place. this is great but for larger files with a bunch of links, this is not ideal for performance. \
\
this plugin makes it so that you can just hit a hotkey (ctrl + shift + d) and a preview image of that website will be downloaded, saved to drive and replace the current webview.

## How to Download and Setup (tested and verified on windows only)

-   make sure your obsidian vault is created and [python is installed](https://www.python.org/downloads/)
-   you'll need the plugin's zip file from [here](https://github.com/adithyasource/obsidian-website-previewer/releases/tag/1.0.2)
-   then in the location of the vault, go to `VAULT-LOCATION\.obsidian\plugins\` (create the plugins folder if it doesnt exist)
-   here extract the zip file such that the contents of `.obsidian\plugins\obsidian-website-previewer` only contain the `main.js` and `manifest.json` files
-   go [here](https://github.com/adithyasource/obsidian-website-previewer-api/releases/tag/1.0.0) and download the zip file for setting up the api and extract it to a folder
-   copy the location of the folder where you extracted the api to by clicking on the top bar that shows you which folder you are in (example: `C:\Users\USERNAME\Documents\obsidian-website-previewer-api`)
-   now open up terminal or command prompt from the search bar as administrator and then execute `cd LOCATION-OF-THE-API-FOLDER`
-   type in `py -m pip install virtualenv` followed by `py -m venv env`
-   this will create a virtual environment for that specific python server
-   then to activate that virtual environment, type in `.\env\Scripts\activate`
-   if the above step doesnt work, enter `Set-ExecutionPolicy RemoteSigned` and run it again
-   then run `pip install -r requirements.txt`
-   now the python server should spin up whenever you open `run.bat`
-   in order to make sure that this server runs in the background, we must set it as a background service using NSSM
-   download the latest release of NSSM from [here](https://nssm.cc/download)
-   open its folder and go to `win64` and copy the location of that folder
-   search `Edit the System environment variables` in search and open it up
-   click on `Environment Variables`
-   in the bottom section, scroll down until you find `Path` in the `Variable` column and double click on it.
-   click on new and paste in the directory of that folder
-   click "ok" to close all the opened windows
-   now open up terminal or command prompt from the search bar as administrator and then execute the following commands
    -   `nssm install obsidian-website-previewer-api "LOCATION-OF-THE-API-FOLDER\run.bat"`
    -   `nssm set obsidian-website-previewer-api AppStdout "LOCATION-OF-THE-API-FOLDER\logs.log"`
        -   `nssm set obsidian-website-previewer-api AppStdout "LOCATION-OF-THE-API-FOLDER\errors.log"`
        -   `nssm set obsidian-website-previewer-api AppRotateFiles 1`
        -   `nssm set obsidian-website-previewer-api AppRotateOnline 1`
        -   `nssm set obsidian-website-previewer-api AppRotateSeconds 86400`
        -   `nssm set obsidian-website-previewer-api AppRotateBytes 1048576`
        -   `nssm start obsidian-website-previewer-api`
-   make sure that the `obsidian-website-previewer-api` is running by typing in `services.msc` in windows run (open it by pressing win + r) and then check if its status is running
-   if it is not, please do open up an issue in the issues tab with relavant information
-   make sure that the plugin is turned on under `settings > community plugins`
-   if it isnt visible make sure to click on the refresh icon or restart obsidian
-   now whenever you open up a canvas with website links inside, make sure to press the hotkey (default: ctrl + shift + d) in order to download the preview images for all the webviews and save it locally
-   from now on, everytime you view that canvas, the website will use the already downloaded image as a preview. the link to the website will still be available by right clicking on the name of it
-   if you want to delete the preview for that website, delete the image from the folder `VAULT-LOCATION\-\website-previews\`
-   if you want to resize the website element, you can freely resize it and then switch to another page and come back. this should reload the images and the older image will become invalid since it is a different size and you'll be able to download that image again using the hotkey

## Other Repositories For obsidian-website-previewer

<table>
<tbody>
<tr>
<td><a href="https://github.com/adithyasource/obsidian-website-previewer-api" target="_blank">obsidian-website-previewer-api</a> website screenshotter api</td>
</tr>
</tbody>
</table>

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
