const UI = new function() {
	this.settingsPanel = new UI_settingsPanel();
	this.toolPanel = new UI_toolPanel();

}

function UI_toolPanel() {

}
function UI_settingsPanel() {
	const This = this;
	const HTML = {
		panel: $('#settingsPanel.panel')[0],
		speedSlider: $('#settingsPanel.panel #simulationSpeed')[0],
	}
	HTML.speedSlider.addEventListener('input', () => {
		This.setSpeed(Math.pow(10, 2 * HTML.speedSlider.value) * .01 * Simulation.maxSpeed);
	})
	this.setSpeed = function(_speed) {
		Simulation.speed = _speed;
		simulationSpeedLabel.innerHTML = 'Simulation Speed (' + Math.round(_speed * 100) / 100 + ')';
		HTML.speedSlider.value =  Math.log10(_speed / Simulation.maxSpeed * 100) / 2;
	}
}



function $(_query, _parent = document.body){
	return _parent.querySelectorAll(_query);
}
