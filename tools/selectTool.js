class SelectTool {
	static addPointerDownListener(e) {
		// downCallbackForSelect
		if (e.button !== 0) return;

		//PropertiesPanel.reset();
		const startPosition = new Vector(e.offsetX, e.offsetY);

		const [r, g, b, a] = viewport.hitTestLayer.ctx.getImageData(
			startPosition.x,
			startPosition.y,
			1,
			1
		).data;
		//console.log(r, g, b, a);
		const id = (r << 16) | (g << 8) | b;
		//console.log(id);
		const gizmo = viewport.gizmos.find((g) => g.hasHandle(id));
		console.log(r,g,b,a, id,gizmo);

		if (gizmo) {
			const handle = gizmo.hasHandle(id);
			const selectedShapes = viewport.getSelectedShapes();
			gizmo.addEventListeners(startPosition, handle, selectedShapes);
			return;
		}

		const shape = viewport.shapes.find((s) => s.id == id);

		let isClickingSelectedShape = shape && shape.selected;

		if (!isClickingSelectedShape) {
			if (e.ctrlKey === false && e.shiftKey === false) {
				viewport.shapes.forEach((s) => (s.unselect(false)));
			}
		}

		if (shape) {
			if (!isClickingSelectedShape) {
				shape.select();
			}
			const selectedShapes = viewport.getSelectedShapes();
			const oldCenters = selectedShapes.map((s) => s.center);
			let mouseDelta = null;
			let isDragging = false;

			const moveCallback = function (e) {
				const mousePosition = new Vector(e.offsetX, e.offsetY);
				const diff = Vector.subtract(mousePosition, startPosition);
				mouseDelta = viewport.scale(diff);

				/*if(e.altKey){
					mouseDelta.x = Math.round(mouseDelta.x / 10) * 10;
					mouseDelta.y = Math.round(mouseDelta.y / 10) * 10;
				}*/
				//console.log(mousePosition.x);

				isDragging = true;

				selectedShapes.forEach((s, i) => {
					s.setCenter(Vector.add(oldCenters[i], mouseDelta), false);
				});
			};

			const upCallback = function (e) {
				viewport.getStageCanvas().removeEventListener("pointermove", moveCallback);
				viewport.getStageCanvas().removeEventListener("pointerup", upCallback);

				if (isClickingSelectedShape && !isDragging) {
					shape.unselect();
				}

				if (!isDragging && mouseDelta?.magnitude() > 0) {
					selectedShapes.forEach((s, i) => {
						s.setCenter(Vector.add(oldCenters[i], mouseDelta));
					});
				}
			};

			viewport.getStageCanvas().addEventListener("pointermove", moveCallback);
			viewport.getStageCanvas().addEventListener("pointerup", upCallback);
		} else {
			SelectTool.selectShapeUnderRectangle(e);
		}
	}

	static selectShapeUnderRectangle(e) {
		const startPosition = new Vector(e.clientX, e.clientY);

		let rect = document.createElement("div");
		rect.style.position = "fixed";
		rect.style.backgroundColor = "transparent";
		rect.style.border = "1px dotted";
		rect.style.pointerEvents = "none";
		const htmlBody = document.querySelector("body");
		htmlBody.appendChild(rect);

		let topLeft = Vector.zero();
		let bottomRight = Vector.zero();

		const moveCallback = function (e) {
			const mousePosition = new Vector(e.clientX, e.clientY);

			topLeft = Vector.min(startPosition, mousePosition);
			bottomRight = Vector.max(startPosition, mousePosition);

			const offset = bottomRight.subtract(topLeft);

			rect.style.left = `${topLeft.x}px`;
			rect.style.top = `${topLeft.y}px`;
			rect.style.width = `${offset.x}px`;
			rect.style.height = `${offset.y}px`;
		};

		const upCallback = function (e) {
			viewport.getStageCanvas().removeEventListener("pointermove", moveCallback);
			viewport.getStageCanvas().removeEventListener("pointerup", upCallback);
			rect.removeEventListener("pointerup", upCallback);
			rect.removeEventListener("pointermove", moveCallback);

			const rectBox = new BoundingBox(
				viewport.getAdjustedPosition(topLeft),
				viewport.getAdjustedPosition(bottomRight)
			);

			viewport.shapes.forEach((shape) => {
				const shapeBox = BoundingBox.fromPoints(
					shape.getPoints().map((p) => p.add(shape.center))
				);

				switch (RECTANGULAR_SELECTION_MODE) {
					case "containement":
						// logic for shape must be inside rectangle
						if (rectBox.contains(shapeBox)) {
							shape.select();
						}
						break;
					case "intersection":
						if (rectBox.intersect(shapeBox)) {
							shape.select();
						}
						break;
					default:
						break;
				}
			});

			rect.remove();
		};
		// adding event listeners to the rectangle to allow rectangle redraw when pointer moves into it
		viewport.getStageCanvas().addEventListener("pointermove", moveCallback);
		viewport.getStageCanvas().addEventListener("pointerup", upCallback);
		rect.addEventListener("pointermove", moveCallback);
		rect.addEventListener("pointerup", upCallback);
	}

	static configureEventListeners() {
		viewport.getStageCanvas().addEventListener("pointerdown", this.addPointerDownListener);
	}

	static removeEventListeners() {
		viewport.getStageCanvas().removeEventListener("pointerdown", this.addPointerDownListener);
	}
}