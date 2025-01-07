class Viewport {
	constructor(canvas, hitTestCanvas, canevasProperties, stageProperties) {
		this.canvas = canvas;
		this.hitTestCanvas = hitTestCanvas;
		this.canevasProperties = canevasProperties;
		this.stageProperties = stageProperties;
		this.zoom = 1;
		this.offset = Vector.zero();
		this.zoomSteps = 0.05;

		this.#addEventListeners();
	}

	getMousePosition(e) {
		return new Vector(e.offsetX, e.offsetY)
			.subtract(this.canevasProperties.offset)
			.scale(1 / this.zoom)
			.subtract(this.offset);
	}

	#addEventListeners() {
		this.canvas.addEventListener("wheel", (e) => {
			
			e.preventDefault();
			const dir = -Math.sign(e.deltaY);
			console.log(dir);
			this.zoom += dir * this.zoomSteps;
			this.zoom = Math.max(this.zoomSteps, this.zoom);
			drawShapes(shapes);
		});

		this.canvas.addEventListener("pointerdown", (e) => {
			if (e.button === 1) {
				let dragStart = new Vector(e.offsetX, e.offsetY);
				const moveCallback = (e) => {
					const dragEnd = new Vector(e.offsetX, e.offsetY);
					const diff = Vector.subtract(dragEnd, dragStart);
					const scaleDiff = diff.scale(1 / this.zoom);
					this.offset = Vector.add(this.offset, scaleDiff);
					dragStart = dragEnd;
					drawShapes(shapes);
				};

				const upCallback = (e) => {
					myCanvas.removeEventListener("pointermove", moveCallback);
					myCanvas.removeEventListener("pointerup", upCallback);
				};

				this.canvas.addEventListener("pointermove", moveCallback);
				this.canvas.addEventListener("pointerup", upCallback);
			}
		});
	}
}