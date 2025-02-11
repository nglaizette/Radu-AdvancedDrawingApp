class SelectTool {
	static addPointerDownListener(e) {
		// downCallbackForSelect

		if (e.button !== 0) return;

		PropertiesPanel.reset();
		const startPosition = new Vector(e.offsetX, e.offsetY);

		const [r, g, b, a] = viewport.hitTestingCtx.getImageData(
			startPosition.x,
			startPosition.y,
			1,
			1
		).data;
		//console.log(r, g, b, a);
		const id = (r << 16) | (g << 8) | b;
		//console.log(id);
		const shape = shapes.find((s) => s.id == id);
		const gizmo = gizmos.find((g) => g.hasHandle(id));

		if (gizmo) {
			const handle = gizmo.hasHandle(id);
			const selectedShapes = shapes.filter((s) => s.selected);
			gizmo.addEventListeners(startPosition, handle, selectedShapes);
			return;
		}

		let isClickingSelectedShape = shape && shape.selected;

		if (!isClickingSelectedShape) {
			if (e.ctrlKey === false && e.shiftKey === false) {
				shapes.forEach((s) => (s.selected = false));
			}
		}

		if (shape) {
			if (!isClickingSelectedShape) {
				shape.selected = true;
			}
			const selectedShapes = shapes.filter((s) => s.selected);
			const oldCenters = selectedShapes.map((s) => s.center);
			let mouseDelta = null;
			let isDragging = false;

			//shape.setCenter(diff);
			viewport.drawShapes(shapes);
			PropertiesPanel.updateDisplay(selectedShapes);

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
					s.setCenter(Vector.add(oldCenters[i], mouseDelta));
				});
				viewport.drawShapes(shapes);
				PropertiesPanel.updateDisplay(selectedShapes);
				//viewport.drawShapes([...shapes, currentShape]);
			};

			const upCallback = function (e) {
				viewport.canvas.removeEventListener("pointermove", moveCallback);
				viewport.canvas.removeEventListener("pointerup", upCallback);

				if (isClickingSelectedShape && !isDragging) {
					shape.selected = false;
					viewport.drawShapes(shapes);
				}
				PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));

				if (!isDragging && mouseDelta?.magnitude() > 0) {
					HistoryTools.record(shapes);
				}
			};

			viewport.canvas.addEventListener("pointermove", moveCallback);
			viewport.canvas.addEventListener("pointerup", upCallback);
		} else {
			SelectTool.selectShapeUnderRectangle(e);
		}

		viewport.drawShapes(shapes);
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
			viewport.canvas.removeEventListener("pointermove", moveCallback);
			viewport.canvas.removeEventListener("pointerup", upCallback);
			rect.removeEventListener("pointerup", upCallback);
			rect.removeEventListener("pointermove", moveCallback);

			const rectBox = new BoundingBox(
				viewport.getAdjustedPosition(topLeft),
				viewport.getAdjustedPosition(bottomRight)
			);

			shapes.forEach((shape) => {
				const shapeBox = BoundingBox.fromPoints(
					shape.getPoints().map((p) => p.add(shape.center))
				);

				switch (RECTANGULAR_SELECTION_MODE) {
					case "containement":
						// logic for shape must be inside rectangle
						if (rectBox.contains(shapeBox)) {
							shape.selected = true;
						}
						break;
					case "intersection":
						if (rectBox.intersect(shapeBox)) {
							shape.selected = true;
						}
						break;
					default:
						break;
				}
			});

			rect.remove();
			PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));
			viewport.drawShapes(shapes);
		};
		// adding event listeners to the rectangle to allow rectangle redraw when pointer moves into it
		viewport.canvas.addEventListener("pointermove", moveCallback);
		viewport.canvas.addEventListener("pointerup", upCallback);
		rect.addEventListener("pointermove", moveCallback);
		rect.addEventListener("pointerup", upCallback);
	}
}
