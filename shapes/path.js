class Path{
	constructor(startPoint){
		this.points = [startPoint];
	}

	addPoint(point){
		this.points.push(point);
	}

	draw(ctx){
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		ctx.lineWidth = 5;
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for(let i = 1; i < this.points.length; i++){
				ctx.lineTo(this.points[i].x, this.points[i].y);
			}
		ctx.stroke();
	}
}