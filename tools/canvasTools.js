class CanvasTools {
	static tools = [
		{name: "Path", class: new PathTool(), showButton: true },
		{name: "Rect", class: new RectTool(), showButton: true },
		{name: "Oval", class: new OvalTool(), showButton: true },
		{name: "Text", class: new TextTool(), showButton: true },
		{name: "Select", class: SelectTool, showButton: true },
		{name: "MyImage", class: new MyImageTool(), showButton: false}
	];

	static selectTool(type) {

		// Remove all event listeners from the canvas
		CanvasTools.tools.forEach((tool) => tool.class.removeEventListeners());
		
		const tool = CanvasTools.tools.find(tools => tools.name === type);
		// Add event listeners to the selected tool
		tool.class.configureEventListeners();

		// Dispatch an event to notify listeners the tool has been selected
		viewport.dispatchEvent(
			new CustomEvent("toolSelected", { detail: tool })
		);
		return tool
	}
}