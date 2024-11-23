class Path extends Shape {
	constructor(startPoint, options){
		super(options);
		this.points = [startPoint];
	}

	addPoint(point){
		this.points.push(point);
	}

	recenter(){
		this.center = averagePoints(this.points);
		for(const point of this.points){
			const newPoint=substractPoints(point, this.center);
			point.x = newPoint.x;
			point.y = newPoint.y;
		}
	}

	drawHitRegion(ctx){
		const center = this.center? this.center:{x:0, y:0}
		ctx.beginPath();
		ctx.moveTo(this.points[0].x +  center.x, this.points[0].y) + center.y;
		for(let i = 1; i < this.points.length; i++){
				ctx.lineTo(this.points[i].x +  center.x, this.points[i].y + center.y);
			}
		this.applyHitRegionStyle(ctx);
	}

	draw(ctx){
		const center = this.center? this.center:{x:0, y:0}
		ctx.beginPath();
		ctx.moveTo(this.points[0].x +  center.x, this.points[0].y + center.y);
		for(let i = 1; i < this.points.length; i++){
				ctx.lineTo(this.points[i].x + center.x, this.points[i].y + center.y);
			}
		this.applyStyle(ctx);

		if(this.selected){
			this.drawGizmo(ctx);
		}
	}

	drawGizmo(ctx){

		const center = this.center? this.center:{x:0, y:0}

		const minX = Math.min(...this.points.map(p=>p.x));
		const minY = Math.min(...this.points.map(p=>p.y));
		const maxX = Math.max(...this.points.map(p=>p.x));
		const maxY = Math.max(...this.points.map(p=>p.y));

		ctx.save();
		ctx.beginPath();
		ctx.rect(minX +  center.x , minY + center.y, maxX-minX, maxY-minY);
		ctx.strokeStyle = "yellow";
		ctx.lineWidth=3;
		ctx.setLineDash([5, 5]);
		ctx.stroke();
		ctx.restore();
	}
}