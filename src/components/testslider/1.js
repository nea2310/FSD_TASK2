if (this.markList) {
	for (let elem of this.markList) {
		elem.remove();
	}
}
this.step = conf.step;
let length = parseFloat(this.scaleHeight);
let singleIntervalCount = (conf.max - conf.min)//кол-во единичных интервалов
let singleLength = length / singleIntervalCount;//ширина единичного интервала
let stepLength = singleLength * conf.step;// ширина шага (шаг может быть равен одному или нескольким единичным интервалам)
let innerText = conf.min + conf.step;
while (length >= stepLength) { // создаем деления шкалы
	let elem = document.createElement('div');
	let pos = parseFloat(this.scaleHeight) * (innerText - conf.min) / (conf.max - conf.min);
	elem.innerText = innerText;
	elem.classList.add('rs__mark');
	elem.classList.add('vertical');
	elem.style.bottom = pos;
	this.scale.appendChild(elem);
	length = length - stepLength;
	innerText = innerText + conf.step;
}
this.markList = this.scale.querySelectorAll('.rs__mark');
