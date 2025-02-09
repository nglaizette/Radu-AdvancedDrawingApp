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

	addEventListeners(startPosition, handle, selectedShapes) {
		const oldBoxes = selectedShapes.map((s) => 
			BoundingBox.fromPoints(s.getPoints().map((p) => p.add(this.center))));
		let mouseDelta = null;
		let isDragging = false;
		const moveCallback = e => {
			const mousePosition = new Vector(e.offsetX,e.offsetY);
			const diff = Vector.subtract(mousePosition, startPosition);
			mouseDelta = viewport.scale(diff);
			isDragging = true;

			const ratio = new Vector(
				mouseDelta.x / this.box.width,
				mouseDelta.y / this.box.height
			).scale(2)
			.add(new Vector(1, 1));

			for(let i = 0; i < selectedShapes.length; i++) {
				const shape = selectedShapes[i];
				const oldBox = oldBoxes[i];

				switch(handle.type){
					case Handle.RIGHT:
						shape.changeWidth(oldBox.width, ratio.x);
						break;
					case Handle.LEFT:
						shape.changeWidth(oldBox.width, 2 - ratio.x);
						break;
					case Handle.TOP:
						shape.changeHeight(oldBox.height, 2 - ratio.y);
						break;
					case Handle.BOTTOM:
						shape.changeHeight(oldBox.height, ratio.y);
						break;
					case Handle.TOP_LEFT:
						shape.changeSize(
							oldBox.width,
							oldBox.height,
							2 - ratio.x,
							2 - ratio.y);
						break;
					case  Handle.TOP_RIGHT:
						shape.changeSize(
							oldBox.width,
							oldBox.height,
							ratio.x,
							2 - ratio.y
							);
						break;
					case Handle.BOTTOM_LEFT:
						shape.changeSize(
							oldBox.width,
							oldBox.height,
							2 - ratio.x,
							ratio.y
						);
						break;
					case Handle.BOTTOM_RIGHT:
						shape.changeSize(
							oldBox.width,
							oldBox.height,
							ratio.x,
							ratio.y
						);
						break;
				}
			}
			viewport.drawShapes(shapes);
			PropertiesPanel.updateDisplay(selectedShapes);
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
		ctx.rect(
			this.box.topLeft.x,
			this.box.topLeft.y,
			this.box.width,
			this.box.height
		);
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2 / viewport.zoom;
		ctx.stroke();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1 / viewport.zoom;
		ctx.stroke();

		const size = Handle.size / viewport.zoom;

		ctx.beginPath();
		ctx.lineWidth = 2 / viewport.zoom;
		ctx.setLineDash([1, 1]);
		ctx.arc(this.center.x, this.center.y, size / 2.0, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.lineWidth = 1 / viewport.zoom;
		ctx.setLineDash([]);

		for(const handle of this.handles){
			handle.draw(ctx, hitRegion);
		}

		ctx.restore();
	}
}