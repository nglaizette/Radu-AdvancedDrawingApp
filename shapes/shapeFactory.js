class ShapeFactory {
	static #available = {
	}

	static registerShape(classType, typeName){
		this.#available[typeName] = { shape: classType };
	}

	static loadShape(shapeData){
		const chosenClass = this.#available[shapeData.type].shape;
		const shape = chosenClass.load(shapeData);
		return shape;
	}

	static loadShapes(data) {
		const loadedShapes = [];
		for (const shapeData of data) {
			const shape = this.loadShape(shapeData, STAGE_PROPERTIES);
			loadedShapes.push(shape);
		}
		return loadedShapes;
	}
}