class Rect extends Shape {
	constructor(corner1, options){
		super(options);
		this.corner1 =  corner1;
		this.corner2 =  corner1;
	}

	setCorner2(corner2){
		this.corner2 = corner2;
	}

	drawHitRegion(ctx){
		ctx.beginPath();
		const minX = Math.min(this.corner1.x, this.corner2.x);
		const minY = Math.min(this.corner1.y, this.corner2.y);
		const width = Math.abs(this.corner1.x - this.corner2.x);
		const height = Math.abs(this.corner1.y - this.corner2.y);
		ctx.rect(minX, minY, width, height);
		this.applyHitRegionStyle(ctx);
	}

	draw(ctx){
		ctx.beginPath();
		const minX = Math.min(this.corner1.x, this.corner2.x);
		const minY = Math.min(this.corner1.y, this.corner2.y);
		const width = Math.abs(this.corner1.x - this.corner2.x);
		const height = Math.abs(this.corner1.y - this.corner2.y);
		ctx.rect(minX, minY, width, height);
		this.applyStyle(ctx);

		if(this.selected){
			this.drawGizmo(ctx);
		}
	}

	drawGizmo(ctx){
		ctx.beginPath();
		const minX = Math.min(this.corner1.x, this.corner2.x);
		const minY = Math.min(this.corner1.y, this.corner2.y);
		const width = Math.abs(this.corner1.x - this.corner2.x);
		const height = Math.abs(this.corner1.y - this.corner2.y);
		ctx.rect(minX, minY, width, height);
		ctx.strokeStyle = "yellow";
		ctx.lineWidth=3;
		ctx.setLineDash([5, 5]);
		ctx.stroke();
	}
}