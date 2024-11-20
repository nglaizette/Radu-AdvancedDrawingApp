class Shape{
	constructor(options){
		this.id=Math.floor(16777216*Math.random());
		this.options = options;
	}

	applyHitRegionStyle(ctx){
		const red = (this.id & 0xFF0000) >> 16;
		const green = (this.id & 0x00FF00) >> 8;
		const blue = this.id & 0x0000FF;

		ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
		ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
		ctx.lineWidth = this.options.strokeWidth;
		if(this.options.fill){
			ctx.fill();
		}
		if(this.options.stroke){
			ctx.stroke();
		}
	}

	applyStyle(ctx) {
		ctx.strokeStyle = this.options.strokeColor;
		ctx.fillStyle = this.options.fillColor;
		ctx.lineWidth = this.options.strokeWidth;
		if(this.options.fill){
			ctx.fill();
		}
		if(this.options.stroke){
			ctx.stroke();
		}
	}

	drawHitRegion(ctx){
		throw new Error("draw method must be implemented");
	}

	draw(ctx){
		throw new Error("draw method must be implemented");
	}
}