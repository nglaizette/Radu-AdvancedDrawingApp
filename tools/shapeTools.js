class ShapeTools {
	static tools = {
		"path": {class: PathTool, radioId:"pathRadio"},
		"rect": {class: RectTool, radioId:"rectRadio"},
		"oval": {class: OvalTool, radioId:"ovalRadio"},
		"text": {class: TextTool, radioId:"textRadio"},
		"select": {class: SelectTool, radioId:"selectRadio"},
	};

	static selectTool(tool) {
		changeTool(tool);
		const radioBtn =  document.getElementById(ShapeTools.tools[tool].radioId);
		radioBtn.checked = true;
	}
}