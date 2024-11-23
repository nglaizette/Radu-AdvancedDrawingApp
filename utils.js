function averagePoints(points){
	const sum = points.reduce((acc, p) => addPoints(acc, p), {x: 0, y:0});
	return {x: sum.x / points.length, y: sum.y / points.length };
}

function addPoints(p1, p2){
	return {x:p1.x + p2.x, y: p1.y + p2.y };
}

function substractPoints(p1, p2){
	return {x:p1.x - p2.x, y: p1.y - p2.y };
}

