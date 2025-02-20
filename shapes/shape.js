class Shape{
	constructor(options){
		this.id = Shape.generateId();
		this.options = options;
		this.center = null;
		this.size = null;
		this.selected = false;
	}

	static generateId() {
		return Math.floor( 16777216 * Math.random());
	}

	serialize(){
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

	setSize(width, height){
		this.setHeight(height);
		this.setWidth(width);
	}

	changeWidth(width, ratio) {
		this.setWidth(width * ratio);
	}

	changeHeight(height, ratio) {
		this.setHeight(height * ratio);
	}

	changeSize(width, height, ratioWidth, ratioHeight) {
		this.setSize(width * ratioWidth, height * ratioHeight);
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

	/*drawGizmo(ctx){

		const center = this.center;

		const points = this.getPoints();
		const box = BoundingBox.fromPoints(points.map((p) => p.add(center)))

		ctx.save();
		ctx.beginPath();
		ctx.rect(box.topLeft.x , box.topLeft.y, box.width, box.height);
		ctx.strokeStyle = "orange";
		ctx.lineWidth=3;
		ctx.setLineDash([5, 5]);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();
	}*/

	static getHitRGB(id) {
		const red = (id & 0xFF0000) >> 16;
		const green = (id & 0x00FF00) >> 8;
		const blue = id & 0x0000FF;
		return `rgb(${red}, ${green}, ${blue})`;
	}

	applyHitRegionStyle(ctx, dilation = 10){

		const rgb = Shape.getHitRGB(this.id);
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
		viewport.drawShapes([...shapes, currentShape]);
	} 
	currentShape.setCorner2(secondCornerPositon);
	viewport.drawShapes([...shapes, currentShape]);
};

function secondCornerUpCallback(e, currentShape, moveCallback, upCallback) {
	viewport.canvas.removeEventListener('pointermove', moveCallback);
	viewport.canvas.removeEventListener('pointerup', upCallback);

	currentShape.recenter();

	if (currentShape.size.width > 0 && currentShape.size.height > 0) {
		shapes.push(currentShape);
		HistoryTools.record(shapes);
	}
};