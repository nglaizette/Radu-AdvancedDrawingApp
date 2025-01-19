class Handle {
	static size = 15;
	static TOP = 0;
	static RIGHT = 1;
	static BOTTOM = 2;
	static LEFT = 3;
	static TOP_LEFT = 4;
	static TOP_RIGHT = 5;
	static BOTTOM_LEFT = 6;
	static BOTTOM_RIGHT = 7;

  	constructor(center, type){
		this.center = center;
		this.id = Shape.generateId();
		this.type = type;
  	}

	draw(ctx, hitRegion ) {
		const size = Handle.size / viewport.zoom;
		ctx.fillStyle = hitRegion ? Shape.getHitRGB(this.id) : "back";
		ctx.fillRect(
			this.center.x - size / 2.0,
			this.center.y - size / 2.0,
			size,
			size
		);
	}
}