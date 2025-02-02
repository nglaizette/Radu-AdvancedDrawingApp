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

		holderDiv.appendChild(createDOMElement("button", {id: "saveBtn", onclick: "DocumentTools.save()"}, "Save"));
		holderDiv.appendChild(createDOMElement("br"));
		holderDiv.appendChild(createDOMElement("button", {id: "loadBtn", onclick: "DocumentTools.load()"}, "Load"));
		holderDiv.appendChild(createDOMElement("br"));
		holderDiv.appendChild(createDOMElement("button", {id: "exportBtn", onclick: "DocumentTools.do_export()"}, "Export"));
	}

	#addEditTools(holderDiv) {
		holderDiv.appendChild(createDOMElement("div", {id: "historyToolsHeader"}, "History"));

		holderDiv.appendChild(createDOMElement("button", {id: "undoBtn", onclick: "HistoryTools.undo()"}, "Undo"));
		holderDiv.appendChild(createDOMElement("br"));
		holderDiv.appendChild(createDOMElement("button", {id: "redoBtn", onclick: "HistoryTools.redo()"}, "Redo"));
	}

	#addShapeTools(holderDiv){
		holderDiv.appendChild(createDOMElement("div", {id: "shapeToolsHeader"}, "Shape tools"));
		holderDiv.appendChild(
			createInputWithLabel("Path", {
				type: "radio",
				id: "pathRadio",
				name: "shapeTools",
				checked: "checked",
				onchange: "changeTool('path')"
			}),
		);

		holderDiv.appendChild(
			createInputWithLabel("Rect", {
				type: "radio",
				id: "rectRadio",
				name: "shapeTools",
				onchange: "changeTool('rect')"
			}),
		);

		holderDiv.appendChild(
			createInputWithLabel("Oval", {
				type: "radio",
				id: "ovalRadio",
				name: "shapeTools",
				onchange: "changeTool('oval')"
			}),
		);

		holderDiv.appendChild(
			createInputWithLabel("Text", {
				type: "radio",
				id: "textRadio",
				name: "shapeTools",
				onchange: "changeTool('text')"
			}),
		);

		holderDiv.appendChild(
			createInputWithLabel("Select", {
				type: "radio",
				id: "selectRadio",
				name: "shapeTools",
				onchange: "changeTool('select')"
			}),
		);
	}
}
