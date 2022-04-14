
let Renderer;
const Simulation = new function() {
	this.nodes = [];

	this.setup = function() {
		Renderer = new _Renderer(renderCanvas);

		this.update();
		this.draw();
	}

	let prevFrame = new Date();
	this.update = function() {
		let dt = (new Date() - prevFrame) / 1000;
		if (dt > .1) dt = .1;

		Renderer.render();
		for (let node of this.nodes)
		{
			node.update();
		}
		for (let node of this.nodes)
		{
			node.applyUpdate(dt);
		}
		
		prevFrame = new Date();	
		setTimeout(() => Simulation.update(), 10);
	}

	this.draw = function() {
		Renderer.render();
		// requestAnimationFrame(Simulation.draw);
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
		let curPos = new Vector(x * scale + 2, y * scale + 2);
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