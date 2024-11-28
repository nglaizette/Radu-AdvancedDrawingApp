function downCallbackForRect(e){
	const mousePosition = new Vector(e.offsetX,e.offsetY);
	currentShape = new Rect(mousePosition, getOptions());

	const moveCallback = function(e){
		const mousePosition = new Vector(e.offsetX,e.offsetY);
		currentShape.setCorner2(mousePosition);
		drawShapes([...shapes, currentShape]);
	};

	const upCallback = function (e) {
		myCanvas.removeEventListener('pointermove', moveCallback);
		myCanvas.removeEventListener('pointerup', upCallback);

		currentShape.recenter();
		shapes.push(currentShape);
	}

	myCanvas.addEventListener('pointermove', moveCallback);
	myCanvas.addEventListener('pointerup', upCallback);
}

function downCallbackForPath (e){
	const mousePosition = new Vector(e.offsetX,e.offsetY);
	currentShape =  new Path(mousePosition,getOptions());

	const moveCallback = function(e){
	const mousePosition = new Vector(e.offsetX,e.offsetY);
		//console.log(mousePosition.x);
		currentShape.addPoint(mousePosition);

		drawShapes([...shapes, currentShape]);
	};

	const upCallback = function (e) {
		myCanvas.removeEventListener('pointermove', moveCallback);
		myCanvas.removeEventListener('pointerup', upCallback);

		currentShape.recenter();
		shapes.push(currentShape);
	}

	myCanvas.addEventListener('pointermove', moveCallback);
	myCanvas.addEventListener('pointerup', upCallback);
}

function downCallbackForSelect (e){
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
		drawShapes([...shapes, currentShape]);

		const moveCallback = function(e){
			const mousePosition = new Vector(e.offsetX,e.offsetY);
			//console.log(mousePosition.x);
			const newPoint= Vector.subtract(mousePosition, startPosition);
			shape.setCenter(Vector.add(oldCenter, newPoint));
			drawShapes(shapes);
	
			//drawShapes([...shapes, currentShape]);
		};
	
		const upCallback = function (e) {
			myCanvas.removeEventListener('pointermove', moveCallback);
			myCanvas.removeEventListener('pointerup', upCallback);
		}
	
		myCanvas.addEventListener('pointermove', moveCallback);
		myCanvas.addEventListener('pointerup', upCallback);
	}
}
