class ShapeTools {
	static tools = {
		"path": {class: PathTool, radioId:"pathRadio"},
		"rect": {class: RectTool, radioId:"rectRadio"},
		"oval": {class: OvalTool, radioId:"ovalRadio"},
		"text": {class: TextTool, radioId:"textRadio"},
		"select": {class: SelectTool, radioId:"selectRadio"},
	};

	static selectTool(tool) {

		for (const key in ShapeTools.tools) {
			const tool = ShapeTools.tools[key];
			myCanvas.removeEventListener('pointerdown', tool.class.addPointerDownListener)
		}
		
		shapes.forEach((s) => (s.selected = false));
		drawShapes(shapes);
	
		myCanvas.addEventListener('pointerdown', ShapeTools.tools[tool].class.addPointerDownListener);
		const radioBtn =  document.getElementById(ShapeTools.tools[tool].radioId);
		radioBtn.checked = true;
	}
}