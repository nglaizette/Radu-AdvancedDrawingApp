class Gizmo {

	constructor(shape){
		this.shape = shape;

		this.center = this.shape.center;
		const points = this.shape.getPoints();
		this.box = BoundingBox.fromPoints(points.map((p) => p.add(this.center)));
		this.handles = [
			new Handle(this.box.topLeft),
			new Handle(this.box.topRight),
			new Handle(this.box.bottomLeft),
			new Handle(this.box.bottomRight),
			new Handle(Vector.midVector([this.box.topLeft, this.box.topRight])),
			new Handle(Vector.midVector([this.box.topRight, this.box.bottomRight])),
			new Handle(Vector.midVector([this.box.bottomRight, this.box.bottomLeft])),
			new Handle(Vector.midVector([this.box.bottomLeft, this.box.topLeft])),
		];
			
	}

	draw(ctx){


		ctx.save();
		ctx.beginPath();
		ctx.rect(this.box.topLeft.x , this.box.topLeft.y, this.box.width, this.box.height);
		ctx.strokeStyle = "back";
		ctx.lineWidth = 1 / viewport.zoom;
		//ctx.setLineDash([5, 5]);
		ctx.stroke();

		const size = Handle.size / viewport.zoom;

		ctx.beginPath();
		ctx.lineWidth = 2 / viewport.zoom;
		ctx.setLineDash([1, 1]);
		ctx.arc(this.center.x, this.center.y, size / 2.0, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.fillStyle="black";

		for(const handle of this.handles){
			handle.draw(ctx);
		}

		ctx.restore();
	}
}