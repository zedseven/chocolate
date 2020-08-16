// A messy but solid method of securely requesting and receiving data from main, without exposing node to the renderer.
window.requestVanillaData = async function (messageType, data = undefined) {
	let sMessage = { messageType: messageType };
	if (data !== undefined) sMessage.data = data;
	await window.postMessage(sMessage, "*");
	return new Promise(function (resolve, reject) {
		// https://stackoverflow.com/a/43084615
		const listener = function (event) {
			const rMessage = event.data;
			if (rMessage.messageType !== sMessage.messageType + "Reply") return;
			window.removeEventListener("message", listener);
			resolve(rMessage.data);
		};
		window.addEventListener("message", listener);
	});
};
