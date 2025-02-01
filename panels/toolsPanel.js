class ToolsPanel {
	constructor(holderDiv){

		this.#addDocumentTools(holderDiv);
		holderDiv.appendChild(createDOMElement("hr"));

		this.#addEditTools(holderDiv);
		holderDiv.appendChild(createDOMElement("hr"));

		this.#addShapeTools(holderDiv);
		holderDiv.appendChild(createDOMElement("hr"));
	}

	#addDocumentTools(holderDiv) {
		holderDiv.appendChild(createDOMElement("div", {id: "documentToolsHeader"}, "Document"));

		holderDiv.appendChild(createDOMElement("button", {id: "saveBtn"}, "Save"));
		holderDiv.appendChild(createDOMElement("br"));
		holderDiv.appendChild(createDOMElement("button", {id: "loadBtn"}, "Load"));
		holderDiv.appendChild(createDOMElement("br"));
		holderDiv.appendChild(createDOMElement("button", {id: "exportBtn"}, "Export"));
	}

	#addEditTools(holderDiv) {
		holderDiv.appendChild(createDOMElement("div", {id: "editToolsHeader"}, "Edit"));

		holderDiv.appendChild(createDOMElement("button", {id: "undoBtn"}, "Undo"));
		holderDiv.appendChild(createDOMElement("br"));
		holderDiv.appendChild(createDOMElement("button", {id: "redoBtn"}, "Redo"));
	}

	#addShapeTools(holderDiv){
		holderDiv.appendChild(createDOMElement("div", {id: "shapeToolsHeader"}, "Shape tools"));
		holderDiv.appendChild(
			createInputWithLabel("Path", {
				type: "radio",
				id: "pathTool",
				name: "shapeTools",
				checked: "checked",
			}),
		);

		holderDiv.appendChild(
			createInputWithLabel("Rect", {
				type: "radio",
				id: "rectTool",
				name: "shapeTools",
			}),
		);

		holderDiv.appendChild(
			createInputWithLabel("Oval", {
				type: "radio",
				id: "ovalTool",
				name: "shapeTools",
			}),
		);

		holderDiv.appendChild(
			createInputWithLabel("Text", {
				type: "radio",
				id: "textTool",
				name: "shapeTools",
			}),
		);

		holderDiv.appendChild(
			createInputWithLabel("Select", {
				type: "radio",
				id: "selectTool",
				name: "shapeTools",
			}),
		);
	}
} 