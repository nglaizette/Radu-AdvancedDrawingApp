/*function averagePoints(points){
	const sum = points.reduce((acc, p) => addPoints(acc, p), {x: 0, y:0});
	return {x: sum.x / points.length, y: sum.y / points.length };
}

function getMidPoint(points){
	const minX = Math.min(...points.map((p) => p.x));
	const maxX = Math.max(...points.map((p) => p.x));
	const minY = Math.min(...points.map((p) => p.y));
	const maxY = Math.max(...points.map((p) => p.y));

	return {x: minX + (maxX - minX) / 2, y: minY + (maxY - minY)/ 2};
}

function addPoints(p1, p2){
	return {x:p1.x + p2.x, y: p1.y + p2.y };
}

function subtractPoints(p1, p2){
	return {x:p1.x - p2.x, y: p1.y - p2.y };
}

function equalPoints(p1, p2){
	return p1.x === p2.x && p1.y === p2.y;
}*/

function getSize(points){
	const minX = Math.min(...points.map((p) => p.x));
	const maxX = Math.max(...points.map((p) => p.x));
	const minY = Math.min(...points.map((p) => p.y));
	const maxY = Math.max(...points.map((p) => p.y));
	return {
		width: maxX - minX,
		height: maxY - minY
	}
}

/**
 * Création d'un élément du DOM
 * @param {string} type : Type de DOM élément, eg. 'div', input, etc...
 * @param {Array<key: string, value: string>} attributes : Attributs de l'élément eg. 'onchange', 'title', etc...
 * @param {string} text : Texte de l'élément
 * @returns {HTMLElement} : L'élément DOM créé
 */

function createDOMElement(type, attributes, text) {
	const element = document.createElement(type);
	if (text) {
		element.innerText = text;
	}
	if (attributes) {
		Object.entries(attributes).forEach(([key, value]) => {
			element.setAttribute(key, value);
		});
	}

	return element;
}

/**
 * Création d'un élément de type "input" avec un label
 * @param {string} label : Texte du label
 * @param {Array<key: string, value: string>} attributes : Attributs de l'élément eg. 'onchange', 'title', etc...
 * @returns {HTMLElement} : Une div avec un label et un élément de type input
 */
function createInputWithLabel(labelText, attributes){
	const element = document.createElement("div");
	element.appendChild(
		createDOMElement("label", { for: attributes['id'] }, `${labelText}: `),
	);
	element.appendChild(
		createDOMElement("input", {
			id: labelText.toLowerCase(),
			title:  labelText,
			...attributes,
		}),
	);
	return element;
}

/**
 *  Get the property value of the input element.
 *  @ param {HTMLElement} element : The property input element
 * 	@ param {string} key : The element attribute
 * @ returns
 */
function getProperty(element, key){
	return Number(element.getAttribute(key));
}

/**
 * Set the property value of the input element.
 * @param {HTMLElement} element : The property input element
 * @param {string} key : The element attribute
 * @param {string} value : The element value
 */
function setProperty(element, key, value){
	element.setAttribute(key, value);
}

function getNumericValue(element){
	return Number(element.value);
}

function getValue(element){
	return element.value;
}

function setValue(element, value){
	element.value = value;
}
