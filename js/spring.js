
function Spring({nodeA, nodeB}) {
	const This = this;
	this.nodeA = nodeA;
	this.nodeB = nodeB;
	
	this.targetLength = 2;
	this.springConstant = 50;

	this.calcForce = function(_node) {
		let other = getOtherNode(_node);
		let delta = other.position.difference(_node.position);
		let dx = delta.getLength() - this.targetLength;

		window.energy += this.springConstant * Math.pow(dx, 2) * .5;

		return delta.setLength(dx * -this.springConstant);
	}

	this.getOtherNode = getOtherNode;
	function getOtherNode(_node) {
		if (This.nodeA.id == _node.id) return This.nodeB;
		return This.nodeA;
	}
}