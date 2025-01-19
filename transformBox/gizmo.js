class Gizmo {

	constructor(shape){
		this.shape = shape;

		this.center = this.shape.center;
		const points = this.shape.getPoints();
		this.box = BoundingBox.fromPoints(points.map((p) => p.add(this.center)));
		this.handles = [
			new Handle(this.box.topLeft, Handle.TOP_LEFT),
			new Handle(this.box.topRight, Handle.TOP_RIGHT),
			new Handle(this.box.bottomLeft, Handle.BOTTOM_LEFT),
			new Handle(this.box.bottomRight, Handle.BOTTOM_RIGHT),
			new Handle(Vector.midVector([this.box.topLeft, this.box.topRight]), Handle.TOP),
			new Handle(Vector.midVector([this.box.topRight, this.box.bottomRight]), Handle.RIGHT),
			new Handle(Vector.midVector([this.box.bottomRight, this.box.bottomLeft]), Handle.BOTTOM),
			new Handle(Vector.midVector([this.box.bottomLeft, this.box.topLeft]), Handle.LEFT),
		];
			
	}

	hasHandle(id) {
		return this.handles.find((handle) => handle.id === id);
	}

	addEventListeners(startPosition, handle) {
		const oldCenter = handle.center;
		let mouseDelta = null;
		let isDragging = false;
		const moveCallback = e => {
			const mousePosition = new Vector(e.offsetX,e.offsetY);
			const diff = Vector.subtract(mousePosition, startPosition);
			mouseDelta = viewport.scale(diff);
			isDragging = true;

			switch(handle.type){
				case Handle.RIGHT:
					this.shape.setWidth(this.box.width + 2 * mouseDelta.x);
					break;
				case Handle.LEFT:
					this.shape.setWidth(this.box.width - 2 * mouseDelta.x);
					break;
				case Handle.TOP:
					this.shape.setHeight(this.box.height - 2 * mouseDelta.y);
					break;
				case Handle.BOTTOM:
					this.shape.setHeight(this.box.height + 2 * mouseDelta.y);
					break;
				case Handle.TOP_LEFT:
					this.shape.setSize(
						this.box.width - 2 * mouseDelta.x,
						this.box.height - 2 * mouseDelta.y);
					break;
				case  Handle.TOP_RIGHT:
					this.shape.setSize(
						this.box.width + 2 * mouseDelta.x,
						this.box.height - 2 * mouseDelta.y
						);
					break;
				case Handle.BOTTOM_LEFT:
					this.shape.setSize(
						this.box.width - 2 * mouseDelta.x,
						this.box.height + 2 * mouseDelta.y
						);
					break;
				case Handle.BOTTOM_RIGHT:
					this.shape.setSize(
						this.box.width + 2 * mouseDelta.x,
						this.box.height + 2 * mouseDelta.y
						);
					break;
			}
			drawShapes(shapes);
		};
	
		const upCallback = e => {
			myCanvas.removeEventListener('pointermove', moveCallback);
			myCanvas.removeEventListener('pointerup', upCallback);	
		}
	
		myCanvas.addEventListener('pointermove', moveCallback);
		myCanvas.addEventListener('pointerup', upCallback);
	}

	draw(ctx, hitRegion = false){

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
			handle.draw(ctx, hitRegion);
		}

		ctx.restore();
	}
}