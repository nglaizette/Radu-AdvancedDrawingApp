class Shape{
	constructor(options){
		this.id=Math.floor(16777216*Math.random());
		this.options = options;
		this.selected = false;
	}

	recenter() {
		const points = this.getPoints();
		this.center = getMidPoint(points);
		for(const point of points){
			const newPoint=subtractPoints(point, this.center);
			point.x = newPoint.x;
			point.y = newPoint.y;
		}
		this.setPoints(points);
	}

	drawGizmo(ctx){

		const center = this.center? this.center:{x:0, y:0};

		const points = this.getPoints();

		const minX = Math.min(...points.map(p=>p.x));
		const minY = Math.min(...points.map(p=>p.y));
		const maxX = Math.max(...points.map(p=>p.x));
		const maxY = Math.max(...points.map(p=>p.y));

		ctx.save();
		ctx.beginPath();
		ctx.rect(minX +  center.x , minY + center.y, maxX-minX, maxY-minY);
		ctx.strokeStyle = "orange";
		ctx.lineWidth=3;
		ctx.setLineDash([5, 5]);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();
	}

	applyHitRegionStyle(ctx){
		const red = (this.id & 0xFF0000) >> 16;
		const green = (this.id & 0x00FF00) >> 8;
		const blue = this.id & 0x0000FF;

		ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
		ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
		ctx.lineWidth = this.options.strokeWidth + 10;
		if(this.options.fill){
			ctx.fill();
		}
		if(this.options.stroke){
			ctx.stroke();
		}
	}

	applyStyle(ctx) {
		ctx.save();
		ctx.strokeStyle = this.options.strokeColor;
		ctx.fillStyle = this.options.fillColor;
		ctx.lineWidth = this.options.strokeWidth;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		if(this.options.fill){
			ctx.fill();
		}
		if(this.options.stroke){
			ctx.stroke();
		}
		ctx.restore();
	}

	drawHitRegion(ctx){
		throw new Error("draw method must be implemented");
	}

	draw(ctx){
		throw new Error("draw method must be implemented");
	}
}