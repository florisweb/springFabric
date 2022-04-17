

function _InputHandler(_canvas) {
	const This = this;
	this.dragProtectionEnabled = false;
	let dragging = false;
	let targetNode = false;
	let curHoverString = false;
	const maxNodeDragDistanceSquared = Math.pow(2, 2);
	const maxNodeCutDistanceSquared = Math.pow(.5, 2);
	const springConstant = 1000;

	let mousedown = false;


	window.addEventListener('mousedown', function(_e) {
		let pxPos = eventToPxCoord(_e);
		let pos = Renderer.camera.pxToWorldCoord(pxPos);
		mousedown = true;

		if (UI.curTool != 'drag') return;

		let nodeSet = getNodeSetByPos(pos);
		if (!nodeSet) return;
		targetNode = nodeSet.node;
		targetNode.isFixed = true;
		dragging = true;
		This.dragProtectionEnabled = true;
	});

	window.addEventListener('mouseup', function(_e) {
		dragging = false;
		mousedown = false;


		if (UI.curTool != 'drag') return;
		if (!targetNode) return;
		targetNode.isFixed = false;
		targetNode = false;
		setTimeout(() => This.dragProtectionEnabled = false, 500);
	});

	let curMousePos;
	_canvas.addEventListener('mousemove', function(_e) {
		let pxPos = eventToPxCoord(_e);
		curMousePos = Renderer.camera.pxToWorldCoord(pxPos);


		if (UI.curTool != 'cut') return;
		let springSet = getSpringSetByPos(curMousePos);
		if (curHoverString) curHoverString.hightlight = false;
		if (!springSet) return curHoverString = false;
		curHoverString = springSet.spring;
		curHoverString.hightlight = true;
	});

	this.update = function() {
		if (UI.curTool == 'cut' && mousedown && curHoverString)
		{
			curHoverString.cut();
			curHoverString = false;
		}

		if (UI.curTool != 'drag' || !dragging) return;
		let delta = targetNode.position.difference(curMousePos);
		let dragForce = delta.setLength(.5 * springConstant * delta.dotProduct(delta));
		targetNode.nettoForce.add(dragForce);		
	}



	function getNodeSetByPos(_pos) {
		let results = getSortedNodeSets(_pos);
		if (!results[0]) return false;
		return results[0];
	}

	function getSpringSetByPos(_pos) {
		let nodeSets = getSortedNodeSets(_pos, maxNodeCutDistanceSquared);

		let springSets = [];

		for (let nodeSet of nodeSets)
		{
			for (let spring of nodeSet.node.springs)
			{
				let otherNode = spring.getOtherNode(nodeSet.node);
				let delta = _pos.difference(otherNode.position);
				let distanceSquared = delta.dotProduct(delta);
				springSets.push({
					spring: spring,
					score: nodeSet.distanceSquared + distanceSquared,
				});
			}
		}

		let results = springSets.sort((a, b) => a.score > b.score);
		if (!results[0]) return false;
		return results[0];
	}


	function getSortedNodeSets(_pos, _maxRangeSquared = maxNodeDragDistanceSquared) {
		let nodeSets = []
		for (let node of Simulation.nodes)
		{
			if (node.isFixed) continue;
			let delta = _pos.difference(node.position);
			let distanceSquared = delta.dotProduct(delta);
			if (distanceSquared > _maxRangeSquared) continue;
			nodeSets.push({
				distanceSquared: distanceSquared,
				delta: delta,
				node: node
			});
		}
		return nodeSets.sort((a, b) => a.distanceSquared > b.distanceSquared);
	}


	function eventToPxCoord(_e) {
		return new Vector(
			_e.offsetX / _canvas.offsetWidth * _canvas.width,
			_e.offsetY / _canvas.offsetHeight * _canvas.height
		)
	}
}