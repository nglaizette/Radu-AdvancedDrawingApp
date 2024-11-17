class Shape{
	constructor(){
		// never deliberaly called
	}

	draw(ctx){
		throw new Error("draw method must be implemented");
	}
}