class Path extends Shape {
	constructor(startPoint, options){
		super(options);
		this.points = [startPoint];
	}

	static load(data){
		const path = new Path();
		path.id = data.id;
		path.options = JSON.parse(JSON.stringify(data.options));
		path.center = Vector.load(data.center);
		path.size = data.size;
		path.selected = data.selected;
		path.points = data.points.map( (p) => Vector.load(p) );
		return path;
	}

	serialize(){
		return {
			type: 'Path',
			id: this.id,
			options: JSON.parse(JSON.stringify(this.options)),
			center: this.center,
			size: this.size,
			selected: this.selected,
			points: this.points,
		};
	}

	addPoint(point){
		this.points.push(point);
	}

	getPoints(){
		return this.points;
	}

	setPoints(points){
		this.points = points;
	}

	setWidth(width){
		const size = getSize(this.points);
		const flip = Math.sign(width) !== Math.sign(this.size.width) ? -1 : 1;
		const eps = 0.0001;
		if (size.width == 0) {
		   console.error("Size 0 problem!");
		}
		const _width = size.width == 0 ? eps : size.width;
		const ratio = (flip * Math.abs(width)) / _width;
		for(const point of this.points){
			point.x *= ratio;
		}
		this.size.width = width ;
	}

	setHeight(height){
		const size = getSize(this.points);
		const flip = Math.sign(height) !== Math.sign(this.size.height) ? -1 : 1;
		const eps = 0.0001;
		if (size.height == 0) {
		   console.error("Size 0 problem!");
		}
		const _height = size.height == 0 ? eps : size.height;
		const ratio = (flip * Math.abs(height)) / _height;
		for(const point of this.points){
			point.y *= ratio;
		}
		this.size.height = height ;
	}

	draw(ctx, isHitRegion=false){
		const center = this.center? this.center:{x:0, y:0}
		ctx.beginPath();
		ctx.moveTo(this.points[0].x +  center.x, this.points[0].y + center.y);
		for(let i = 1; i < this.points.length; i++){
				ctx.lineTo(this.points[i].x + center.x, this.points[i].y + center.y);
			}

		if(isHitRegion){
			this.applyHitRegionStyle(ctx);
		} else {
			this.applyStyle(ctx);
		}
	}
}