const SHOW_HIT_REGION = false;
const RECTANGULAR_SELECTION_MODE = "intersection"; //"intersection" or "containment"

const STAGE_PROPERTIES = {
	width: 600,
	height: 480,
};

const viewport = new Viewport(
	myCanvas,
	hitTestCanvas,
	STAGE_PROPERTIES,
	SHOW_HIT_REGION
);

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
