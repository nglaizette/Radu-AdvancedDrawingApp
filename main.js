const SHOW_HIT_REGION = false;
const RECTANGULAR_SELECTION_MODE = "intersection"; //"intersection" or "containment"

const stageProperties = {
	width: 600,
	height: 480,
};

const ctx = myCanvas.getContext("2d");
const hitTestingCtx = hitTestCanvas.getContext("2d", {
	willReadFrequently: true,
});

const viewport = new Viewport(
	myCanvas,
	hitTestCanvas,
	stageProperties,
	SHOW_HIT_REGION
);

ctx.translate(viewport.canvasProperties.offset.x, viewport.canvasProperties.offset.y);
hitTestingCtx.translate(viewport.canvasProperties.offset.x, viewport.canvasProperties.offset.y);

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

const propertiesPanel = new PropertiesPanel(propertiesHolder);
const toolsPanel = new ToolsPanel(toolsHolder);
