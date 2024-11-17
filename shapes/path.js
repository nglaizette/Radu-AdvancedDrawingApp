class Path extends Shape {
	constructor(startPoint, options){
		super();
		this.points = [startPoint];
		this.options =  options
	}

	addPoint(point){
		this.points.push(point);
	}

	draw(ctx){
		ctx.beginPath();
		ctx.strokeStyle = this.options.strokeColor;
		ctx.lineWidth = 5;
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for(let i = 1; i < this.points.length; i++){
				ctx.lineTo(this.points[i].x, this.points[i].y);
			}
		ctx.stroke();
	}
}