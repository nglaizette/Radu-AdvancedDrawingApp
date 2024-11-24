const SHOW_HIT_REGION = false;
if(!SHOW_HIT_REGION){
	helperCanvas.style.display = "none";
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
helperCanvas.width = canvasProperties.width;
helperCanvas.height = canvasProperties.height;

const ctx = myCanvas.getContext('2d');
const helperCtx = helperCanvas.getContext('2d')
clearCanvas();

helperCtx.fillStyle = "red";
helperCtx.fillRect(0,0,canvasProperties.width, canvasProperties.height);

const shapes = [];
let currentShape = null;

const downCallbackForRect = function (e){
	const mousePosition = {
		x: e.offsetX,
		y: e.offsetY
	};
	currentShape = new Rect(mousePosition, getOptions());

	const moveCallback = function(e){
		const mousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
		currentShape.setCorner2(mousePosition);
		drawShapes([...shapes, currentShape]);
	};

	const upCallback = function (e) {
		myCanvas.removeEventListener('pointermove', moveCallback);
		myCanvas.removeEventListener('pointerup', upCallback);

		currentShape.recenter();
		shapes.push(currentShape);
	}

	myCanvas.addEventListener('pointermove', moveCallback);
	myCanvas.addEventListener('pointerup', upCallback);
}

const downCallbackForPath = function(e){
	const mousePosition = {
		x: e.offsetX,
		y: e.offsetY
	};
	currentShape =  new Path(mousePosition,getOptions());

	const moveCallback = function(e){
		const mousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
		//console.log(mousePosition.x);
		currentShape.addPoint(mousePosition);

		drawShapes([...shapes, currentShape]);
	};

	const upCallback = function (e) {
		myCanvas.removeEventListener('pointermove', moveCallback);
		myCanvas.removeEventListener('pointerup', upCallback);

		currentShape.recenter();
		shapes.push(currentShape);
	}

	myCanvas.addEventListener('pointermove', moveCallback);
	myCanvas.addEventListener('pointerup', upCallback);
}

const downCallbackForSelect = function (e){
	const mousePosition = {
		x: e.offsetX,
		y: e.offsetY
	};

	const [r, g, b, a ] = helperCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1).data;
	//console.log(r, g, b, a);
	const id =  r << 16 | g << 8 | b;
	//console.log(id);
	const shape = shapes.find(s=>s.id==id);
	if(shape){
		//console.log(shape);
		shape.selected=!shape.selected;
		shape.setCenter(mousePosition);
		drawShapes([...shapes, currentShape]);
	}
}

myCanvas.addEventListener('pointerdown', downCallbackForPath);

function changeTool(tool){
	//console.log(info);
	myCanvas.removeEventListener('pointerdown', downCallbackForPath);
	myCanvas.removeEventListener('pointerdown', downCallbackForRect);
	myCanvas.removeEventListener('pointerdown', downCallbackForSelect);
	switch(tool){
		case "rect":
			myCanvas.addEventListener('pointerdown', downCallbackForRect);
			break;
		case "path":
			myCanvas.addEventListener('pointerdown', downCallbackForPath);
			break;
		case "select":
			myCanvas.addEventListener('pointerdown', downCallbackForSelect);
			break;		
	}
}

function drawShapes(shapes) {
	clearCanvas();

	for(const shape of shapes){
		shape.draw(ctx);
	}
	helperCtx.clearRect(0, 0, canvasProperties.width, canvasProperties.height);
	for(const shape of shapes){
		shape.drawHitRegion(helperCtx);
	}
}

function getOptions(){
	return {
		fillColor: fillColor.value,
		strokeColor: strokeColor.value,
		fill: fill.checked,
		stroke: stroke.checked,
		strokeWidth: Number(strokeWidth.value)
	};
}

function clearCanvas(){
	ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
	ctx.fillStyle="gray";
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

	ctx.fillStyle="white";
	ctx.fillRect(stageProperties.left, stageProperties.top, stageProperties.width, stageProperties.height);
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

