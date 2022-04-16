
let Renderer;
let InputHandler;
const Simulation = new function() {
	this.settings = {
		enableSpringBreaking: false
	}
	this.size = new Vector(20, 10);
	this.nodes = [];

	this.setup = function() {
		Renderer 		= new _Renderer(renderCanvas);
		InputHandler 	= new _InputHandler(renderCanvas);
		

		this.update();
		this.draw();
	}	
	this.speed = 1;

	const maxDtPerUpdateSet = 10;
	let prevFrame = new Date();


	this.updates = 0;
	this.update = function() {
		let dt = (new Date() - prevFrame) / 1000;
		if (dt > .01) dt = .01;

		let start = new Date();
		for (let i = 0; i < this.speed; i++)
		{
			this.updates++;
			for (let node of this.nodes)
			{
				node.update();
			}

			InputHandler.update();

			for (let node of this.nodes)
			{
				node.applyUpdate(dt);
			}
		}
		
		let delta = new Date() - start;
		if (delta > maxDtPerUpdateSet) 
		{
			let maxSpeed = maxDtPerUpdateSet * this.speed / delta;
			this.speed = maxSpeed;
			this.speed *= .9;
		}
		prevFrame = new Date();	
		setTimeout(() => Simulation.update(), 0);

		if (!calcingMaxSpeed) return;
		maxSpeedSum += maxDtPerUpdateSet * this.speed / delta;
		curMaxSpeedCounts++;
		if (curMaxSpeedCounts < 100) return;
		resolveSpeedCalcer(maxSpeedSum / 100);
	}

	let calcingMaxSpeed = false;
	let maxSpeedSum = 0;
	let curMaxSpeedCounts = 0;
	let resolveSpeedCalcer;
	this.calcMaxSpeed = async function() {
		let result = await new Promise(function(_resolve) {
			calcingMaxSpeed = true;
			maxSpeedSum = 0;
			curMaxSpeedCounts = 0;
			resolveSpeedCalcer = _resolve;
		});
		calcingMaxSpeed = false;
		return result;
	}

	this.draw = function() {
		Renderer.render();
		requestAnimationFrame(Simulation.draw);
	}


	this.removeUnUsedNodes = function() {
		for (let i = this.nodes.length - 1; i >= 0; i--)
		{
			let x = this.nodes[i].position.value[0];
			let y = this.nodes[i].position.value[1];
			if (!(
				(x < -this.size.value[0] || x > this.size.value[0] * 2) ||
				(y < -this.size.value[1] || y > this.size.value[1] * 2)
			)) continue;

			for (let n = this.nodes[i].springs.length - 1; n >= 0; n--) this.nodes[i].springs[n].cut();
			this.nodes.splice(i, 1);
		}
	}
}



let nodes = [];
const scale = .5;
const width = 30;
const height = 20;

for (let y = 0; y < height; y++)
{
	nodes[y] = [];
	for (let x = 0; x < width; x++)
	{
		let curPos = new Vector(x * scale + 2, y * scale + 1);
		if (y == 0)
		{
			nodes[y][x] = new FixedNode({position: curPos});
			Simulation.nodes.push(nodes[y][x]);
			continue;
		}
		
		nodes[y][x] = new Node({position: curPos});
		nodes[y][x].tie(nodes[y - 1][x]);
		Simulation.nodes.push(nodes[y][x]);

		if (x == 0) continue;
		nodes[y][x].tie(nodes[y][x - 1]);
	}
}




Simulation.setup();