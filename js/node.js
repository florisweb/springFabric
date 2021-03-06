const vectorScalar = .02;

function Node({position = new Vector(0, 0)}) {
	this.id = Symbol();
	this.springs = [];
	this.position = position;
	this.velocity = new Vector(0, 0);

	this.nettoForce = new Vector(0, 0);
	this.mass = 1;
	this.update = function(_updateCount) {
		let gravity = new Vector(0, 9.81 * this.mass);

		for (let spring of this.springs)
		{
			if (spring.lastCalcCount && spring.lastCalcCount >= _updateCount) continue;
			let springForce = spring.calcForce(this);
			this.nettoForce.add(springForce);
			spring.getOtherNode(this).nettoForce.add(springForce.copy().scale(-1));
			spring.lastCalcCount = _updateCount;
		}

		if (Renderer.settings.drawForces)
		{
			Renderer.cueVectorDraw({
				start: this.position.copy().add(new Vector(-.1, 0)),
				delta: this.nettoForce.copy().scale(vectorScalar),
				color: '#0f0'
			}, _updateCount);
		}
		

		let friction = this.velocity.copy().scale(-.999);
		this.nettoForce.add(friction);
		this.nettoForce.add(gravity);

		if (!Renderer.settings.drawForces) return;
		
		Renderer.cueVectorDraw({
			start: this.position.copy().add(new Vector(.1, 0)),
			delta: gravity.copy().scale(vectorScalar),
			color: '#00f'
		}, _updateCount);
	
		Renderer.cueVectorDraw({
			start: this.position,
			delta: this.nettoForce.copy().scale(vectorScalar),
			color: '#f00'
		}, _updateCount);
	}

	this.applyUpdate = function(_dt) {
		this.velocity.add(this.nettoForce.scale(_dt / this.mass));
		this.position.add(this.velocity.copy().scale(_dt));
		this.nettoForce = new Vector(0, 0); // Gravity;
	}

	this.tie = function(_other) {
		let spring = new Spring({nodeA: this, nodeB: _other});
		this.springs.push(spring);
		_other.springs.push(spring);
		Simulation.springs.push(spring);
		return this;
	}
}

function FixedNode({position = new Vector(0, 0)}) {
	Node.call(this, arguments[0]);
	this.isFixed = true;

	this.update = () => {};
	this.applyUpdate = () => {};
}




