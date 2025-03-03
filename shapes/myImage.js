class MyImage extends Shape {
	constructor(img, options){
		super(options);
		this.img = img;

		this.size = {width: img.width, height: img.height};

		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = img.width;
		tmpCanvas.height = img.height;
		const tmpCtx = tmpCanvas.getContext("2d");
		tmpCtx.drawImage(img, 0, 0);
		this.base64 = tmpCanvas.toDataURL();
	}

	static load(data){
		const myImage = new MyImage(new Image());
		myImage.id = data.id;
		myImage.img.src = data.base64;
		myImage.base64 = data.base64;
		myImage.options = JSON.parse(JSON.stringify(data.options));
		myImage.center = Vector.load(data.center);
		myImage.size = data.size;
		myImage.selected = data.selected;
		return myImage;
	}

	serialize(){
		return {
			type: "MyImage",
			id: this.id,
			options: JSON.parse(JSON.stringify(this.options)),
			center: this.center,
			size: this.size,
			base64: this.base64,
			selected: this.selected
		};
	}



	getPoints() {
		return [
			new Vector( -this.size.width/2, -this.size.height/2),
			new Vector( -this.size.width/2,  this.size.height/2),
			new Vector(  this.size.width/2,  this.size.height/2),
			new Vector(  this.size.width/2, -this.size.height/2),
		]
	}

	setWidth(width) {
		this.size.width = width;
	}

	setHeight(height) {
		this.size.height = height;
	}

	draw(ctx, isHitRegion = false){
		const center = this.center? this.center:{x:0, y:0}
		let left, top, width, height;

		left = center.x - this.size.width / 2;
		top = center.y - this.size.height / 2;
		width = this.size.width;
		height = this.size.height;

		if(isHitRegion){
			ctx.beginPath();
			ctx.rect(left, top, width, height);
			this.applyHitRegionStyle(ctx);
		} else {
			ctx.save();
			ctx.translate(center.x, center.y);
			ctx.scale(Math.sign(width), Math.sign(height));
			ctx.beginPath();
			ctx.drawImage(this.img, -width/2.0, -height / 2.0, width, height);
			this.applyStyle(ctx);
			ctx.restore();
		}
	}

	/*static addPointerDownListener(e){
		const mousePosition = new Vector(e.offsetX,e.offsetY);
		currentShape = new Rect(mousePosition, PropertiesPanel.getValues());
	
		const moveCallback = function(e){
			const mousePosition = new Vector(e.offsetX,e.offsetY);
			currentShape.setCorner2(mousePosition);
			viewport.drawShapes([...shapes, currentShape]);
		};
	
		const upCallback = function (e) {
			viewport.canvas.removeEventListener('pointermove', moveCallback);
			viewport.canvas.removeEventListener('pointerup', upCallback);
	
			currentShape.recenter();
			shapes.push(currentShape);

			HistoryTools.record(shapes);
		}
	
		viewport.canvas.addEventListener('pointermove', moveCallback);
		viewport.canvas.addEventListener('pointerup', upCallback);
	}*/
}