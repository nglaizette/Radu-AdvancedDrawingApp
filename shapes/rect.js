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

	setCenter(center){
		this.center = center;
	}

	drawHitRegion(ctx){
		const center = this.center? this.center:{x:0, y:0}
		ctx.beginPath();
		const minX = Math.min(this.corner1.x, this.corner2.x);
		const minY = Math.min(this.corner1.y, this.corner2.y);
		const width = Math.abs(this.corner1.x - this.corner2.x);
		const height = Math.abs(this.corner1.y - this.corner2.y);
		ctx.rect(minX + center.x, minY + center.y , width, height);
		this.applyHitRegionStyle(ctx);
	}

	draw(ctx){
		const center = this.center? this.center:{x:0, y:0}
		ctx.beginPath();
		const minX = Math.min(this.corner1.x, this.corner2.x);
		const minY = Math.min(this.corner1.y, this.corner2.y);
		const width = Math.abs(this.corner1.x - this.corner2.x);
		const height = Math.abs(this.corner1.y - this.corner2.y);
		ctx.rect(minX +  center.x , minY + center.y , width, height);
		this.applyStyle(ctx);

		if(this.selected){
			this.drawGizmo(ctx);
		}
	}
}