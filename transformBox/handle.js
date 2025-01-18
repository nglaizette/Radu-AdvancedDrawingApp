class Handle {
	static size = 15;

  	constructor(center){
		this.center = center;
		this.id = Shape.generateId();
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