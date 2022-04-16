
function Spring({nodeA, nodeB}) {
	const This 	= this;
	this.nodeA 	= nodeA;
	this.nodeB 	= nodeB;
	this.id 	= Symbol();
	this.targetLength 	= scale;
	this.springConstant = 1000;
	this.breakingPoint 	= 10; // Percentage of targetLength

	this.calcForce = function(_node) {
		let other = getOtherNode(_node);
		let delta = other.position.difference(_node.position);
		let dx = delta.getLength() - this.targetLength;
		if (
			Simulation.settings.enableSpringBreaking && 
			!InputHandler.dragProtectionEnabled && 
			Math.abs(dx) > this.targetLength * this.breakingPoint
		) {
			this.cut();
			setTimeout(() => Simulation.removeUnUsedNodes(), 1000); // Clear nodes that might have fallen out of the world
		}

		return delta.setLength(dx * -this.springConstant);
	}
	this.cut = function() {
		let indexA = this.nodeA.springs.findIndex((_string) => _string.id == this.id);
		this.nodeA.springs.splice(indexA, 1);
		
		let indexB = this.nodeB.springs.findIndex((_string) => _string.id == this.id);
		this.nodeB.springs.splice(indexB, 1);
	}

	function getOtherNode(_node) {
		if (This.nodeA.id == _node.id) return This.nodeB;
		return This.nodeA;
	}
}