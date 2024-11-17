const canvasProperties={
	width: window.innerWidth,
	height: window.innerHeight,
	center: {
		x: window.innerWidth/2,
		y: window.innerHeight/2
	}
}

const stageProperties={
	width: 600,
	height: 480,
	left: canvasProperties.center.x-600/2,
	top: canvasProperties.center.y - 480/2
}

myCanvas.width = canvasProperties.width;
myCanvas.height = canvasProperties.height;

const ctx = myCanvas.getContext('2d');
clearCanvas();

const shapes = [];
let path = [];
path.type="path";
let rectangle = {type: "rect"};

const downCallbackForRect = function (e){
	const mousePosition = {
		x: e.offsetX,
		y: e.offsetY
	};
	rectangle.corner1 = mousePosition;

	const moveCallback = function(e){
		const mousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
		rectangle.corner2 = mousePosition

		clearCanvas();
		drawShapes([...shapes, rectangle]);
	};

	const upCallback = function (e) {
		myCanvas.removeEventListener('pointermove', moveCallback);
		myCanvas.removeEventListener('pointerup', upCallback);

		shapes.push(rectangle);
		rectangle = {type: "rect"};
	}

	myCanvas.addEventListener('pointermove', moveCallback);
	myCanvas.addEventListener('pointerup', upCallback);
}

const downCallbackForPath = function(e){
	const mousePosition = {
		x: e.offsetX,
		y: e.offsetY
	};
	path.push(mousePosition);

	const moveCallback = function(e){
		const mousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
		//console.log(mousePosition.x);
		path.push(mousePosition);

		clearCanvas();
		drawShapes([...shapes, path]);
	};

	const upCallback = function (e) {
		myCanvas.removeEventListener('pointermove', moveCallback);
		myCanvas.removeEventListener('pointerup', upCallback);

		shapes.push(path);
		path = [];
		path.type="path";
	}

	myCanvas.addEventListener('pointermove', moveCallback);
	myCanvas.addEventListener('pointerup', upCallback);
}


myCanvas.addEventListener('pointerdown', downCallbackForPath);

function changeTool(tool){
	//console.log(info);
	myCanvas.removeEventListener('pointerdown', downCallbackForPath);
	myCanvas.removeEventListener('pointerdown', downCallbackForRect);

	switch(tool){
		case "rect":
			myCanvas.addEventListener('pointerdown', downCallbackForRect);
			break;
		case "path":
			myCanvas.addEventListener('pointerdown', downCallbackForPath);
			break;		
	}
}

function drawShapes(shapes){
	for(const shape of shapes){

		switch(shape.type){
			case "rect":
				ctx.beginPath();
				ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
				ctx.lineWidth = 5;
				const rect = shape
				const minX = Math.min(rect.corner1.x, rect.corner2.x);
				const minY = Math.min(rect.corner1.y, rect.corner2.y);
				const width = Math.abs(rect.corner1.x - rect.corner2.x);
				const height = Math.abs(rect.corner1.y - rect.corner2.y);
				ctx.rect(minX, minY, width, height);
				ctx.stroke();
				break;
			
			case "path":
				ctx.beginPath();
				ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
				ctx.lineWidth = 5;
				ctx.moveTo(shape[0].x, shape[0].y);
				for(let i = 1; i < shape.length; i++){
						ctx.lineTo(shape[i].x, shape[i].y);
					}
				ctx.stroke();
				break;
		}
	};
}

function clearCanvas(){
	ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
	ctx.fillStyle="gray";
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

	ctx.fillStyle="white";
	ctx.fillRect(stageProperties.left, stageProperties.top, stageProperties.width, stageProperties.height);
}

