
function Spring({nodeA, nodeB}) {
	const This = this;
	this.nodeA = nodeA;
	this.nodeB = nodeB;
	
	this.targetLength = scale;
	this.springConstant = 1000;

	this.calcForce = function(_node) {
		let other = getOtherNode(_node);
		let delta = other.position.difference(_node.position);
		let dx = delta.getLength() - this.targetLength;

		return delta.setLength(dx * -this.springConstant);
	}

	this.getOtherNode = getOtherNode;
	function getOtherNode(_node) {
		if (This.nodeA.id == _node.id) return This.nodeB;
		return This.nodeA;
	}
}