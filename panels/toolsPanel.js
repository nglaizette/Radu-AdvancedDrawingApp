class ToolsPanel {
	constructor(holderDiv){
		this.holderDiv = holderDiv;

		this.holderDiv.appendChild(createDOMElement("div", {id: "documentToolsHeader"}, "Document"));

		this.holderDiv.appendChild(createDOMElement("button", {id: "saveBtn"}, "Save"));
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(createDOMElement("button", {id: "loadBtn"}, "Load"));
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(createDOMElement("button", {id: "exportBtn"}, "Export"));

		this.holderDiv.appendChild(createDOMElement("hr"));

		this.holderDiv.appendChild(createDOMElement("div", {id: "shapeToolsHeader"}, "Shape tools"));
		this.holderDiv.appendChild(
			createInputWithLabel("Path", {
				type: "radio",
				id: "pathTool",
				name: "shapeTools",
			}),
		);

		this.holderDiv.appendChild(
			createInputWithLabel("Rect", {
				type: "radio",
				id: "rectTool",
				name: "shapeTools",
			}),
		);

		this.holderDiv.appendChild(
			createInputWithLabel("Oval", {
				type: "radio",
				id: "ovalTool",
				name: "shapeTools",
			}),
		);

		this.holderDiv.appendChild(
			createInputWithLabel("Text", {
				type: "radio",
				id: "textTool",
				name: "shapeTools",
			}),
		);

		this.holderDiv.appendChild(
			createInputWithLabel("Select", {
				type: "radio",
				id: "selectTool",
				name: "shapeTools",
			}),
		);

		this.holderDiv.appendChild(createDOMElement("hr"));
	}
} 