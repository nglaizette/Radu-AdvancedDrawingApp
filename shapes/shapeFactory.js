class ShapeFactory {
	static #available = {
		Path: {shape: Path },
		Rect: {shape: Rect },
		Oval: {shape: Oval },
		Text: {shape: Text },
		MyImage: {shape: MyImage },
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