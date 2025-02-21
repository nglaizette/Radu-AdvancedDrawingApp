class MyImageTool {
	static addPointerDownListener(e){

	}

	static configureEventListeners() {
		viewport.canvas.addEventListener("pointerdown", this.addPointerDownListener);
	}

	static removeEventListeners() {
		viewport.canvas.removeEventListener("pointerdown", this.addPointerDownListener);
	}
}

ShapeFactory.registerShape(MyImage, "MyImage");