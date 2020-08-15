// Modules to control application life and create native browser window
const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");
const vanilla = require("vanilla");

let mainWindow;
function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		backgroundColor: "#000000",
		webPreferences: {
			preload: path.join(__dirname, "js", "preload.js"),
			nodeIntegration: false,
			enableRemoteModule: false,
			contextIsolation: true,
			sandbox: true,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile("index.html");

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other
		// windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

	// API-like structure for secure communication between main and renderer - https://stackoverflow.com/a/57656281
	let reply = function (messageType, data) {
		mainWindow.webContents.send("messageReply", { messageType: messageType + "Reply", data: data });
	};

	ipcMain.on("version", (event, message) => {
		console.log("Got the version message.", message);
		const version = vanilla.version();
		reply(message.messageType, version);
	});
});

// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay
// active until the user quits explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

ipcMain.handle("perform-action", (event) => {
	// ... do something on behalf of the renderer ...
});

// In this file you can include the rest of your app's specific main process code. You can also put them in separate
// files and require them here.
//console.log(vanilla.version());
