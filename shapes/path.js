class Path extends Shape {
	constructor(startPoint, options){
		super(options);
		this.points = [startPoint];
	}

	addPoint(point){
		this.points.push(point);
	}

	drawHitRegion(ctx){
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for(let i = 1; i < this.points.length; i++){
				ctx.lineTo(this.points[i].x, this.points[i].y);
			}
		this.applyHitRegionStyle(ctx);
	}

	draw(ctx){
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for(let i = 1; i < this.points.length; i++){
				ctx.lineTo(this.points[i].x, this.points[i].y);
			}
		this.applyStyle(ctx);

		if(this.selected){
			this.drawGizmo(ctx);
		}
	}

	drawGizmo(ctx){
		const minX = Math.min(...this.points.map(p=>p.x));
		const minY = Math.min(...this.points.map(p=>p.y));
		const maxX = Math.max(...this.points.map(p=>p.x));
		const maxY = Math.max(...this.points.map(p=>p.y));

		ctx.beginPath();
		ctx.rect(minX, minY, maxX-minX, maxY-minY);
		ctx.strokeStyle = "yellow";
		ctx.lineWidth=3;
		ctx.setLineDash([5, 5]);
		ctx.stroke();
	}
}