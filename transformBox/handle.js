class Handle {
	static size = 15;

  	constructor(center){
		this.center = center;
  	}

	draw(ctx){
		ctx.fillRect(
			this.center.x - Handle.size / 2.0,
			this.center.y - Handle.size / 2.0,
			Handle.size,
			Handle.size
		);
	}
}