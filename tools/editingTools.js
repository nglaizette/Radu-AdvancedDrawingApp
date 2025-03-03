class EditingTools {

	static selectAll() {
		shapes.forEach((s) => (s.selected = true));
		viewport.drawShapes(shapes);
	 }
	
	static copy() {
		const selectedShapes = shapes.filter((s) => s.selected);
		if(selectedShapes.length > 0){
			const data = selectedShapes.map((s) => s.serialize());
			//copyToClipboard(JSON.stringify(selectedShapes));
			clipboard = JSON.stringify(data);
		}
	}
	
	static paste() {
		if(clipboard){
			shapes.forEach((s) => (s.selected = false));
			const newShapes= ShapeFactory.loadShapes(JSON.parse(clipboard));
			newShapes.forEach((s) => s.id = Shape.generateId());
			shapes.push(...newShapes);
	
			viewport.drawShapes(shapes);
			HistoryTools.record(shapes);
		};
	}
	
	static duplicate(){
		EditingTools.copy();
		EditingTools.paste();
	}

	static delete() {
		let index = shapes.findIndex((s) => s.selected);
		let shouldUpdateHistory = index !== -1;
		while (index !== -1) {
			shapes.splice(index, 1);
			index = shapes.findIndex((s) => s.selected);
		}
	
		if(shouldUpdateHistory){
			HistoryTools.record(shapes);
		}
		PropertiesPanel.reset();
		viewport.drawShapes(shapes);
	}
} 