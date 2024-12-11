function downCallbackForSelect (e) {
	
	propertiesPanel.reset();
	const startPosition = new Vector(e.offsetX,e.offsetY);

	const [r, g, b, a ] = hitTestingCtx.getImageData(startPosition.x, startPosition.y, 1, 1).data;
	//console.log(r, g, b, a);
	const id =  r << 16 | g << 8 | b;
	//console.log(id);
	const shape = shapes.find(s=>s.id==id);
	
	shapes.forEach((s) => (s.selected = false));
	drawShapes(shapes);

	if(shape){
		shape.selected = true;
		//console.log(shape);
		//const diff = addPoints(startPosition, subtractPoints(shape.center, startPosition));
		const oldCenter=shape.center;

		//shape.setCenter(diff);
		drawShapes(shapes);
		PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));

		const moveCallback = function(e){
			const mousePosition = new Vector(e.offsetX,e.offsetY);
			//console.log(mousePosition.x);
			const mouseDelta = Vector.subtract(mousePosition, startPosition);
			shape.setCenter(Vector.add(oldCenter, mouseDelta));
			drawShapes(shapes);
			//drawShapes([...shapes, currentShape]);
		};
	
		const upCallback = function (e) {
			myCanvas.removeEventListener('pointermove', moveCallback);
			myCanvas.removeEventListener('pointerup', upCallback);
			PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));

			updateHistory(shapes);
		}
	
		myCanvas.addEventListener('pointermove', moveCallback);
		myCanvas.addEventListener('pointerup', upCallback);
	}
}
