
function Spring({nodeA, nodeB}) {
	const This 	= this;
	this.nodeA 	= nodeA;
	this.nodeB 	= nodeB;
	this.id 	= Symbol();
	this.targetLength = scale;
	this.springConstant = 1000;

	this.calcForce = function(_node) {
		let other = getOtherNode(_node);
		let delta = other.position.difference(_node.position);
		let dx = delta.getLength() - this.targetLength;

		return delta.setLength(dx * -this.springConstant);
	}
	this.cut = function() {
		let indexA = this.nodeA.springs.findIndex((_string) => _string.id == this.id);
		this.nodeA.springs.splice(indexA, 1);
		
		let indexB = this.nodeB.springs.findIndex((_string) => _string.id == this.id);
		this.nodeB.springs.splice(indexB, 1);
	}

	this.getOtherNode = getOtherNode;
	function getOtherNode(_node) {
		if (This.nodeA.id == _node.id) return This.nodeB;
		return This.nodeA;
	}
}