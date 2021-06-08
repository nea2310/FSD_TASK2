else {
	if (marks) {
		if (this.markList) {
			for (let elem of this.markList) {
				elem.remove();
			}
		}

		this.step = conf.step;
		let length = parseFloat(this.scaleWidth);

		let singleIntervalCount = (conf.max - conf.min)//кол-во единичных интервалов
		let singleLength = length / singleIntervalCount;//ширина единичного интервала
		let stepLength = singleLength * conf.step;// ширина шага (шаг может быть равен одному или нескольким единичным интервалам)
		// console.log('conf.min: ' + conf.min);
		// console.log('conf.max: ' + conf.max);
		// console.log('conf.step: ' + conf.step);
		// console.log('length: ' + length);
		// console.log('singleIntervalCount: ' + singleIntervalCount);
		// console.log('singleLength: ' + singleLength);
		// console.log('stepLength: ' + stepLength);

		let innerText = conf.min + conf.step; //значение шага
		while (length >= stepLength) { // создаем деления шкалы
			let elem = document.createElement('div');
			let elemWidth = 2;
			elem.innerText = innerText;
			elem.classList.add('rs__mark');
			elem.style.width = elemWidth + 'px';
			elem.style.marginLeft = stepLength - elemWidth;
			this.scale.appendChild(elem);
			length = length - stepLength;
			innerText = innerText + conf.step;
			console.log(innerText);
		}
	}
	this.markList = this.scale.querySelectorAll('.rs__mark');
}