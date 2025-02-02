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
const hitTestingCtx = hitTestCanvas.getContext('2d', {willReadFrequently: true});

ctx.translate(canvasProperties.offset.x, canvasProperties.offset.y);
hitTestingCtx.translate(canvasProperties.offset.x, canvasProperties.offset.y);

clearCanvas();
drawStage();

let shapes = [];
let gizmos = [];
let currentShape = null;
let clipboard = null;

myCanvas.addEventListener('pointerdown', PathTool.addPointerDownListener);

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
const toolsPanel = new ToolsPanel(toolsHolder);

function changeTool(tool) {
	//console.log(info);
	myCanvas.removeEventListener('pointerdown', PathTool.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', RectTool.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', OvalTool.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', TextTool.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', SelectTool.addPointerdownListener);
	
	shapes.forEach((s) => (s.selected = false));
	drawShapes(shapes);

	switch(tool){
		case "rect":
			myCanvas.addEventListener('pointerdown', RectTool.addPointerDownListener);
			break;
		case "path":
			myCanvas.addEventListener('pointerdown', PathTool.addPointerDownListener);
			break;
		case "oval":
			myCanvas.addEventListener('pointerdown', OvalTool.addPointerDownListener);
			break;
		case "text":
			myCanvas.addEventListener('pointerdown', TextTool.addPointerDownListener);
			break;
		case "select":
			myCanvas.addEventListener('pointerdown', SelectTool.addPointerdownListener);
			break;		
	}
}

function selectTool(tool) {
	ShapeTools.selectTool(tool);
	return;
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

function resetColors() {
	fillColor.value = "#ffffff";
	strokeColor.value = "#000000";
	PropertiesPanel.changeFillColor(fillColor.value);
	PropertiesPanel.changeStrokeColor(strokeColor.value);
}

function swapColors(){
	const fillStyle = fillColor.value;
	const strokeStyle =  strokeColor.value;

	fillColor.value = strokeStyle;
	strokeColor.value = fillStyle;

	PropertiesPanel.changeFillColor(fillColor.value);
	PropertiesPanel.changeStrokeColor(strokeColor.value);

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
		newShapes.forEach((s) => s.id = Shape.generateId());
		shapes.push(...newShapes);

		drawShapes(shapes);
		HistoryTools.record(shapes);
	};
}

function duplicate(){
	copy();
	paste();
}

