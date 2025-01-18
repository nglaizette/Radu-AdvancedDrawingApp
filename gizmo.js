class Gizmo {
	constructor(shape){
		this.shape = shape;
	}

	draw(ctx){
		const center = this.shape.center;

		const points = this.shape.getPoints();
		const box = BoundingBox.fromPoints(points.map((p) => p.add(center)))

		ctx.save();
		ctx.beginPath();
		ctx.rect(box.topLeft.x , box.topLeft.y, box.width, box.height);
		ctx.strokeStyle = "orange";
		ctx.lineWidth=3;
		ctx.setLineDash([5, 5]);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();
	}
}