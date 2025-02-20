class HistoryTools {

	static redoStack = [];
	static undoStack = [];

	static redo() {
		if(HistoryTools.redoStack.length > 0){
			const data= HistoryTools.redoStack.pop();
			shapes = loadShapes(data);
			viewport.drawShapes(shapes);
			HistoryTools.undoStack.push(data);
			PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));
		}
	}

	static undo() {
		if(!HistoryTools.undoStack.length){ // prevent pushing undefined into redoStack
			return;
		}
		HistoryTools.redoStack.push(HistoryTools.undoStack.pop());
		if(HistoryTools.undoStack.length > 0){
			shapes = ShapeFactory.loadShapes(HistoryTools.undoStack[HistoryTools.undoStack.length - 1]);
		}
		else {
			shapes.length = 0;
		}
		viewport.drawShapes(shapes);
		PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));	
	}

	static record(shapes){
		HistoryTools.undoStack.push(shapes.map((s) => s.serialize()));
		HistoryTools.redoStack.length = 0;
	}
}