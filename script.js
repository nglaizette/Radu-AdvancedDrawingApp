const SHOW_HIT_REGION = false;
if(!SHOW_HIT_REGION){
	hitTestCanvas.style.display = "none";
}

const stageProperties={
	width: 600,
	height: 480
}

const canvasProperties={
	width: SHOW_HIT_REGION ? window.innerWidth/2 : window.innerWidth,
	height: window.innerHeight,
	center: {
		x: SHOW_HIT_REGION ? window.innerWidth/4 : window.innerWidth/2,
		y: window.innerHeight/2
	}
};

stageProperties.left = canvasProperties.center.x - stageProperties.width/2;
stageProperties.top = canvasProperties.center.y - stageProperties.height/2;

myCanvas.width = canvasProperties.width;
myCanvas.height = canvasProperties.height;
hitTestCanvas.width = canvasProperties.width;
hitTestCanvas.height = canvasProperties.height;

const ctx = myCanvas.getContext('2d');
const hitTestingCtx = hitTestCanvas.getContext('2d')

clearCanvas();

const shapes = [];
let currentShape = null;

myCanvas.addEventListener('pointerdown', Path.addPointerDownListener);

window.addEventListener("keydown", (e) => {
	// if delete
	console.log(e);
	if(e.key === "Delete" || e.key === "Backspace"){
		shapes.splice(shapes.findIndex((s=> s.selected)), 1);
		drawShapes(shapes);
	}

	if(isShortcut(e.ctrlKey, e.key)){
		excuteShortcut(e.ctrlKey, e.key);
		e.preventDefault();
	}
})

function changeTool(tool){
	//console.log(info);
	myCanvas.removeEventListener('pointerdown', Path.addPointerDownListener);
	myCanvas.removeEventListener('pointerdown', Rect.addPointerDownListener);
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
		case "select":
			myCanvas.addEventListener('pointerdown', downCallbackForSelect);
			break;		
	}
}

function selectTool(tool){
	changeTool(tool);
	const toolSelector =  document.getElementById("toolSelector");
	if(toolSelector){
		toolSelector.value = tool
	}
}

function selectRectTool(){
	selectTool("rect");
}

function selectPathTool(){
	selectTool("path");
}

function selectSelectTool(){
	selectTool("select");
}

function drawShapes(shapes) {
	clearCanvas();

	for(const shape of shapes){
		shape.draw(ctx);
	}
	hitTestingCtx.clearRect(0, 0, canvasProperties.width, canvasProperties.height);
	for(const shape of shapes){
		shape.draw(hitTestingCtx, true);
	}
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

function clearCanvas(){
	ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
	ctx.fillStyle="gray";
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

	ctx.fillStyle="white";
	ctx.fillRect(stageProperties.left, stageProperties.top, stageProperties.width, stageProperties.height);

	ctx.textAlign = "right";
	ctx.fillText("Contributors: " + contributors.join(", "), myCanvas.width - 10, 10);

	// For debugging
	hitTestingCtx.fillStyle = "red";
	hitTestingCtx.fillRect(0,0,canvasProperties.width, canvasProperties.height);
}

function changeFillColor(value){
	console.log(value);
	shapes.filter(s=>s.selected).forEach(s=>s.options.fillColor=value);
	drawShapes(shapes);
}

function changeFill(value){
	console.log(value);
	shapes.filter(s=>s.selected).forEach(s=>s.options.fill=value);
	drawShapes(shapes);
}

function changeStrokeColor(value){
	console.log(value);
	shapes.filter(s=>s.selected).forEach(s=>s.options.strokeColor=value);
	drawShapes(shapes);
}

function changeStroke(value){
	console.log(value);
	shapes.filter(s=>s.selected).forEach(s=>s.options.stroke=value);
	drawShapes(shapes);
}

function changeStrokeWidth(value) {
	console.log(Number(value));
	shapes.filter(s=>s.selected).forEach(s=>s.options.strokeWidth=Number(value));
	drawShapes(shapes);
}

function undo(){
	alert("ToDo");
	//shapes = JSON.parse(history.pop());
	//drawShapes(shapes);
}

function changeX(value) {
	shapes.filter((s) => s.selected).forEach((s) => 
		s.center.x = Number(value) + stageProperties.left
	);
	drawShapes(shapes);
}

function changeY(value) {
	shapes.filter((s) => s.selected).forEach((s) => 
		s.center.y = Number(value) + stageProperties.top
	);
	drawShapes(shapes);
}

function changeWidth(value) {
	//shapes.filter((s) => s.selected).forEach((s) =>)
	alert("Todo");
}

function changeHeight(value) {
	//shapes.filter((s) => s.selected).forEach((s) => s.y = Number(value));
	//drawShapes(shapes);
	alert("Todo")
}


function updateProperties(selectedShapes) {
	if(selectedShapes.length === 0) {
		document.getElementById("properties").innerHTML = "";
		return;
	}

	const shape = selectedShapes[0];
	x.value = Math.round(shape.center.x - stageProperties.left);
	y.value = Math.round(shape.center.y - stageProperties.top);
	width.value = shape.size.width;
	height.value = shape.size.height;
}
