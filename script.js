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
ctx.fillStyle="gray";
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);



ctx.fillStyle="white";
ctx.fillRect(stageProperties.left, stageProperties.top, stageProperties.width, stageProperties.height)