class PropertiesPanel {
	constructor(holderDiv){
		this.holderDiv = holderDiv;
		this.holderDiv.innerHTML = "Properties";
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(
			createInputWithLabel("X", {
				type: "number",
				onchange: "PropertiesPanel.changeX(this.value)",
			}),
		);
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(
			createInputWithLabel("Y", {
				type: "number",
				onchange: "PropertiesPanel.changeY(this.value)",
			}),
		);
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(
			createInputWithLabel("Width", {
				type: "number",
				onchange: "PropertiesPanel.changeWidth(this.value)",
			}),
		);
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(
			createInputWithLabel("Height", {
				type: "number",
				onchange: "PropertiesPanel.changeHeight(this.value)",
			}),
		);
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(
			createDOMElement("input", {
				id: "fillColor",
				onchange: "PropertiesPanel.changeFillColor(this.value)",
				oninput: "PropertiesPanel.previewFillColor(this.value)",
				title: "Fill Color",
				type: "color",
				value: "#ff0000",
			}),
		);
		this.holderDiv.appendChild(
			createDOMElement("input", {
				id: "fill",
				checked: true,
				onchange: "PropertiesPanel.changeFill(this.checked)",
				title: "Fill",
				type: "checkbox",
			}),
		);
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(
			createDOMElement("input", {
				id: "strokeColor",
				onchange: "PropertiesPanel.changeStrokeColor(this.value)",
				oninput: "PropertiesPanel.previewStrokeColor(this.value)",
				title: "Stroke Color",
				type: "color",
				value: "#0000ff",
			}),
		);
		this.holderDiv.appendChild(
			createDOMElement("input", {
				id: "stroke",
				checked: true,
				onchange: "PropertiesPanel.changeStroke(this.checked)",
				title: "Stroke",
				type: "checkbox",
			}),
		);

		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(
			createDOMElement("input", {
				id: "strokeWidth",
				max: "100",
				min: "1",
				onchange: "PropertiesPanel.changeStrokeWidth(this.value)",
				oninput: "PropertiesPanel.previewStrokeWidth(this.value)",
				title: "Stroke Width",
				type: "range",
				value: "5",
			}),
		);
		this.holderDiv.appendChild(createDOMElement("br"));
		this.holderDiv.appendChild(
			createDOMElement("input", {
				id: "text",
				onInput: "PropertiesPanel.changeText(this.value)",
				title: "Text",
				type: "text",
				value: "Enter text here",
			}),
		);
		this.holderDiv.appendChild(createDOMElement("br"));
	}

	static changeX(value) {
		shapes.filter((s) => s.selected).forEach((s) => 
			s.center.x = Number(value) + stageProperties.left
		);
		drawShapes(shapes);
		updateHistory(shapes);
	}

	static changeY(value) {
		shapes.filter((s) => s.selected).forEach((s) => 
			s.center.y = Number(value) + stageProperties.top
		);
		drawShapes(shapes);
		updateHistory(shapes);
	}
	
	static changeWidth(value) {
		const fixedValue = Math.max(Number(value), 1);
		width.value = fixedValue;
		shapes.filter((s) => s.selected).forEach((s) => 
			s.setWidth(fixedValue)
		);
		drawShapes(shapes);
		updateHistory(shapes);
	}
	
	static changeHeight(value) {
		const fixedValue = Math.max(Number(value), 1);
		width.value = fixedValue;
		shapes.filter((s) => s.selected).forEach((s) => 
			s.setHeight(fixedValue)
		);
		drawShapes(shapes);
		updateHistory(shapes);
	}

	static previewFillColor(value){
		//console.log(value);
		shapes.filter(s=>s.selected).forEach(s=>s.options.fillColor=value);
		drawShapes(shapes);
	}

	static changeFillColor(value){
		PropertiesPanel.previewFillColor(value);
		updateHistory(shapes);
	}
	
	static changeFill(value){
		//console.log(value);
		shapes.filter(s=>s.selected).forEach(s=>s.options.fill=value);
		drawShapes(shapes);
		updateHistory(shapes);
	}
	
	static changeStrokeColor(value){
		//console.log(value);
		shapes.filter(s=>s.selected).forEach(s=>s.options.strokeColor=value);
		drawShapes(shapes);
		updateHistory(shapes);
	}

	static previewStrokeColor(value){
		//console.log(value);
		shapes.filter(s=>s.selected).forEach(s=>s.options.strokeColor=value);
		drawShapes(shapes);
	}
	
	static changeStroke(value){
		PropertiesPanel.previewStrokeColor(value);
		updateHistory(shapes);
	}
	
	static changeStrokeWidth(value) {
		PropertiesPanel.previewStrokeWidth(value);
		updateHistory(shapes);
	}

	static changeText(value){
		//console.log(value);
		shapes.filter((s)=> s.selected && s.text !== undefined).forEach((s) => s.setText(value));
		updateHistory(shapes);
		drawShapes(shapes);
	}


	static previewStrokeWidth(value) {
		//console.log(Number(value));
		shapes.filter(s=>s.selected).forEach(s=>s.options.strokeWidth=Number(value));
		drawShapes(shapes);
	}

	static reset(){
		x.value = "";
		y.value = "";
		width.value = "";
		height.value = "";
		text.value = "";
		x.placeholder = "";
		y.placeholder = "";
		width.placeholder = "";
		height.placeholder = "";
	}

	static updateDisplay(selectedShapes) {
		if(selectedShapes.length === 0) {
			PropertiesPanel.reset();
			return;
		}
	
		let newProperties = null;

		for(const shape of selectedShapes){
			if(newProperties === null){
				newProperties = {
					x: shape.center.x - stageProperties.left,
					y: shape.center.y - stageProperties.top,
					width: shape.size.width,
					height: shape.size.height,
					fillColor: shape.options.fillColor,
					fill: shape.options.fill,
					strokeColor: shape.options.strokeColor,
					stroke: shape.options.stroke,
					strokeWidth: shape.options.strokeWidth,
					text: shape.text
				};
			} else {
				if(newProperties.x !== shape.center.x - stageProperties.left){
					newProperties.x = null;
				}
				if(newProperties.y !== shape.center.y - stageProperties.top){
					newProperties.y = null;
				}
				if(newProperties.width !== shape.size.width){
					newProperties.width = null;
				}
				if(newProperties.height !== shape.size.height){
					newProperties.height = null;
				}
				if(newProperties.fillColor !== shape.options.fillColor){
					newProperties.fillColor = null;
				}
				if(newProperties.fill !== shape.options.fill){
					newProperties.fill = null;
				}
				if(newProperties.strokeColor !== shape.options.strokeColor){
					newProperties.strokeColor = null;
				}
				if(newProperties.stroke !== shape.options.stroke){
					newProperties.stroke = null;
				}
				if(newProperties.strokeWidth !== shape.options.strokeWidth){
					newProperties.strokeWidth = null;
				}
				if(newProperties.text !== shape.text){
					newProperties.text = null;
				}
			}
		}
		if(newProperties === null){
			return;
		} else {
			
			x.value = newProperties.x ? Math.round(newProperties.x) : "";
			y.value = newProperties.y ? Math.round(newProperties.y) : "";
			width.value = newProperties.width ? Math.round(newProperties.width) : "";
			height.value = newProperties.height ? Math.round(newProperties.height) : "";
			fillColor.value = newProperties.fillColor ? newProperties.fillColor : "";
			fill.checked = newProperties.fill ?newProperties.fill : false;
			strokeColor.value = newProperties.strokeColor ? newProperties.strokeColor : "";
			stroke.checked = newProperties.stroke ? newProperties.stroke : false;
			strokeWidth.value = newProperties.strokeWidth ? newProperties.strokeWidth : "";
			text.value = newProperties.text ? newProperties.text : "";

			const placeholderText = "Multiple values";
			x.placeholder = newProperties.x ? "" : placeholderText;
			y.placeholder = newProperties.y ? "" : placeholderText;
			width.placeholder = newProperties.width ? "" : placeholderText;
			height.placeholder = newProperties.height ? "" : placeholderText;
			text.placeholder = newProperties.text ? "" : placeholderText;
			//fillColor.placeholder = newProperties.fillColor?"":placeholderText;
			//strokeColor.placeholder = newProperties.strokeColor?"":placeholderText;
			//fill.checked = newProperties.fill?"":placeholderText;
			//stroke.checked = newProperties.stroke?"":placeholderText;
			//strokeWidth.value = newProperties.strokeWidth?"":placeholderText;
		}
	}
}




