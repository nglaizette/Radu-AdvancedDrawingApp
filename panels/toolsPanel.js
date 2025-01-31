class ToolsPanel {
	constructor(holderDiv){
		this.holderDiv = holderDiv;
		this.holderDiv.innerHTML = "Tools";
		/*this.holderDiv.appendChild(
			createDOMElement("input", {
				id: "pathTool",
				checked: true,
				//onchange: "PropertiesPanel.changeFill(this.checked)",
				title: "Path",
				type: "radio",
			}))*/
			this.holderDiv.appendChild(
				createInputWithLabel("Path", {
					type: "radio",
					id: "pathTool",
				}),
			);

			this.holderDiv.appendChild(
				createInputWithLabel("Rect", {
					type: "radio",
					id: "rectTool",
				}),
			);

			this.holderDiv.appendChild(
				createInputWithLabel("Oval", {
					type: "radio",
					id: "ovalTool",
				}),
			);

			this.holderDiv.appendChild(
				createInputWithLabel("Text", {
					type: "radio",
					id: "textTool",
				}),
			);

			this.holderDiv.appendChild(
				createInputWithLabel("Select", {
					type: "radio",
					id: "selectTool",
				}),
			);
	}
} 