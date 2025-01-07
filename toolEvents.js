function downCallbackForSelect (e) {

	if(e.button !== 0) return;
	
	PropertiesPanel.reset();
	const startPosition = new Vector(e.offsetX,e.offsetY);

	const [r, g, b, a ] = hitTestingCtx.getImageData(startPosition.x, startPosition.y, 1, 1).data;
	//console.log(r, g, b, a);
	const id =  r << 16 | g << 8 | b;
	//console.log(id);
	const shape = shapes.find(s=>s.id==id);
	
	let isClickingSelectedShape = shape && shape.selected;
	
	if (!isClickingSelectedShape) {
	   if (e.ctrlKey === false && e.shiftKey === false) {
		  shapes.forEach((s) => (s.selected = false));
	   }
	}

	if (shape){

		if (!isClickingSelectedShape) {  
			shape.selected = true;
		 }
		 const selectedShapes = shapes.filter((s) => s.selected);
		 const oldCenters = selectedShapes.map((s) => s.center);
		 let mouseDelta = null;
		 let isDragging = false;

		//shape.setCenter(diff);
		drawShapes(shapes);
		PropertiesPanel.updateDisplay(selectedShapes);

		const moveCallback = function(e){
			const mousePosition = new Vector(e.offsetX,e.offsetY);
			const diff = Vector.subtract(mousePosition, startPosition);
			mouseDelta = viewport.scale(diff);

			/*if(e.altKey){
				mouseDelta.x = Math.round(mouseDelta.x / 10) * 10;
				mouseDelta.y = Math.round(mouseDelta.y / 10) * 10;
			}*/
			//console.log(mousePosition.x);

			isDragging = true;

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

			if (isClickingSelectedShape && !isDragging) {
				shape.selected = false;
				drawShapes(shapes);
			 }
			PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));

			if (!isDragging && mouseDelta?.magnitude() > 0) {
				updateHistory(shapes);
			}	
		}
	
		myCanvas.addEventListener('pointermove', moveCallback);
		myCanvas.addEventListener('pointerup', upCallback);
	} else {
		selectShapeUnderRectangle(e);
	}

	drawShapes(shapes);
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
	rect.style.pointerEvents = "none";
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

			rectMinX = (rectMinX - canvasProperties.offset.x) / viewport.zoom - viewport.offset.x;
			rectMinY = (rectMinY - canvasProperties.offset.y) / viewport.zoom - viewport.offset.y;
			rectMaxX = (rectMaxX - canvasProperties.offset.x) / viewport.zoom - viewport.offset.x;
			rectMaxY = (rectMaxY - canvasProperties.offset.y) / viewport.zoom - viewport.offset.y;

			//console.log(rectMinX, rectMinY, rectMaxX, rectMaxY);
			
			shapes.forEach((shape) => {
				const points = shape.getPoints();
				const minX = Math.min(...points.map((p) => p.x + shape.center.x));
				const maxX = Math.max(...points.map((p) => p.x + shape.center.x));
				const minY = Math.min(...points.map((p) => p.y + shape.center.y));
				const maxY = Math.max(...points.map((p) => p.y + shape.center.y));

				switch(RECTANGULAR_SELECTION_MODE){
					case "containement":
						// logic for shape must be inside rectangle
						if(
							minX >= rectMinX && 
							maxX <= rectMaxX && 
							minY >= rectMinY && 
							maxY <= rectMaxY
						){
							shape.selected = true;
						}
						break;
					case "intersection":
						if(
							minX <= rectMaxX &&
							maxX >= rectMinX &&
							minY <= rectMaxY &&
							maxY >= rectMinY
						){
							shape.selected = true;
						}
						break;
						default:
				};
			});

			rect.remove();
			PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));
			drawShapes(shapes);
		};
	// adding event listeners to the rectangle to allow rectangle redraw when pointer moves into it
	myCanvas.addEventListener('pointermove', moveCallback);
	myCanvas.addEventListener('pointerup', upCallback);
	rect.addEventListener("pointermove", moveCallback);
	rect.addEventListener("pointerup", upCallback);
}
