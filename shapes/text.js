class Text extends Shape {
	constructor(corner1, options){
		super(options);

		// Todo: take out corner1 and corner2 to the
		// Drawing tool itself (it will need its own object)
		this.corner1 =  corner1;
		this.corner2 =  corner1;
	}

	static load(data, stageProperties){
		const text = new Text();
		text.id = data.id;
		text.options = JSON.parse(JSON.stringify(data.options));
		text.center = new Vector(
			data.center.x + stageProperties.left,
			data.center.y + stageProperties.top
		);
		text.size = data.size;
		text.selected = data.selected;
		return text;
	}

	serialize(stageProperties){
		return {
			type: 'Text',
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
		ctx.rect(left, top , width, height);

		if(isHitRegion){
			this.applyHitRegionStyle(ctx);
		} else {
			this.applyStyle(ctx);
			if(this.selected){
				this.drawGizmo(ctx);
			}
		}
	}

	static addPointerDownListener(e){
		const mousePosition = new Vector(e.offsetX,e.offsetY);
		currentShape = new Text(mousePosition, getOptions());
	
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

			updateHistory(shapes);
		}
	
		myCanvas.addEventListener('pointermove', moveCallback);
		myCanvas.addEventListener('pointerup', upCallback);
	}
}