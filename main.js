const SHOW_HIT_REGION = false;
const RECTANGULAR_SELECTION_MODE = "intersection"; //"intersection" or "containment"

const STAGE_PROPERTIES = {
	width: 600,
	height: 480,
};

const viewport = new Viewport(
	canvasHolder,
	STAGE_PROPERTIES,
	SHOW_HIT_REGION
);

let shapes = [];
let gizmos = [];
let currentShape = null;
let clipboard = null;

const propertiesPanel = new PropertiesPanel(propertiesHolder);
const toolsPanel = new ToolsPanel(toolsHolder);
