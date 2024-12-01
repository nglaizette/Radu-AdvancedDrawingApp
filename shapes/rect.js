class Rect extends Shape {
	constructor(corner1, options){
		super(options);
		this.corner1 =  corner1;
		this.corner2 =  corner1;
	}

	setCorner2(corner2){
		this.corner2 = corner2;
	}

	getPoints() {
		return [this.corner1, this.corner2];
	}

	setPoints(points) {
		this.corner1 = points[0];
		this.corner2 = points[1];
	}

	draw(ctx, isHitRegion = false){
		const center = this.center? this.center:{x:0, y:0}
		ctx.beginPath();
		const minX = Math.min(this.corner1.x, this.corner2.x);
		const minY = Math.min(this.corner1.y, this.corner2.y);
		const width = Math.abs(this.corner1.x - this.corner2.x);
		const height = Math.abs(this.corner1.y - this.corner2.y);
		ctx.rect(minX +  center.x , minY + center.y , width, height);
		
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
}