class Shape{
	constructor(options){
		// never deliberately called
		this.id = Shape.generateId();
		this.center = null;
		this.size = null;
		this.options = options;
		this.rotation = 0;
		this.selected = false;
	}

	static generateId() {
		return Math.floor( 16777216 * Math.random());
	}

	serialize(){
		throw new Error("serialize method must be implemented");
	}

	select(save = true) {
		this.selected = true;
		viewport.dispatchEvent(
			new CustomEvent("shapeSelected", {
				detail: {shape: this, save},
			})
		);
	}

	unselect(save = true ){
		this.selected = false;
		viewport.dispatchEvent(
			new CustomEvent("shapeUnselected", {
				detail: { shape: this, save},
			})
		);
	}

	setCenter(center, save = true){
		this.center = center;
		viewport.dispatchEvent(
			new CustomEvent("positionChanged", {
				detail: {shape: this, postion: center, save},
			})
		);
	}

	setSize(width, height, save = true){
		this._setWidth(width);
		this._setHeight(height);
		viewport.dispatchEvent(
			new CustomEvent("sizeChanged", {
				detail: { shape: this, size: {width, height}, save},
			})
		)
	}

	_setWidth(width){
		throw new Error("setWidth method must be implemented");
	}

	_setHeight(height){
		throw new Error("setHeight method must be implemented");
	}

	setRotation(angle, save = true){
		this.rotation = angle;
		viewport.dispatchEvent(
			new CustomEvent("rotationChanged", {
				detail: {sahpe: this, rotation: angle, save},
			})
		)
	}

	setOptions(options, save = true){
		for(const key in options){
			if (this.options.hawOwnProperty(key)) {
				this.options[key] = options[key];
			}
		}
		viewport.dispatchEvent(
			new CustomEvent("optionsChanged", {derail: {shape: this, save}})
		)
	}

	changeSize(prevWidth, prevHeight, ratioWidth, ratioHeight) {
		this.setSize(prevWidth * ratioWidth, prevHeight * ratioHeight, false);
	}

	recenter(){
		const points = this.getPoints();
		this.center = Vector.mid(points);
		this.size = getSize(points);
		for(const point of points){
			const newPoint = Vector.subtract(point, this.center);
			point.x = newPoint.x;
			point.y = newPoint.y;
		}
		this.setPoints(points);
	}

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
		// always doing a fill because of the poll during the live stream
		// most people seem to prefer selecting an object with no fill, when clicking on it
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

	drawHitRegion(ctx) {
		throw new Error("drawhitregion must be implemented");
	}

	draw(ctx){
		throw new Error("draw method must be implemented");
	}
}
/*
function secondCornerMoveCallback(e, startPosition, currentShape) {
	
	const mousePosition = viewport.getAdjustedPosition(Vector.fromOffsets(e));
	let secondCornerPositon = mousePosition;
	if(e.shiftKey){
		const deltaX = startPosition.x - mousePosition.x;
		const deltaY = startPosition.y - mousePosition.y;
		const minDelta = Math.min(Math.abs(deltaX), Math.abs(deltaY));
		secondCornerPositon = new Vector(
			startPosition.x - Math.sign(deltaX) * minDelta,
			startPosition.y - Math.sign(deltaY) * minDelta
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
};*/