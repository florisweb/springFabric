

function _InputHandler(_canvas) {
	let dragging = false;
	let targetNode = false;
	const maxNodeDistanceSquared = Math.pow(2, 2);
	const springConstant = 1000;

	window.addEventListener('mousedown', function(_e) {
		let pxPos = eventToPxCoord(_e);
		let pos = Renderer.camera.pxToWorldCoord(pxPos);

		let nodeSet = getNodeSetByPos(pos);
		if (!nodeSet) return;
		targetNode = nodeSet.node;
		targetNode.isFixed = true;
		dragging = true;
	});

	window.addEventListener('mouseup', function(_e) {
		dragging = false;
		if (!targetNode) return;
		targetNode.isFixed = false;
		targetNode = false;
	});

	let curMousePos;
	_canvas.addEventListener('mousemove', function(_e) {
		let pxPos = eventToPxCoord(_e);
		curMousePos = Renderer.camera.pxToWorldCoord(pxPos);
	});

	this.update = function() {
		if (!dragging) return;

		let delta = targetNode.position.difference(curMousePos);

		let dragForce = delta.setLength(.5 * springConstant * delta.dotProduct(delta));
		targetNode.nettoForce.add(dragForce);		

	}



	function getNodeSetByPos(_pos) {
		let nodeSet = []
		for (let node of Simulation.nodes)
		{
			if (node.isFixed) continue;
			let delta = _pos.difference(node.position);
			let distanceSquared = delta.dotProduct(delta);
			if (distanceSquared > maxNodeDistanceSquared) continue;
			nodeSet.push({
				distanceSquared: distanceSquared,
				delta: delta,
				node: node
			});
		}
		let result = nodeSet.sort((a, b) => a.distanceSquared > b.distanceSquared);
		if (!result[0]) return false;
		return result[0];
	}


	function eventToPxCoord(_e) {
		return new Vector(
			_e.offsetX / _canvas.offsetWidth * _canvas.width,
			_e.offsetY / _canvas.offsetHeight * _canvas.height
		)
	}
}