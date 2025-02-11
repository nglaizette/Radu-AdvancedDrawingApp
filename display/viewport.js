class Viewport {
	constructor(canvas, hitTestCanvas, stageProperties, showHitRegions) {
		this.canvas = canvas;
		this.hitTestCanvas = hitTestCanvas;
		this.stageProperties = stageProperties;
		this.showHitRegions = showHitRegions;
		this.zoom = 1;
		this.zoomSteps = 0.05;

		if (!showHitRegions) {
			hitTestCanvas.style.display = "none";
		}

		this.stageProperties.left =  -this.stageProperties.width  / 2;
		this.stageProperties.top  =  -this.stageProperties.height / 2;

		this.canvas.width = showHitRegions ? window.innerWidth / 2 : window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.offset = Vector.zero();
		this.center = Vector.zero();
		this.zeroCenterOffset = new Vector(
			this.canvas.width / 2,
			this.canvas.height / 2
		);

		this.hitTestCanvas.width = showHitRegions ? window.innerWidth / 2 : window.innerWidth;
		this.hitTestCanvas.height = window.innerHeight;

		this.ctx = this.canvas.getContext("2d");
		this.hitTestingCtx = this.hitTestCanvas.getContext("2d", {
			willReadFrequently: true,
		});

		this.ctx.translate(
			this.zeroCenterOffset.x,
			this.zeroCenterOffset.y
		);
		this.hitTestingCtx.translate(
			this.zeroCenterOffset.x,
			this.zeroCenterOffset.y
		);

		this.#clearCanvas();
		this.#drawStage();

		this.#addEventListeners();
	}

	scale(vector) {
		return vector.scale(1 / this.zoom);
	}

	getAdjustedPositionOld(e) {
		return new Vector(e.offsetX, e.offsetY)
			.subtract(this.zeroCenterOffset)
			.scale(1 / this.zoom)
			.subtract(this.offset);
	}

	getAdjustedPosition(vector) {
		return vector
			.subtract(this.zeroCenterOffset)
			.scale(1 / this.zoom)
			.subtract(this.offset);
	}

	drawShapes(shapes) {
		gizmos = shapes.filter((s) => s.selected).map((s) => new Gizmo(s));

		this.ctx.save();
		this.hitTestingCtx.save();

		this.#clearCanvas();

		this.hitTestingCtx.clearRect(
			-this.canvas.width / 2,
			-this.canvas.height / 2,
			this.canvas.width,
			this.canvas.height
		);
		this.ctx.scale(this.zoom, this.zoom);
		this.hitTestingCtx.scale(this.zoom, this.zoom);

		this.ctx.translate(this.offset.x, this.offset.y);
		this.hitTestingCtx.translate(this.offset.x, this.offset.y);

		this.#drawStage();
		for (const shape of shapes) {
			shape.draw(this.ctx);
		}

		for (const gizmo of gizmos) {
			gizmo.draw(this.ctx);
		}

		for (const shape of shapes) {
			shape.draw(this.hitTestingCtx, true);
		}

		for (const gizmo of gizmos) {
			gizmo.draw(this.hitTestingCtx, true);
		}

		this.ctx.restore();
		this.hitTestingCtx.restore();
	}

	#clearCanvas() {
		this.ctx.fillStyle = "gray";
		this.ctx.fillRect(
			-myCanvas.width / 2,
			-myCanvas.height / 2,
			myCanvas.width,
			myCanvas.height
		);

		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "right";
		this.ctx.fillText(
			"Contributors: " + contributors.join(", "),
			myCanvas.width / 2 - 10,
			-myCanvas.height / 2 + 10
		);
	}

	#drawStage() {
		this.ctx.save();

		this.ctx.fillStyle = "white";
		this.ctx.fillRect(
			STAGE_PROPERTIES.left,
			STAGE_PROPERTIES.top,
			STAGE_PROPERTIES.width,
			STAGE_PROPERTIES.height
		);

		this.ctx.restore();
	}

	#addEventListeners() {
		this.canvas.addEventListener("wheel", (e) => {
			e.preventDefault();
			const dir = -Math.sign(e.deltaY);
			//console.log(dir);
			this.zoom += dir * this.zoomSteps;
			this.zoom = Math.max(this.zoomSteps, this.zoom);
			this.drawShapes(shapes);
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
					this.drawShapes(shapes);
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
