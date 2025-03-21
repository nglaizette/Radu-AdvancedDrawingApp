class ToolsPanel {
	constructor(holderDiv) {
		this.#addDocumentTools(holderDiv);
		holderDiv.appendChild(createDOMElement("hr"));

		this.#addEditingTools(holderDiv);
		holderDiv.appendChild(createDOMElement("hr"));

		this.#addHistoryTools(holderDiv);
		holderDiv.appendChild(createDOMElement("hr"));

		this.#addCanvasTools(holderDiv);
		holderDiv.appendChild(createDOMElement("hr"));

		// add event listener for tool selection
		viewport.addEventListener("toolSelected", (e) => this.#selectToolComponent(e.detail));
	}

	#addDocumentTools(holderDiv) {
		holderDiv.appendChild(
			createDOMElement("div", { id: "documentToolsHeader" }, "Document")
		);

		holderDiv.appendChild(
			createDOMElement(
				"button",
				{ id: "saveBtn", title: "Save", class:"tool-button", onclick: "DocumentTools.save()" },
				"Save"
			)
		);
		holderDiv.appendChild(
			createDOMElement(
				"button",
				{ id: "loadBtn", title: "Load", class:"tool-button", onclick: "DocumentTools.load()" },
				"Load"
			)
		);

		holderDiv.appendChild(
			createDOMElement(
				"button",
				{ id: "exportBtn", title: "Export", class:"tool-button", onclick: "DocumentTools.do_export()" },
				"Export"
			)
		);
	}

	#addEditingTools(holderDiv) {
		holderDiv.appendChild(
			createDOMElement("div", { id: "editingToolsHeader" }, "Editing")
		);

		holderDiv.appendChild(
			createDOMElement(
				"button",
				{ id: "duplicateBtn", title: "Duplicate", class:"tool-button", onclick: "EditingTools.duplicate()" },
				"Duplicate"
			)
		);

		holderDiv.appendChild(
			createDOMElement(
				"button",
				{ id: "selectAllBtn", title: "Select All", class:"tool-button", onclick: "EditingTools.selectAll()" },
				"Select All"
			)
		);
	

		holderDiv.appendChild(
			createDOMElement(
				"button",
				{ id: "deleteBtn", title: "Delete", class:"tool-button", onclick: "EditingTools.delete()" },
				"Delete"
			)
		);

		//holderDiv.appendChild(createDOMElement("button", {id: "exportBtn", onclick: "DocumentTools.do_export()"}, "Export"));
	}

	#addHistoryTools(holderDiv) {
		holderDiv.appendChild(
			createDOMElement("div", { id: "historyToolsHeader" }, "History")
		);

		holderDiv.appendChild(
			createDOMElement(
				"button",
				{ id: "undoBtn", title: "Undo", class:"tool-button", onclick: "HistoryTools.undo()" },
				"Undo"
			)
		);

		holderDiv.appendChild(
			createDOMElement(
				"button",
				{ id: "redoBtn", title: "Redo", class:"tool-button", onclick: "HistoryTools.redo()" },
				"Redo"
			)
		);
	}

	#addCanvasTools(holderDiv) {
		holderDiv.appendChild(
			createDOMElement("div", { id: "shapeToolsHeader" }, "Shape tools")
		);

		for (let tool of CanvasTools.tools) {
			if (!tool.showButton) continue;

			holderDiv.appendChild(
				createInputWithLabel(
					String(tool.name).charAt(0).toUpperCase() + String(tool.name).slice(1),
					{
						type: "radio",
						id: tool.name.toLowerCase() + "Radio",
						name: "CanvasTools",
						onchange: `CanvasTools.selectTool("${tool.name}")`,
					}
				)
			);
		}
		const selectedTool = CanvasTools.selectTool("Path");

		// Check the radio button for the selected tool
		if(selectedTool){
			this.#selectToolComponent(selectedTool);
		}
	}

	#selectToolComponent(tool){
		document.getElementById(tool.name.toLowerCase() + "Radio").checked = true;
	}
}
