class PathTool {
	static addPointerDownListener (e) {
		
		if(e.button !== 0) return;

		const startPosition = viewport.getAdjustedPosition(Vector.fromOffsets(e));
		
		currentShape =  new Path(startPosition,PropertiesPanel.getValues());
	
		const moveCallback = function(e){
		const mousePosition = viewport.getAdjustedPosition(Vector.fromOffsets(e));

			currentShape.addPoint(mousePosition);	
			viewport.drawShapes([...shapes, currentShape]);
		};
	
		const upCallback = function (e) {
			viewport.canvas.removeEventListener('pointermove', moveCallback);
			viewport.canvas.removeEventListener('pointerup', upCallback);
	
			currentShape.recenter();
			if (currentShape.size.width > 0 && currentShape.size.height > 0) {
				shapes.push(currentShape);
				HistoryTools.record(shapes);
			}
		}
	
		viewport.canvas.addEventListener('pointermove', moveCallback);
		viewport.canvas.addEventListener('pointerup', upCallback);
	}

	static configureEventListeners() {
		viewport.canvas.addEventListener("pointerdown", this.addPointerDownListener);
	}

	static removeEventListeners() {
		viewport.canvas.removeEventListener("pointerdown", this.addPointerDownListener);
	}
}

ShapeFactory.registerShape(Path, "Path");