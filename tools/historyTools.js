class HistoryTools {

	static redoStack = [];
	static undoStack = [];

	/**
	* I used a object with with 2 arrays: undo and redo. And also a history that you can select where you want to go
	*/
	static redo() {
		if(HistoryTools.redoStack.length > 0){
			const data= HistoryTools.redoStack.pop();
			shapes = loadShapes(data);
			drawShapes(shapes);
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
			shapes = loadShapes(HistoryTools.undoStack[HistoryTools.undoStack.length - 1]);
		}
		else {
			shapes.length = 0;
		}
		drawShapes(shapes);
		PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));	
	}

	static record(shapes){
		HistoryTools.undoStack.push(shapes.map((s) => s.serialize(stageProperties)));
		HistoryTools.redoStack.length = 0;
	}
}