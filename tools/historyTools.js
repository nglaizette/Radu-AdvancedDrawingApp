class HistoryTools {

	/**
	* I used a object with with 2 arrays: undo and redo. And also a history that you can select where you want to go
	*/
	static redo() {
		if(redoStack.length > 0){
			const data= redoStack.pop();
			shapes = loadShapes(data);
			drawShapes(shapes);
			history.push(data);
			PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));
		}
	}

	static undo() {
		if(!history.length){ // prevent pushing undefined into redoStack
			return;
		}
		redoStack.push(history.pop());
		if(history.length > 0){
			shapes = loadShapes(history[history.length - 1]);
		}
		else {
			shapes.length = 0;
		}
		drawShapes(shapes);
		PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));	
	}
}