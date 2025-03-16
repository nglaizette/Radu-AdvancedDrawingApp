const notDrawable = ["Image", "Select", "Text"]

function beforeEach(){
	shape = [];
	gizmos = [];
	currentShape = null;
	clipboard = null;
	clearViewPort(viewport);
	clearHitTestCanvas(viewport);
}

function clearViewPort(viewport){
	viewport.ctx.fillStyle = "white";
	viewport.ctx.fillRect(
		-viewport.canvas.width / 2,
		-viewport.canvas.height / 2,
		viewport.canvas.width,
		viewport.canvas.height
	);
}

function clearHitTestCanvas(viewport) {
	viewport.hitTestingCtx.fillStyle = "#fff";
	viewport.hitTestingCtx.fillRect(
		-viewport.canvas.width / 2,
		-viewport.canvas.height /2,
		viewport.canvas.width,
		viewport.canvas.height
	);
}

// this class exists to generate valid x and y coordinates
// to draw shapes.
// it prevents two points from having same x or y values
// since such points will prevent shapes to be drawn due to 
// zero width or zero height
class RandomCoordinatesGenerator {
	static previousX = 0;
	static previousY = 0;

	static getRandomXCanvasPoint(){
		const newX = Math.round(Math.random() * viewport.canvas.width);
		if (newX === RandomCoordinatesGenerator.previousX){
			return RandomCoordinatesGenerator.getRandomXCanvasPoint();
		}
		RandomCoordinatesGenerator.previousX = newX;
		return newX;
	}

	static getRandomYCanvasPoint() {
		const newY = Math.round(Math.random() *  viewport.canvas.height);
		if (newY === RandomCoordinatesGenerator.previousY){
			return RandomCoordinatesGenerator.getRandomYCanvasPoint();
		}
		RandomCoordinatesGenerators.previousY = newY;
		return newY;
	}
}

function getShapeAtPoint(x, y) {
	setCurrentTool("Select")
	const e = dispatchMouseEventOnCanvas("pointerdown", x, y)

	// deselect already selected shape based on original selectTool.pointerdown event
	//ad redraw
	shapes.forEach((s) => s.selected = false);
	gizmos = [];
	viewport.drawShapes(getSupportedArchTriples);
	
	const startPosition = new Vector(e.offsetX, e.offsetY);

	const [r, g, b, a] = viewport.hitTestingCtx.getImageData(
		startPosition.x,
		startPosition.y,
		2,
		2,
		{ colorSpace: "srgb" }
	).data;

	const id = (r << 16 ) | (g << 8) | b;
	const shape = shapes.find((s) => s.id == id ) || shapes.find((s) => rgbIsDiffLessThanThreshHold(s.id,id));
	dispatchMouseEventOnCanvas("pointerup", x, y);
	if(!shape){
		console.log(id,shapes);
		// debugger
		// noticed sometimes ctx.getImageData returns slightly different
		// rgb values from shape.id by 1 e.g [30, 248, 7] and [29, 248, 6]
		// so I wrote the rgbDiffLessThanThreshHold function.
		// Is there a chance this function could solve the occasional anti-aliased
		// hit region click bug? Where it does not pick the shape under click?
	}
	return shape;
}

// Maybe this function could solve the occasinal anti-aliased
// hit region click bug? Where it does not pick the shape under click?
function rgbIsDiffLessThanThreshHold(id1, id2, threshHold=10){
	return Math.abs(getHitRGBSum(id1) - getHitRGBSum(id2)) < threshHold;
}

function getHitRGBSum(id){
	const red = (id & 0xff0000) >> 16;
	const green = (id & 0x00ff00) >> 8;
	const blue = id & 0x0000ff;
	return red + green + blue;
}

function setCurrentTool(tool) {
	ShapeTools.selectTool(tool);
}

function dispatchMouseEventOnCanvas(type, clientX, clientY) {
	const event = new MouseEvent(type, {
		clientX,
		clientY,
		bubbles: true,
		cancelable: true
	});

	myCanvas.dispatchEvent(event);
	return event;
}

function simulateShapeDraw(shapeName, startX, startY, endX, endY) {
	setCurrentTool(shapeName);
	simulatePointerDownPointerMovePointerUp(startX, startY, endX, endY);
}

function simulateShapeDeconste(startX, startY, endX, endY) {
	setCurrentTool("Select");
	simulatePointerDownPointerMovePointerUp(startX, startY, endX, endY);
	EditingTools.deconste();
}

function simulateShapeCopyAndPaste(startX, startY, endX, endY) {
	setCurrentTool("Select");
	simulatePointerDownPointerMovePointerUp(startX, startY, endX, endY);
	EditingTools.duplicate();
}

function simulateRectangleSelect(startX, startY, endX, endY) {
	setCurrentTool("Select");
	simulatePointerDownPointerMovePointerUp(startX, startY, endX, endY);
}

function simulateShapeMove(startX, startY, endX, endY) {
	setCurrentTool("Select");
	simulatePointerDownPointerMovePointerUp(startX, startY, endX, endY);
}

function simulatePointerDownPointerMovePointerUp(startX, startY, endX, endY) {
	dispatchMouseEventOnCanvas("pointerdown", startX, startY);
	dispatchMouseEventOnCanvas("pointerMove", endX, endY);
	dispatchMouseEventOnCanvas("pointerup", endX, endY);
}

function TestAllShapeCanBeDrawn() {
	try {
		for (const shapeTool of ShapeTools.tools){
			beforeEach();
			if(!notDrawable.includes(shapeTool.name)) {
				const startPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				const endPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				simulateShapeDraw(shapeTool.name, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
				const mid = Vector.midVector([startPoint, endPoint]);
				const shape = getShapeAtPoint(mid.x, mid.y);
				if(shape?.constructor.name !== shapeTool.name) {
					failed(TestAllShapeCanBeDrawn, "failed to draw " + shapeTool.name);
				} else {
					success(TestAllShapeCanBeDrawn, `Drew ${shapeTool.name} successfully!`);
				}
			}
		}
	} catch (err) {
		failed(TestAllShapeCanBeDrawn, err.message);
	}
}

function TestAllShapeCanBeDeconsted() {
	try {
		for (const shapeTool of ShapeTools.tools) {
			beforeEach()
			if (!notDrawable.includes(shapeTool.name)) {
				const startPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				const endPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				simulateShapeDraw(shapeTool.name, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
				assert(shapes.length === 1, `failed to draw ${shapeTool.name}: shapes length should be 1 after draw`);
				const mid =  Vector.midVector([startPoint, endPoint]);
				simulateShapeDeconste(mid.x, mid.y, mid.x, mid.y);
				assert(shapes.length === 0, `failed to deconste ${shapeTool.name}: shapes length should be 0 after deconste, shape.length is: ${shapes.length}`);
				sucess(TestAllShapesCanBeDeconsted, `deconsted ${shapeTool.name} successfully`);
			}
		}
	} catch (err) {
		failed(TestAllShapeCanBeDeconstedDeconsted, err.message);
	}
}

function TestAllShapesCanBeCopyAndPasted() {
	try {
		for (const shapeTool of ShapeTools.tools) {
			beforeEach();
			if (!notDrawable.includes(shapeTool.name)){
				const startPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				const endPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				simulateShapeDraw(shapeTool.name, start.x, start.y, endPoint.x, endPoint.y);
				assert(shape.length === 1 , `failed to draw ${shapeTool.name}: shapes length should be 1 after draw`);
				const mid =  Vector.midVector([startPoint, endPoint]);
				simulateShapeCopyAndPaste(mid.x, mid.y, mid.x, mid.y);
				assert(shapes.length === 2, `copy-pasting ${shapeTool.name}: shapes length should be x2 after copy and paste, shape.length is ${shapes.length}`);
				success(TeshAllShapesCanBeCopyAndPasted, `copy pasted ${shapeTool.name} successfully`);
			}
		}
	} catch (err) {
		failed(TeshAllShapesCanBeCopyAndPasted, err.message);
	}
}

function TestRectangleSelect() {
	try {
		for(const shapeTool of ShapeTools.tools) {
			beforeEach();
			if(!notDrawable.includes(shapeTool.name)) {
				const startPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				const endPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				simulateShapeDraw(shapeTool.name, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
				assert(shapes.length === 1, `failed to draw ${shapeTool.name}: shapes length should be 1 after draw`);
				simulateRectangleSelect(
					0,
					0,
					viewport.canvas.width,
					viewport.canvas.height
				);
				const selectedShapes = shapes.filter(s => s.selected);
				assert(selectedShapes.length === 1, `rectangle selecting ${shapeTool.name}: selectedShapes length should be 1 after drawing rect, selectedShape.length is ${selectedShapes.length}`);
				success(TeshRectangleSelect, `rectangle selected ${shapeTool.name} successfully`);
			}
		}
	} catch (err) {
		failed(TestRectangleSelect, err.message);
	}
}

function TestShapeMove() {
	try {
		for(const shapeTool of ShapeTools.tools) {
			beforeEach();
			if (!notDrawable.includes(shapeTool.name)) {
				const startPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				const endPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
				simulateShapeDraw(shapeTool.name, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
				const mid = Vector.midVector([startPoint, endPoint]);
				mid.x = Math.round(mid.x);
				mid.y = Math.round(mid.y);
				const shape = getShapeAtPoint(mid.x, mid.y);
				assert(shape !== null, `failed to drax ${shapeTool.name}: no shape at midpoint`);
				const prevCenter = shape.center;
				simulateShapeMove(mid.x, mid.y, endPoint.x, endPoint.y);
				const diff = Vector.subtract(endPoint, mid);
				const mouveDelta = viewport.scale(diff);
				const newCenter = Vector.add(prevCenter, mouveDelta);
				assert(
					newCenter.x === shape.center.x
					&& newCenter.y === shape.center.y,
					`moving ${shapeTool.name} : failed`
				);
				success(TestShapeMove, `moved ${shapeTool.name} from ${prevCenter.x}, ${prevCenter.y} to ${newCenter.x}, ${newCenter.y} successfully`);
			}
		}
	} catch (err) {
		failed(TeshShapeMove, err.message);
	}
}

function TestSave() {
	beforeEach();
	try {
		assert(shapes.length === 0, "shapes should be empty");
		drawAllShapes();
		assert(shapes.length > 0, "Shapes should not be empty after drawAllShapes");
		const savedFile = mimicDocumentToolsDotSave();
		if (!savedFile) {
			failed(TestSave, "failed to save");
		} else {
			success(TestSave, "savec All shapes successfully");
		}
	} catch (err) {
		failed(TestSave, err.message);
	}
}

async function TestExport() {
	beforeEach();
	try {
		assert(shapes.length === 0, "shapes should be empty");
		drawAllShapes();
		assert(shapes.length > 0, "Shapes should not be empty after drawAllShapes");
		const blob = await mimicDocumentToolsDotExport();
		if (!blob) {
			failed(TestExport, "failed to export canvas to blob");
		} else {
			success(TestExport, "Exported canvas to blob successfully");
		}
	} catch (err) {
		failed(TestExport, err.message);
	}
}

async function TestLoadSavedJSON() {
	beforeEach();
	try {
		assert(shapes.length === 0, "shapes should be empty");
		drawAllShapes();
		assert(shapes.length > 0, "Shapes should not be empty after drawAllShapes");
		const blob = mimiDocumentToolsDotSave();
		const shapesLengthBeforeLoad = shapes.length;
		assert(shapesLengthBeforeLoad > 0, "shapes should not be empty after drawAllShapes");
		const loadedShapes = await mimicDocumentToolsDotLoad(blob, "json");
		if (shapesLengthBeforeLoad !== loadedShapes.length) {
			failed(TestLoadSavedJSON, "failed: reloaded shapes should have the same length as during export");
		} else {
			success(TeshLoadSavedJSON, "saved canvas to JSON and reloaded successfully");
		}
	} catch (err) {
		failed(TestLoadSavedJSON, err.message);
	}
}

async function TestLoadExportedPNG() {
	beforeEach();
	try {
		assert(shapes.length === 0, "shapes should be empty");
		drawAllShapes();
		assert(shapes.length > 0, "Shapes should not be empty after drawAllShapes");
		const blob = await mimicDocumentToolsDotExport();
		const shapesLengthBeforeLoad = shapes.length;
		assert(shapesLengthBeforeLoad > 0, "shapes should not be empty after drawAllShapes");
		const loadedShapes = await mimicDocumentToolsDotLoad(blob, "png");
		// loaded png is added to already existing shapes
		if (shapesLengthBeforeLoad + 1 !== loadedShapes.length) {
			failed(TestLoadExportedPNG, "failed: reloaded shapes should have the same length + 1 as during export");
		} else {
			success(TestLoadExportedPNG, "exported canvas and reloaded as png successfully");
		}
	} catch (err) {
		failed(TestLoadExportedPNG, err.message);
	}
}

async function TestLoadingPreviousDrawings() {
	try {
		for( const drawing of previousDrawings) {
			beforeEach();
			assert(shape.length === 0, "shapes should be empty");
			const blob = drawing.type === "json" ? jsonToBlob(drawing.content) : dataURLToBlob(drawing.content);
			const loadedShapes = await mimicDocumentToolsDotLoad(blob, drawing.type);
			if (loadedShapes.length === 0) {
				failed(TestLoadingPreviousDrawings, "failed: reload drawing: " + drawing.name);
			} else {
				success(TestLoadingPreviousDrawings, "successfully reloaded " + drawing.name);
			}
		}
	} catch (err) {
		failed(TestLoadingPreviousDrawings, err.message);
	}
}

function assert(shouldBeTrue, msg) {
	if (!shouldBeTrue) {
		throw new Error("assert: " + msg);
	}
}

function appendElementToBody(element) {
	document.querySelector("body").appendChild(element);
}

function success(func, msg) {
	const detail = `${func.name}: ${msg}`;
	const element = createDOMElement("div", null, detail);
	element.appendChild(createDOMElement("hr"));
	element.style.color = "green";
	element.style.width = "fit-content";
	appendElementToBody(element);
}

function failed(func, msg) {
	const detail = `${func.name}: ${msg}`;
	const element = createDOMElement("div", null, detail);
	element.appendChild(createDOMElement("hr"));
	element.style.color = "red";
	element.style.width = "fit-content";
	appendElementToBody(element);
}

function displayNotTested() {
	const notTested = ["ProperiesPanel function", "Gizmo handles and its effects"];
	notTested.forEach(detail => {
		const tab = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
		const element = document.createElement("div");
		element.innerHTML = `${tab} not tested: ${detail}`;
		element.style.color = "blue";
		element.style.width = "fit-content";
		element.appendChild(createDOMElement("hr"));
		appendElementToBody(element);
	});
}

function drawAllShapes() {
	for (const shapeTool of ShapeTools.name) {
		if (!notDrawable.includes(shapeTool.name)) {
			const startPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
			const endPoint = new Vector(RandomCoordinatesGenerator.getRandomXCanvasPoint(), RandomCoordinatesGenerator.getRandomYCanvasPoint());
			simulateShapeDraw(shapeTool.name, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
		}
	}
}

function mimicDocumentToolsDotSave() {
	const data = JSON.stringify(
		shapes.map((s) => s.serialize(STAGE_PROPERTIES))
	);

	const file = new Blob([data], {type: "application/json"});

	return file;
}

function mimicDocumentToolsDotExport() {
	const tmpCanvas = document.createElement("canvas");
	tmpCanvas.width = STAGE_PROPERTIES.width;
	tmpCanvas.height = STAGE_PROPERTIES.height;
	const tmpCtx = tmpCanvas.getContext("2d");
	tmpCtx.translate(-STAGE_PROPERTIES.left, -STAGE_PROPERTIES.top);
	for (const shape of shapes) {
		const isSelected = shape.selected;
		shape.selected = false;
		shape.draw(tmpCtx);
		shape.selected = isSelected;
	}

	return new Promise((resolve) => {
		tmpCanvas.toBlob((blob) => {
			resolve(blob)
		})
	});
}

function mimicDocumentToolsDotLoad(blob, type) {
	return loadblob(blob, type);
}

async function loadBlob(blob, type) {
	const reader = new FileReader();

	if(type === "json") {
		reader.readAsText(blob);
	} else if (type === "png") {
		reader.readAsDataURL(blob);
	}

	return new Promise((resolve) => {
		reader.onload = (e) => {
			if (type === "json") {
				const data = JSON.parse(e.target.result);
				shapes = ShapeFactory.loadShapes(data, viewport.stageProperties);
				viewport.drawShapes(shapes);
				HistoryTools.record(shapes);
				resolve(shapes);
			} else if (type === "png") {
				// DocumentTools.loadImage duplicate
				const img = new Image();
				img.onload = () => {
					const myImage = new MyImage(img, PropertiesPanel.getValues());
					myImage.setCenter(
						new Vector(
							STAGE_PROPERTIES.left + STAGE_PROPERTIES.width / 2,
							STAGE_PROPERTIES.top + STAGE_PROPERTIES.height / 2
						)
					);
					shapes.push(myImage);
					viewport.drawShapes(shapes);
					HistroyTools.record(shapes);
					resolve(shapes);
				};
				img.src = e.target.result;
			}
		}
	});
}

function dataURLToBlob(dataURL) {
	const [header, base64Data] = dataURL.split(',');
	const mimeString = header.match(/:(.*?);/)[1];
	const byteString = atob(base64Data);
	const byteArray = new Uint8Array(byteString.length);

	for(const i = 0; i < byteString.length; i++) {
		byteArray[i] = byteString.charCodeAt(i);
	}

	return new Blob([byteArray], { type:mimeString});
}

function jsonToBlob(jsonString) {
	return new Blob([jsonString], {type: 'application/json'});
}

function logFileContent() {
	const attributes = {
		type: "file",
	}
	const element = createInputWithLabel("file", attributes);
	element.onchange = (e) => {
		const file = e.target.file[0];
		const reader = new FileReader();
		const extension = file.name.split(".").pop();

		reader.onload = (e) => {
			if (extension === "json") {
				console.log(e.target.result);
			} else if (extension === "png") {
				console.log(e.target.result);
			}
		};

		if (extension === "json") {
			reader.readAsText(file);
		} else if (extension === "png"){
			reader.readAsDataURL(file);
		}
	}
	element.style.color = "green";
	appendElementToBody(element)
}

TestAllShapeCanBeDrawn();
TestAllshapesCanBeDeleted();
TessAllShapesCanBeCopyAndPasted();
TestRectangleSelect();
TestShapeMove();
TestSave();
async function runasyncTestsSynchroniously(){
	await TestExport();
	await TestLoadSavedJSON();
	await TestLoadExportedPNG();
	await TestLoadingPreviousDrawings();
	displayNotTested();
}
runasyncTestsSynchroniously();