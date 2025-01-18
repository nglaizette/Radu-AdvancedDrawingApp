class Oval extends Shape {
	constructor(corner1, options){
		super(options);

		// Todo: take out corner1 and corner2 to the
		// Drawing tool itself (it will need its own object)
		this.corner1 =  corner1;
		this.corner2 =  corner1;
	}

	static load(data, stageProperties){
		const oval = new Oval();
		oval.id = data.id;
		oval.options = JSON.parse(JSON.stringify(data.options));
		oval.center = new Vector(
			data.center.x + stageProperties.left,
			data.center.y + stageProperties.top
		);
		oval.size = data.size;
		oval.selected = data.selected;
		return oval;
	}

	serialize(stageProperties){
		return {
			type: 'Oval',
			id: this.id,
			options: JSON.parse(JSON.stringify(this.options)),
			center: new Vector(
				this.center.x - stageProperties.left,
				this.center.y - stageProperties.top
			),
			size: this.size,
			selected: this.selected
		};
	}

	setCorner2(corner2){
		this.corner2 = corner2;
	}

	getPoints() {
		if(this.size){
			return [
				new Vector( -this.size.width/2,  -this.size.height/2),
				new Vector( -this.size.width/2,  this.size.height/2),
				new Vector(  this.size.width/2,  this.size.height/2),
				new Vector(  this.size.width/2, -this.size.height/2),
			]
		}
		return [
			this.corner1,
			this.corner2
		];
	}

	setPoints(points) {
		//this.corner1 = points[0];
		//this.corner2 = points[1];
	}

	setWidth(width){
		this.size.width = width;
	}

	setHeight(height){
		this.size.height = height;
	}

	draw(ctx, isHitRegion = false){
		const center = this.center? this.center:{x:0, y:0}
		let left, top, width, height;
		if(this.size) {
			left = center.x - this.size.width / 2;
			top = center.y - this.size.height / 2;
			width = this.size.width;
			height = this.size.height;
		} else {
			const minX = Math.min(this.corner1.x, this.corner2.x);
			const minY = Math.min(this.corner1.y, this.corner2.y);
			width = Math.abs(this.corner1.x - this.corner2.x);
			height = Math.abs(this.corner1.y - this.corner2.y);
			left = minX +  center.x;
			top = minY + center.y;
		}
		ctx.beginPath();
		const radius1 = width / 2;
		const radius2 = height / 2;
		ctx.ellipse(left + width /2 , top + height / 2, radius1, radius2, 0, 0, 2 * Math.PI);

		if(isHitRegion){
			this.applyHitRegionStyle(ctx);
		} else {
			this.applyStyle(ctx);
		}
	}

	static addPointerDownListener(e){
		if(e.button !== 0) return;

		const startPosition = viewport.getAdjustedPosition(Vector.fromOffsets(e));

		currentShape = new Oval(startPosition, getOptions());
		const moveCallback = (e) => {
			secondCornerMoveCallback(e, startPosition, currentShape);
		 };
		 const upCallback = (e) => {
			secondCornerUpCallback(e, currentShape, moveCallback, upCallback);
		 };
		 myCanvas.addEventListener("pointermove", moveCallback);
		 myCanvas.addEventListener("pointerup", upCallback);
	}
}