class Viewport {
	constructor(canvas, hitTestCanvas, stageProperties, showHitRegions) {
		this.canvas = canvas;
		this.hitTestCanvas = hitTestCanvas;
		this.stageProperties = stageProperties;
		this.showHitRegions = showHitRegions;
		this.zoom = 1;
		this.offset = Vector.zero();
		this.zoomSteps = 0.05;

		if (!showHitRegions) {
			hitTestCanvas.style.display = "none";
		}

		this.canvasProperties = {
			width: showHitRegions ? window.innerWidth / 2 : window.innerWidth,
			height: window.innerHeight,
			center: Vector.zero(),
		};
		this.canvasProperties.offset = new Vector(
			this.canvasProperties.width / 2,
			this.canvasProperties.height / 2
		);

		this.stageProperties.left =  -this.stageProperties.width  / 2;
		this.stageProperties.top  =  -this.stageProperties.height / 2;

		this.canvas.width = this.canvasProperties.width;
		this.canvas.height = this.canvasProperties.height;
		this.hitTestCanvas.width = this.canvasProperties.width;
		this.hitTestCanvas.height = this.canvasProperties.height;

		this.#clearCanvas();
		this.#drawStage();

		this.#addEventListeners();
	}

	scale(vector) {
		return vector.scale(1 / this.zoom);
	}

	getAdjustedPositionOld(e) {
		return new Vector(e.offsetX, e.offsetY)
			.subtract(this.canvasProperties.offset)
			.scale(1 / this.zoom)
			.subtract(this.offset);
	}

	getAdjustedPosition(vector) {
		return vector
			.subtract(this.canvasProperties.offset)
			.scale(1 / this.zoom)
			.subtract(this.offset);
	}

	drawShapes(shapes) {
		gizmos = shapes.filter((s) => s.selected).map((s) => new Gizmo(s));

		ctx.save();
		hitTestingCtx.save();

		this.#clearCanvas();

		hitTestingCtx.clearRect(
			-this.canvasProperties.width / 2,
			-this.canvasProperties.height / 2,
			this.canvasProperties.width,
			this.canvasProperties.height
		);
		ctx.scale(viewport.zoom, viewport.zoom);
		hitTestingCtx.scale(viewport.zoom, viewport.zoom);

		ctx.translate(viewport.offset.x, viewport.offset.y);
		hitTestingCtx.translate(viewport.offset.x, viewport.offset.y);

		this.#drawStage();
		for (const shape of shapes) {
			shape.draw(ctx);
		}

		for (const gizmo of gizmos) {
			gizmo.draw(ctx);
		}

		for (const shape of shapes) {
			shape.draw(hitTestingCtx, true);
		}

		for (const gizmo of gizmos) {
			gizmo.draw(hitTestingCtx, true);
		}

		ctx.restore();
		hitTestingCtx.restore();
	}

	#clearCanvas() {
		ctx.fillStyle = "gray";
		ctx.fillRect(
			-myCanvas.width / 2,
			-myCanvas.height / 2,
			myCanvas.width,
			myCanvas.height
		);

		ctx.fillStyle = "white";
		ctx.textAlign = "right";
		ctx.fillText(
			"Contributors: " + contributors.join(", "),
			myCanvas.width / 2 - 10,
			-myCanvas.height / 2 + 10
		);
	}

	#drawStage() {
		ctx.save();

		ctx.fillStyle = "white";
		ctx.fillRect(
			stageProperties.left,
			stageProperties.top,
			stageProperties.width,
			stageProperties.height
		);

		ctx.restore();
	}

	#addEventListeners() {
		this.canvas.addEventListener("wheel", (e) => {
			e.preventDefault();
			const dir = -Math.sign(e.deltaY);
			//console.log(dir);
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
