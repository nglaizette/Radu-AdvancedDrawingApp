class BoundingBox {
	constructor(topLeft, bottomRight){
		this.topLeft = topLeft;
		this.bottomRight = bottomRight;
	}

	static fromPoints(points){
		const topLeft = Vector.topLeft(points);
		const bottomRight = Vector.multiMax(points);
		return new BoundingBox(topLeft, bottomRight);
	}

	contains(box) {
		return this.topLeft.x <= box.topLeft.x &&
			   this.topLeft.y <= box.topLeft.y &&
			   this.bottomRight.x >= box.bottomRight.x &&
			   this.bottomRight.y >= bottomRight.y;
	}

	intersect(box) {
		return this.topLeft.x <= box.bottomRight.x &&
			   this.bottomRight.x >= box.topLeft.x &&
			   this.topLeft.y <= box.bottomRight.y &&
			   this.bottomRight.y >= box.topLeft.y;
	}
}