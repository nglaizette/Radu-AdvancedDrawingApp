class Shape{
	constructor(options){
		this.options = options;
	}

	initStyle() {
		ctx.strokeStyle = this.options.strokeColor;
		ctx.fillStyle = this.options.fillColor;
		ctx.lineWidth = this.options.strokeWidth;
	}

	applyStyle() {
		if(this.options.fill){
			ctx.fill();
		}
		if(this.options.stroke){
			ctx.stroke();
		}
	}

	draw(ctx){
		throw new Error("draw method must be implemented");
	}
}