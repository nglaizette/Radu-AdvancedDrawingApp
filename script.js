const SHOW_HIT_REGION = false;
const RECTANGULAR_SELECTION_MODE = "intersection"; //"intersection" or "containment"
if(!SHOW_HIT_REGION){
	hitTestCanvas.style.display = "none";
}

const stageProperties = { 
	width: 600,
	height: 480
}

const canvasProperties = {
	width: SHOW_HIT_REGION ? window.innerWidth/2 : window.innerWidth,
	height: window.innerHeight,
	center: Vector.zero()
};
canvasProperties.offset = new Vector(canvasProperties.width/2, canvasProperties.height/2);

stageProperties.left = canvasProperties.center.x - stageProperties.width/2;
stageProperties.top = canvasProperties.center.y - stageProperties.height/2;

myCanvas.width = canvasProperties.width;
myCanvas.height = canvasProperties.height;
hitTestCanvas.width = canvasProperties.width;
hitTestCanvas.height = canvasProperties.height;

const ctx = myCanvas.getContext('2d');
const hitTestingCtx = hitTestCanvas.getContext('2d')

ctx.translate(canvasProperties.offset.x, canvasProperties.offset.y);
hitTestingCtx.translate(canvasProperties.offset.x, canvasProperties.offset.y);

clearCanvas();
drawStage();

const redoStack = [];
const history = [];
let shapes = [];
let currentShape = null;
let clipboard = null;

myCanvas.addEventListener('pointerdown', Path.addPointerDownListener);

document.addEventListener("keydown", (e) => {
	
	//console.log(e);
	if(e.target instanceof HTMLInputElement){
		return;
	}

	if(isShortcut(e.ctrlKey, e.key)){
		executeShortcut(e.ctrlKey, e.key);
		e.preventDefault();
	}
});

const viewport = new Viewport(
	myCanvas,
	hitTestCanvas,
	canvasProperties,
	stageProperties
);

const propertiesPanel = new PropertiesPanel(propertiesHolder);

function changeTool(tool) {
	//console.log(info);
	myCanvas.removeEventListener('pointerdown', Path.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', Rect.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', Oval.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', Text.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', downCallbackForSelect);
	
	shapes.forEach((s) => (s.selected = false));
	drawShapes(shapes);

	switch(tool){
		case "rect":
			myCanvas.addEventListener('pointerdown', Rect.addPointerDownListener);
			break;
		case "path":
			myCanvas.addEventListener('pointerdown', Path.addPointerDownListener);
			break;
		case "oval":
			myCanvas.addEventListener('pointerdown', Oval.addPointerDownListener);
			break;
		case "text":
			myCanvas.addEventListener('pointerdown', Text.addPointerDownListener);
			break;
		case "select":
			myCanvas.addEventListener('pointerdown', downCallbackForSelect);
			break;		
	}
}

function selectTool(tool) {
	changeTool(tool);
	const toolSelector =  document.getElementById("toolSelector");
	if(toolSelector){
		toolSelector.value = tool
	}
}

function selectRectTool() {
	selectTool("rect");
}

function selectOvalTool() {
	selectTool("oval");
}

function selectTextTool() {
	selectTool("text");
}

function selectPathTool() {
	selectTool("path");
}

function selectSelectTool() {
	selectTool("select");
}

function getOptions(){
	return {
		fillColor: fillColor.value,
		strokeColor: strokeColor.value,
		fill: fill.checked,
		stroke: stroke.checked,
		strokeWidth: Number(strokeWidth.value),
		lineCap: "round",
		lineJoin: "round"
	};
}

function clearCanvas() {

	ctx.fillStyle = "gray";
	ctx.fillRect(-myCanvas.width / 2, -myCanvas.height / 2, myCanvas.width, myCanvas.height);

	ctx.fillStyle = "white";
	ctx.textAlign = "right";
	ctx.fillText(
		"Contributors: " + contributors.join(", "), 
		myCanvas.width / 2 - 10,
		- myCanvas.height / 2 + 10
	);
}

function drawStage() {
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

function updateHistory(shapes){
	history.push(shapes.map((s) => s.serialize(stageProperties)));
	redoStack.length = 0;
}

function copy() {
	const selectedShapes = shapes.filter((s) => s.selected);
	if(selectedShapes.length > 0){
		const data = selectedShapes.map((s) => s.serialize(stageProperties));
		//copyToClipboard(JSON.stringify(selectedShapes));
		clipboard = JSON.stringify(data);
	}
}

function paste() {
	if(clipboard){
		shapes.forEach((s) => (s.selected = false));
		const newShapes= loadShapes(JSON.parse(clipboard));
		newShapes.forEach((s) => s.generateId());
		shapes.push(...newShapes);

		drawShapes(shapes);
		updateHistory(shapes);
	};
}

function duplicate(){
	copy();
	paste();
}

/**
 * I used a object with with 2 arrays: undo and redo. And also a history that you can select where you want to go
 */
function redo() {
	if(redoStack.length > 0){
		const data= redoStack.pop();
		shapes = loadShapes(data);
		drawShapes(shapes);
		history.push(data);
		PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));
	}
}

function undo() {
	if(!history.length){ // prevent pushing undefined into redoStack
		return;
	}
	redoStack.push(history.pop());
	if(history.length > 0){
		shapes = loadShapes(history[history.length - 1]);
	}
	else {
		shapes.length = 0;
	}
	drawShapes(shapes);
	PropertiesPanel.updateDisplay(shapes.filter((s) => s.selected));	
}

function save() {
	//console.log(shapes)
	const data = JSON.stringify(shapes.map((s) => s.serialize(stageProperties)));
	//console.log(data);

	//download(
	const a = document.createElement("a");
	const file = new Blob([data], { type: "application/json" });
	a.href = URL.createObjectURL(file);
	a.download = "drawing.json";
	a.click();
}

function load(){
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".json, .png";
	input.onchange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		const extension = file.name.split(".").pop();

		reader.onload = (e) => {
			if(extension === "json"){
				const data = JSON.parse(e.target.result);
				//shapes.splice(0, shapes.length);
				shapes = loadShapes(data);
				drawShapes(shapes);
				updateHistory(shapes);
			}
			else if(extension === "png"){
				loadImage(e);
			}

		};

		if(extension === "json"){
			reader.readAsText(file);
		} else if (extension === "png") {
			reader.readAsDataURL(file);
		}
	};
	input.click();
}

function loadImage(e){
	const img = new Image();
	img.onload = () => {
		const myImage = new MyImage(img, getOptions());
		myImage.setCenter(
			new Vector(
				stageProperties.left + stageProperties.width / 2,
				stageProperties.top + stageProperties.height / 2
			)
		);
		shapes.push(myImage);
		drawShapes(shapes);
		updateHistory(shapes);
	};
	img.src = e.target.result;
}

function do_import(data) {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".png";
	input.onchange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			loadImage(e);
		};
		reader.readAsDataURL(file);
	};
	input.click();
}

function do_export(data) {
	// saves canvas as an image

	const tmpCanvas = document.createElement("canvas");
	tmpCanvas.width = stageProperties.width;
	tmpCanvas.height = stageProperties.height;
	const tmpCtx = tmpCanvas.getContext("2d");
	tmpCtx.translate(-stageProperties.left, -stageProperties.top);
	for (const shape of shapes) {
		const isSelected = shape.selected;
		shape.selected = false;
		shape.draw(tmpCtx);
		shape.selected = isSelected;
	}
	/* temporaire affichage d'une image 
	tmpCtx.drawImage(
		myCanvas,
		stageProperties.left,
		stageProperties.top,
		stageProperties.width,
		stageProperties.height,
		0,
		0,
		stageProperties.width,
		stageProperties.height
	);*/
	tmpCanvas.toBlob((blob) => {
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "screenshot.png";
		a.click();
	});

}