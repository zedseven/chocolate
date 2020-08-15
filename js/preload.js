const { ipcRenderer } = require("electron");

process.once("loaded", () => {
	window.addEventListener("DOMContentLoaded", () => {
		const replaceText = (selector, text) => {
			const element = document.getElementById(selector);
			if (element) {
				element.innerText = text;
			}
		};

		for (const type of ["chrome", "node", "electron"]) {
			replaceText(`${type}-version`, process.versions[type]);
		}
	});
	window.addEventListener("message", (event) => {
		const message = event.data;

		if (message.messageType === "version") {
			ipcRenderer.send("version", message);
		}
	});
	ipcRenderer.on("messageReply", (event, message) => {
		window.postMessage(message, "*");
	});
});
