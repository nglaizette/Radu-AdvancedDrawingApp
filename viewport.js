class Viewport {
	constructor(canvas, hitTestCanvas) {
		this.canvas = canvas;
		this.hitTestCanvas = hitTestCanvas;
		this.zoom = 1;
		this.offset = Vector.zero();
		this.zoomSteps = 0.05;

		this.#addEventListeners();
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