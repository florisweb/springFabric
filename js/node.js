const nodeMass = 1;
const nodeRadius = .3;
const vectorScalar = .1;

function Node({position = new Vector(0, 0)}) {
	this.id = Symbol();
	this.springs = [];
	this.position = position;
	this.velocity = new Vector(0, 0);

	let nettoForce;
	this.update = function() {
		let gravity = new Vector(0, 9.81 * nodeMass);
		nettoForce = new Vector(0, 0); // Gravity;

		

		for (let spring of this.springs)
		{
			let springForce = spring.calcForce(this);
			nettoForce.add(springForce);
			
			if (Renderer.settings.drawForces)
			{
				Renderer.drawVector({
					start: this.position.copy().add(new Vector(-.2, 0)),
					delta: springForce.copy().scale(vectorScalar),
					color: '#0f0'
				});
			}
		}
		

		// let friction = this.velocity.copy().setLength(-.001);
		let friction = this.velocity.copy().scale(-.99);
		nettoForce.add(friction);
		nettoForce.add(gravity);

		if (!Renderer.settings.drawForces) return;
		
		Renderer.drawVector({
			start: this.position.copy().add(new Vector(.2, 0)),
			delta: gravity.copy().scale(vectorScalar),
			color: '#00f'
		});
	
		Renderer.drawVector({
			start: this.position,
			delta: nettoForce.copy().scale(vectorScalar),
			color: '#f00'
		});
	}

	this.applyUpdate = function(_dt) {
		this.velocity.add(nettoForce.scale(_dt / nodeMass));
		this.position.add(this.velocity.copy().scale(_dt));
	}

	this.tie = function(_other) {
		let spring = new Spring({nodeA: this, nodeB: _other});
		this.springs.push(spring);
		_other.springs.push(spring);
		return this;
	}
}

function FixedNode({position = new Vector(0, 0)}) {
	Node.call(this, arguments[0]);
	this.isFixed = true;

	this.update = () => {};
	this.applyUpdate = () => {};
}




