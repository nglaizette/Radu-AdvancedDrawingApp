class ShapeTools {
	static tools = [
		{name: "Path", class: PathTool, showButton: true },
		{name: "Rect", class: RectTool, showButton: true },
		{name: "Oval", class: OvalTool, showButton: true },
		{name: "Text", class: TextTool, showButton: true },
		{name: "Select", class: SelectTool, showButton: true },
		{name: "MyImage", class: MyImageTool, showButton: false}
	];

	static selectTool(type) {

		// Remove all event listeners from the canvas
		ShapeTools.tools.forEach((tools) => tools.class.removeEventListeners());
		
		const tool = ShapeTools.tools.find(tools => tools.name === type);
	
		// Add event listeners to the selected tool
		tool.class.configureEventListeners();
		return tool
	}
}