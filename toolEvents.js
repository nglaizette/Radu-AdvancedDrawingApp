function downCallbackForSelect (e) {
	
	PropertiesPanel.reset();
	const startPosition = new Vector(e.offsetX,e.offsetY);

	const [r, g, b, a ] = hitTestingCtx.getImageData(startPosition.x, startPosition.y, 1, 1).data;
	//console.log(r, g, b, a);
	const id =  r << 16 | g << 8 | b;
	//console.log(id);
	const shape = shapes.find(s=>s.id==id);
	
	const selectedShapes = shapes.filter((s) => s.selected);
	
	let isClickingSelectedShape = false;
	if (shape && shape.selected) {
	   isClickingSelectedShape = true;
	}
	
	if(!isClickingSelectedShape){
	   if (e.ctrlKey === false && e.shiftKey === false) {
		  shapes.forEach((s) => (s.selected = false));
	   }
	}

	drawShapes(shapes);

	if(shape){

		if(!isClickingSelectedShape) {  
			shape.selected = true;
		 }
		 const selectedShapes = shapes.filter((s) => s.selected);
		 const oldCenters = selectedShapes.map((s) => s.center);
		 let mouseDelta=null;

		//shape.setCenter(diff);
		drawShapes(shapes);
		PropertiesPanel.updateDisplay(selectedShapes);

		const moveCallback = function(e){
			const mousePosition = new Vector(e.offsetX,e.offsetY);
			//console.log(mousePosition.x);
			mouseDelta = Vector.subtract(mousePosition, startPosition);
			selectedShapes.forEach((s, i) => {
				s.setCenter(Vector.add(oldCenters[i], mouseDelta));
			});
			drawShapes(shapes);
			PropertiesPanel.updateDisplay(selectedShapes);
			//drawShapes([...shapes, currentShape]);
		};
	
		const upCallback = function (e) {
			myCanvas.removeEventListener('pointermove', moveCallback);
			myCanvas.removeEventListener('pointerup', upCallback);

			if(isClickingSelectedShape && !mouseDelta){
				shape.selected = false;
				drawShapes(shapes);
			 }
			PropertiesPanel.updateDisplay(selectedShapes);

			updateHistory(shapes);
		}
	
		myCanvas.addEventListener('pointermove', moveCallback);
		myCanvas.addEventListener('pointerup', upCallback);
	} else {
		selectShapeUnderRectangle(e);
	}
}

function selectShapeUnderRectangle(e){
	const startPosition = {
		x: e.offsetX,
		y: e.offsetY
	};

	let rect = document.createElement("div");
	rect.style.position = "fixed";
	rect.style.backgroundColor = "transparent";
	rect.style.border = "1px dotted";
	const htmlBody = document.querySelector("body");
	htmlBody.appendChild(rect);

	let rectMinX, rectMinY, rectMaxX, rectMaxY = 0;

	const moveCallback = function(e){
		const mousePosition = {
			x: e.clientX,
			y: e.clientY
		};
		rectMinX = Math.min(startPosition.x, mousePosition.x);
		rectMinY = Math.min(startPosition.y, mousePosition.y);
		const width = Math.abs(startPosition.x - mousePosition.x);
		const height = Math.abs(startPosition.y - mousePosition.y);
		rectMaxX = rectMinX + width;
		rectMaxY = rectMinY + height;
		const left = rectMinX;
		const top = rectMinY;
		rect.style.left = `${left}px`;
		rect.style.top = `${top}px`;
		rect.style.width = `${width}px`;
		rect.style.height = `${height}px`;
		};
	
	const upCallback = function (e) {
			myCanvas.removeEventListener('pointermove', moveCallback);
			myCanvas.removeEventListener('pointerup', upCallback);
			rect.removeEventListener("pointerup", upCallback);
			rect.removeEventListener("pointermove", moveCallback);

			shapes.forEach((shape) => {
				const points = shape.getPoints();
				const minX = Math.min(...points.map((p) => p.x + shape.center.x));
				const maxX = Math.max(...points.map((p) => p.x + shape.center.x));
				const minY = Math.min(...points.map((p) => p.y + shape.center.y));
				const maxY = Math.max(...points.map((p) => p.y + shape.center.y));

				if(minX >= rectMinX && maxX <= rectMaxX && minY >= rectMinY && maxY <= rectMaxY){
					shape.selected = true;
				}
			});

			rect.remove();
			PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));
			drawShapes(shapes);
			updateHistory(shapes);
		};
	// adding event listeners to the rectangle to allow rectangle redraw when pointer moves into it
	myCanvas.addEventListener('pointermove', moveCallback);
	myCanvas.addEventListener('pointerup', upCallback);
	rect.addEventListener("pointermove", moveCallback);
	rect.addEventListener("pointerup", upCallback);
}
