class Path extends Shape {
	constructor(startPoint, options){
		super(options);
		this.points = [startPoint];
	}

	addPoint(point){
		this.points.push(point);
	}

	draw(ctx){
		ctx.beginPath();
		this.initStyle();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for(let i = 1; i < this.points.length; i++){
				ctx.lineTo(this.points[i].x, this.points[i].y);
			}
		this.applyStyle();
	}
}