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
ctx.fillRect(stageProperties.left, stageProperties.top, stageProperties.width, stageProperties.height);

const path = [];

myCanvas.addEventListener('pointerdown', function(e){
	const mousePosition = {
		x: e.offsetX,
		y: e.offsetY
	};
	path.push(mousePosition);
});

myCanvas.addEventListener('pointermove', function(e){
	const mousePosition = {
		x: e.offsetX,
		y: e.offsetY
	};
	console.log(mousePosition.x);
	path.push(mousePosition);
});

myCanvas.addEventListener('pointerup', function(e){
	ctx.beginPath();
	ctx.moveTo(path[0].x, path[0].y);
	path.forEach((point)=>{
		ctx.lineTo(point.x, point.y)
	});
	ctx.stroke();
	//drawPath();
});