if (conf.vertical == true) {
	console.log('VERTICAL');

	this.scale.classList.add('vertical');


	if (marks) {
		if (this.markList) {
			for (let elem of this.markList) {
				elem.remove();
			}
		}

		this.step = conf.step;
		let length = parseFloat(this.scaleWidth);
		console.log(length);

		let singleIntervalCount = (conf.max - conf.min)//кол-во единичных интервалов
		let singleLength = length / singleIntervalCount;//ширина единичного интервала
		let stepLength = singleLength * conf.step;// ширина шага (шаг может быть равен одному или нескольким единичным интервалам)

		console.log('conf.min: ' + conf.min);
		console.log('conf.max: ' + conf.max);
		console.log('conf.step: ' + conf.step);
		console.log('length: ' + length);
		console.log('singleIntervalCount: ' + singleIntervalCount);
		console.log('singleLength: ' + singleLength);
		console.log('stepLength: ' + stepLength);
		let arr = [];
		let innerText = conf.max - conf.step; //значение шага
		while (length >= stepLength) { // создаем деления шкалы
			let elem = document.createElement('div');
			let elemWidth = 1;
			elem.innerText = innerText;
			elem.classList.add('rs__mark');
			elem.classList.add('vertical');
			//elem.style.height = elemWidth + 'px';
			//elem.style.height = stepLength - elemWidth; + 'px';
			elem.style.marginBottom = stepLength - elemWidth;
			elem.style.marginLeft = '20px';
			this.scale.appendChild(elem);
			length = length - stepLength;
			innerText = innerText - conf.step;
			arr.push(elem);

		}
		console.log(arr);
	}
	this.markList = this.scale.querySelectorAll('.rs__mark');

