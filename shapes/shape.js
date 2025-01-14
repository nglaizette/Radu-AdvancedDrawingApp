class Shape{
	constructor(options){
		this.generateId();
		this.options = options;
		this.center = null;
		this.size = null;
		this.selected = false;
	}

	generateId() {
		this.id = Math.floor( 16777216 * Math.random());
	}

	serialize(stageProperties){
		throw new Error("serialize method must be implemented");
	}

	setCenter(center){
		this.center = center;
	}

	setWidth(width){
		throw new Error("setWidth method must be implemented");
	}

	setHeight(height){
		throw new Error("setHeight method must be implemented");
	}

	recenter() {
		const points = this.getPoints();
		this.center = Vector.midVector(points);
		this.size = getSize(points);
		for(const point of points){
			const newPoint=Vector.subtract(point, this.center);
			point.x = newPoint.x;
			point.y = newPoint.y;
		}
		this.setPoints(points);
	}

	drawGizmo(ctx){

		const center = this.center;

		const points = this.getPoints();

		const minX = Math.min(...points.map(p=>p.x));
		const minY = Math.min(...points.map(p=>p.y));
		const maxX = Math.max(...points.map(p=>p.x));
		const maxY = Math.max(...points.map(p=>p.y));

		ctx.save();
		ctx.beginPath();
		ctx.rect(minX +  center.x , minY + center.y, maxX-minX, maxY-minY);
		ctx.strokeStyle = "orange";
		ctx.lineWidth=3;
		ctx.setLineDash([5, 5]);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();
	}

	getHitRGB() {
		const red = (this.id & 0xFF0000) >> 16;
		const green = (this.id & 0x00FF00) >> 8;
		const blue = this.id & 0x0000FF;
		return `rgb(${red}, ${green}, ${blue})`;
	}

	applyHitRegionStyle(ctx, dilation = 10){

		const rgb = this.getHitRGB();
		ctx.lineCap = this.options.lineCap;
		ctx.lineJoin = this.options.lineJoin;

		ctx.fillStyle = rgb;
		ctx.strokeStyle = rgb;
		ctx.lineWidth = this.options.strokeWidth + dilation;
		// pour la sélection des chemins sans remplissage
		//if(this.options.fill){
		ctx.fill();
		//}
		if(this.options.stroke){
			ctx.stroke();
		}
	}

	applyStyle(ctx) {
		ctx.save();
		ctx.strokeStyle = this.options.strokeColor;
		ctx.fillStyle = this.options.fillColor;
		ctx.lineWidth = this.options.strokeWidth;
		ctx.lineCap = this.options.lineCap;
		ctx.lineJoin = this.options.lineJoin;
		if(this.options.fill){
			ctx.fill();
		}
		if(this.options.stroke){
			ctx.stroke();
		}
		ctx.restore();
	}

	getPoints(){
		throw new Error("getPoints method must be implemented");
	}

	setPoints(){
		throw new Error("setPoints method must be implemented");
	}

	draw(ctx){
		throw new Error("draw method must be implemented");
	}
}

function deleteSelectedShapes() {
	let index = shapes.findIndex((s) => s.selected);
	let shouldUpdateHistory = index !== -1;
	while (index !== -1) {
		shapes.splice(index, 1);
		index = shapes.findIndex((s) => s.selected);
	}

	if(shouldUpdateHistory){
		updateHistory(shapes);
	}
	PropertiesPanel.reset();
	drawShapes(shapes);
}

function drawShapes(shapes) {
	ctx.save();
	hitTestingCtx.save();

	clearCanvas();

	hitTestingCtx.clearRect(-canvasProperties.width / 2, -canvasProperties.height / 2, canvasProperties.width, canvasProperties.height);
	ctx.scale(viewport.zoom, viewport.zoom);
	hitTestingCtx.scale(viewport.zoom, viewport.zoom);

	ctx.translate(viewport.offset.x, viewport.offset.y);
	hitTestingCtx.translate(viewport.offset.x, viewport.offset.y);

	drawStage();
	for(const shape of shapes){
		shape.draw(ctx);
	}

	for(const shape of shapes){
		shape.draw(hitTestingCtx, true);
	}

	ctx.restore();
	hitTestingCtx.restore();
}

function selectAll() {
	shapes.forEach((s) => (s.selected = true));
	drawShapes(shapes);
 }

function loadShapes(data){
	const loadShapes = [];
	for(const shapeData of data){
		let shape;
		switch(shapeData.type){
			case "Rect":
				shape = Rect.load(shapeData, stageProperties);
				//shape = new Rect(new Vector(shapeData.x, shapeData.y), new Vector(shapeData.width, shapeData.height));
				break;

			case "Path":
				//shape = new Path(new Vector(shapeData.x, shapeData.y), getOptions());
				//for(const point of shapeData.points){
				//	shape.addPoint(new Vector(point.x, point.y));
				//}
				shape = Path.load(shapeData, stageProperties);
				break;

			case "MyImage":
				shape = MyImage.load(shapeData, stageProperties);
				break;

			case "Oval":
				shape = Oval.load(shapeData, stageProperties);
				break;

			case "Text":
				shape = Text.load(shapeData, stageProperties);
				break;

			default:
				throw new Error("Unknown shape type: " + shapeData.type);
		}
		loadShapes.push(shape);
	}
	return loadShapes;
}

function secondCornerMoveCallback(e, startPosition, currentShape) {
	
	const mousePosition = viewport.getAdjustedPosition(Vector.fromOffsets(e));
	let secondCornerPositon = mousePosition;
	if(e.shiftKey){
		const deltaX = startPosition.x - mousePosition.x;
		const deltaY = startPosition.y - mousePosition.y;
		const sgnX = deltaX < 0 ? -1 : 1;
		const sgnY = deltaY < 0 ? -1 : 1;
		const minDelta = Math.min(Math.abs(deltaX), Math.abs(deltaY));
		secondCornerPositon = new Vector(
			startPosition.x - sgnX * minDelta,
			startPosition.y - sgnY * minDelta
		);
		drawShapes([...shapes, currentShape]);
	} 
	currentShape.setCorner2(secondCornerPositon);
	drawShapes([...shapes, currentShape]);
};

function secondCornerUpCallback(e, currentShape, moveCallback, upCallback) {
	myCanvas.removeEventListener('pointermove', moveCallback);
	myCanvas.removeEventListener('pointerup', upCallback);

	currentShape.recenter();

	if (currentShape.size.width > 0 && currentShape.size.height > 0) {
		shapes.push(currentShape);
		updateHistory(shapes);
	}
};