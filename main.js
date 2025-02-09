const SHOW_HIT_REGION = false;
const RECTANGULAR_SELECTION_MODE = "intersection"; //"intersection" or "containment"
if (!SHOW_HIT_REGION) {
	hitTestCanvas.style.display = "none";
}

const stageProperties = {
	width: 600,
	height: 480,
};

const canvasProperties = {
	width: SHOW_HIT_REGION ? window.innerWidth / 2 : window.innerWidth,
	height: window.innerHeight,
	center: Vector.zero(),
};
canvasProperties.offset = new Vector(
	canvasProperties.width / 2,
	canvasProperties.height / 2
);

stageProperties.left = canvasProperties.center.x - stageProperties.width / 2;
stageProperties.top = canvasProperties.center.y - stageProperties.height / 2;

myCanvas.width = canvasProperties.width;
myCanvas.height = canvasProperties.height;
hitTestCanvas.width = canvasProperties.width;
hitTestCanvas.height = canvasProperties.height;

const ctx = myCanvas.getContext("2d");
const hitTestingCtx = hitTestCanvas.getContext("2d", {
	willReadFrequently: true,
});

ctx.translate(canvasProperties.offset.x, canvasProperties.offset.y);
hitTestingCtx.translate(canvasProperties.offset.x, canvasProperties.offset.y);

clearCanvas();
drawStage();

let shapes = [];
let gizmos = [];
let currentShape = null;
let clipboard = null;

document.addEventListener("keydown", (e) => {
	//console.log(e);
	if (e.target instanceof HTMLInputElement) {
		return;
	}

	if (isShortcut(e.ctrlKey, e.key)) {
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

function clearCanvas() {
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
