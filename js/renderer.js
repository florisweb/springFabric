
function _Renderer(_canvas) {
	const Canvas = _canvas;
	const ctx = Canvas.getContext('2d');
	this.settings = {
		drawForces: false,
	}

	this.render = function() {
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
		for (let node of Simulation.nodes) drawNode(node);

	}
	
	const WorldWidth = 20;
	const PxToWorld = _canvas.width / WorldWidth;
	const nodePxRadius = nodeRadius * PxToWorld;
	function drawNode(_node) {
		let pos = _node.position.copy().scale(PxToWorld);
		ctx.fillStyle = '#555';
		if (_node.isFixed) ctx.fillStyle = '#f00';
		ctx.beginPath();
		ctx.fillRect(pos.value[0] - nodePxRadius, pos.value[1] - nodePxRadius, nodePxRadius * 2, nodePxRadius * 2);
		ctx.closePath();
		ctx.fill();

		for (let spring of _node.springs) drawSpring(spring);
	}

	function drawSpring(_spring) {
		let posA = _spring.nodeA.position.copy().scale(PxToWorld);
		let posB = _spring.nodeB.position.copy().scale(PxToWorld);

		ctx.strokeStyle = '#777';
		ctx.beginPath()
		ctx.moveTo(posA.value[0], posA.value[1]);
		ctx.lineTo(posB.value[0], posB.value[1]);
		ctx.closePath();
		ctx.stroke();
	}


	this.drawVector = function({start, delta, color = '#f00'}) {
		let posA = start.copy().scale(PxToWorld);
		let posB = start.copy().add(delta).scale(PxToWorld);

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