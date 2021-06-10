if (conf.vertical == true) {
	this.stepLength = (this.length / (conf.max - conf.min)) * conf.step;
	this.text = conf.min + conf.step;
	this.marksArr = [];
	while (this.length >= this.stepLength) { // создаем деления шкалы
		let pos = parseFloat(this.scaleHeight) * (this.text - conf.min) / (conf.max - conf.min);
		this.marksArr.push({ 'pos': pos, 'text': this.text })
		this.length = this.length - this.stepLength;
		this.text = this.text + conf.step;
	}
}