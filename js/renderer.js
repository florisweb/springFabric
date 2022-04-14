
function _Renderer(_canvas) {
	const Canvas = _canvas;
	const This = this;
	const ctx = Canvas.getContext('2d');

	this.settings = {
		drawForces: false,
	}
	this.camera = new _Renderer_camera(Canvas);

	this.render = function() {
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
		for (let node of Simulation.nodes) drawNode(node);
	}
	
	
	const nodePxRadius = nodeRadius * this.camera.getPxToWorldScalar();

	function drawNode(_node) {
		let pos = This.camera.worldToPxCoord(_node.position);
		ctx.fillStyle = '#555';
		if (_node.isFixed) ctx.fillStyle = '#f00';
		ctx.beginPath();
		ctx.fillRect(pos.value[0] - nodePxRadius, pos.value[1] - nodePxRadius, nodePxRadius * 2, nodePxRadius * 2);
		ctx.closePath();
		ctx.fill();

		for (let spring of _node.springs) drawSpring(spring);
	}

	function drawSpring(_spring) {
		let posA = This.camera.worldToPxCoord(_spring.nodeA.position);
		let posB = This.camera.worldToPxCoord(_spring.nodeB.position);

		ctx.strokeStyle = '#777';
		ctx.beginPath()
		ctx.moveTo(posA.value[0], posA.value[1]);
		ctx.lineTo(posB.value[0], posB.value[1]);
		ctx.closePath();
		ctx.stroke();
	}


	this.drawVector = function({start, delta, color = '#f00'}) {
		let posA = This.camera.worldToPxCoord(start);
		let posB = This.camera.worldToPxCoord(start.copy().add(delta));

		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.beginPath()
		ctx.moveTo(posA.value[0], posA.value[1]);
		ctx.lineTo(posB.value[0], posB.value[1]);
		ctx.closePath();
		ctx.stroke();
		ctx.lineWidth = 1;
	}
}	

function _Renderer_camera(_canvas) {
	const WorldWidth = 20;
	const PxToWorld = _canvas.width / WorldWidth;
	const WorldToPx = 1 / PxToWorld;

	this.getPxToWorldScalar = function() {
		return PxToWorld;
	}


	this.worldToPxCoord = function(_coord) {
		return _coord.copy().scale(PxToWorld);
	}
	this.pxToWorldCoord = function(_coord) {
		return _coord.copy().scale(WorldToPx);
	}

}