class Oval extends Shape {
	constructor(center, size, options){
		super(options);

		this.center = center;
		this.size = size;
		this.options = options;

		this.rotation = 0;
	}

	static load (data){
		const oval = new Oval();
		oval.id = data.id;
		oval.center = Vector.load(data.center);
		oval.size = data.size;
		oval.options = JSON.parse(JSON.stringify(data.options));
		oval.rotation = data.rotation??0;
		oval.selected = data.selected;
		return oval;
	}

	serialize(){
		return {
			type: 'Oval',
			id: this.id,
			center:this.center,
			size:  JSON.parse(JSON.stringify(this.size)),
			options: JSON.parse(JSON.stringify(this.options)),
			rotation: this.rotation,
			selected: this.selected,
		};
	}

	getPoints() {
		if(this.size){
			return [
				new Vector( -this.size.width/2,  -this.size.height/2),
				new Vector( -this.size.width/2,  this.size.height/2),
				new Vector(  this.size.width/2,  this.size.height/2),
				new Vector(  this.size.width/2, -this.size.height/2),
			]
		}
		return [
			this.corner1,
			this.corner2
		];
	}

	_setWidth(width){
		this.size.width = width;
	}

	_setHeight(height){
		this.size.height = height;
	}

	draw(ctx, isHitRegion = false){
		const center = this.center? this.center:{x:0, y:0}
		let left, top, width, height;
		if(this.size) {
			left = center.x - this.size.width / 2;
			top = center.y - this.size.height / 2;
			width = this.size.width;
			height = this.size.height;
		} else {
			const minX = Math.min(this.corner1.x, this.corner2.x);
			const minY = Math.min(this.corner1.y, this.corner2.y);
			width = Math.abs(this.corner1.x - this.corner2.x);
			height = Math.abs(this.corner1.y - this.corner2.y);
			left = minX +  center.x;
			top = minY + center.y;
		}
		ctx.beginPath();
		const radius1 = Math.abs(width / 2);
		const radius2 = Math.abs(height / 2);
		ctx.ellipse(left + width /2 , top + height / 2, radius1, radius2, 0, 0, 2 * Math.PI);

		if(isHitRegion){
			this.applyHitRegionStyle(ctx);
		} else {
			this.applyStyle(ctx);
		}
	}
}

ShapeFactory.registerShape(Oval, "Oval");