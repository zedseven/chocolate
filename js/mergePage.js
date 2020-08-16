document.merge = function () {
	requestVanillaData("merge", {
		mergeFiles: [$("#basePath")[0].files[0].path, $("#additivePath")[0].files[0].path],
		outFile: $("#mergedPath")[0].files[0].path,
	}).then((r) => console.log(r ? "Merge successful." : "Merge unsuccessful."));
};
