class ToolsPanel {
	constructor(holderDiv){
		this.holderDiv = holderDiv;
		this.holderDiv.innerHTML = "Shape tools";
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