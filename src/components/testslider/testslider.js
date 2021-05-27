function getCoords(elem) {
	/*Получаем координаты относительно окна браузера*/
	let coords = elem.getBoundingClientRect();
	/*Высчитываем значения координат относительно документа, вычисляя прокрутку документа*/
	return {
		top: coords.top + window.pageYOffset,
		left: coords.left + window.pageXOffset,
		leftX: coords.left,
		rigth: coords.left + window.pageXOffset + coords.width,
		bottom: coords.top + window.pageYOffset + coords.height,
		width: coords.width,
		height: coords.height,
		top1: coords.top,
		pageYoffset: window.pageYOffset
	}
}

class sliderModel {
	constructor(conf) {
		/*Находим корневой элемент*/
		this.conf = conf;
		this.slider = document.querySelector(conf.target);
		this.computeInitialPos();
	}

	getCoords(elem) {
		/*Получаем координаты относительно окна браузера*/
		let coords = elem.getBoundingClientRect();
		/*Высчитываем значения координат относительно документа, вычисляя прокрутку документа*/
		return {
			top: coords.top + window.pageYOffset,
			left: coords.left + window.pageXOffset,
			leftX: coords.left,
			rigth: coords.left + window.pageXOffset + coords.width,
			bottom: coords.top + window.pageYOffset + coords.height,
			width: coords.width,
			height: coords.height,
			top1: coords.top,
			pageYoffset: window.pageYOffset
		}
	}
	//Сохраняем в объекте модели диапазон, рассчитываем и сохраняем положение ползунков в момент рендеринга страницы
	computeInitialPos() {
		this.scale = this.slider.querySelector('.rs__slider');
		this.scaleWidth = this.scale.offsetWidth;

		this.minRangeVal = this.conf.range[0];//минимальное значение диапазон
		this.maxRangeVal = this.conf.range[1];//максимальное значение диапазона

		this.leftControlStartVal = this.conf.values[0];
		this.rightControlStartVal = this.conf.values[1];

		this.leftControlStartPos = (parseInt(this.leftControlStartVal) - this.minRangeVal) * this.scaleWidth / (this.maxRangeVal - this.minRangeVal);// начальнное положение левого ползунка на шкале
		this.rightControlStartPos = (parseInt(this.rightControlStartVal) - this.minRangeVal - 0.3) * this.scaleWidth / (this.maxRangeVal - this.minRangeVal);// начальнное положение правого ползунка на шкале
		this.progressBarStartWidth = this.rightControlStartPos - this.leftControlStartPos; // начальная ширина активного диапазона
	}


	/*Получаем элемент ползунка, определяет координаты в момент начала перемещения ползунка, и сохраняет в объекте модели*/
	mouseDownOnControl(controlData) {

		this.currentControl = controlData.currentControl; // ползунок, за который тянут
		this.currentControlCoords = this.getCoords(this.currentControl);
		this.secondControl = controlData.secondControl; // второй ползунок
		this.secondControlCoords = this.getCoords(this.secondControl);
		this.parentElementCoords = this.getCoords(this.currentControl.parentElement);
		this.currentControlFlag = controlData.currentControlFlag;
	}

	/*Получаем событие движения мыши с захваченным ползунком и рассчитывает новое положение ползунка на шкале и новое значение*/
	mouseMove(e) {
		//	console.log(e);
		/*Определяем положение мыши в зависимости от устройства*/
		/*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
		/*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/
		//	console.log(e);
		let pos;
		e.touches === undefined ? pos = e.clientX : pos = e.targetTouches[0].clientX;

		/*Определяем новую позицию ползунка*/

		let newLeft = pos - this.parentElementCoords.leftX;
		let rigthEdge = this.parentElementCoords.width - (this.currentControlCoords.width + 1);

		if (newLeft < 0) {
			newLeft = 0;
		} else if (newLeft > rigthEdge) {

			newLeft = rigthEdge;
		}

		/*запрещаем ползункам перепрыгивать друг через друга*/
		if ((!this.currentControlFlag && pos > this.secondControlCoords.left - this.secondControlCoords.width) ||
			(this.currentControlFlag && pos < this.secondControlCoords.rigth - 3)) return

		/*Определяем новое значение ползунка*/
		let newValue;
		if (!this.currentControlFlag) {
			newValue = (newLeft / (this.parentElementCoords.width / (this.maxRangeVal - this.minRangeVal)) + this.minRangeVal).toFixed(1);
		} else {
			newValue = (newLeft / (this.parentElementCoords.width / (this.maxRangeVal - this.minRangeVal)) + 0.3 + this.minRangeVal).toFixed(1);
		}

		let selectedLeft;
		let selectedWidth;

		/*определяем закрашенную область шкалы*/
		if (!this.currentControlFlag) {
			selectedLeft = newLeft + this.currentControlCoords.width + "px";
			selectedWidth = this.secondControlCoords.left - this.getCoords(this.currentControl).left - this.currentControlCoords.width + "px";

		} else {
			selectedLeft = this.secondControlCoords.left - this.parentElementCoords.leftX + "px";
			selectedWidth = this.getCoords(this.currentControl).left - this.secondControlCoords.left + "px";
		}

		this.progressBarUpdated(selectedLeft, selectedWidth); //Вызываем для обновления закрашенной области шкалы в view
		this.сontrolPosUpdated(this.currentControl, newLeft); //Вызываем для обновления положения ползунка в view
		this.сontrolValueUpdated(this.currentControl, newValue); //Вызываем для обновления панели view
	}








	//Вызываем для обновления положения  и значения ползунка (обращение к контроллеру)
	bindControlPosUpdated(callback) {

		this.сontrolPosUpdated = callback
	}

	bindprogressBarUpdated(callback) {
		this.progressBarUpdated = callback
	}

	//Вызываем для обновления панели (обращение к контроллеру)
	bindСontrolValueUpdated(callback) {
		this.сontrolValueUpdated = callback
	}
}

class sliderView {
	constructor(conf) {
		/*Находим корневой элемент*/
		this.conf = conf;
		this.slider = document.querySelector(conf.target);
	}

	//3-1 Вешаем обработчик события отпускания мыши
	bindMouseUp(mouseUpHandler) {
		this.slider.addEventListener('mouseup', () => {
			mouseUpHandler();
		})
	}
}

class sliderViewScale extends sliderView {

	constructor(conf) {
		super(conf);
		this.renderScale();// шкала
		this.renderMarks();
	}
	renderScale() {
		//определяем родительский элемент ползунков и его ширину в момент рендеринга страницы
		this.scale = this.slider.querySelector('.rs__slider');
		this.scaleWidth = this.scale.offsetWidth;
		/*Определяем зону окрашивания*/
		this.progressBar = this.slider.querySelector('.rs__progressBar')
		//Получаем min и max значения диапазона
		//this.minRangeVal = this.conf.range[0];
		//this.maxRangeVal = this.conf.range[1];

		//Устанавливаем min и max значения диапазона в инпуты
		this.minRangeValInput = this.slider.querySelector('.rs__range-min');
		this.maxRangeValInput = this.slider.querySelector('.rs__range-max');
		this.minRangeValInput.value = this.conf.range[0];
		this.maxRangeValInput.value = this.conf.range[1];
	}

	renderMarks(marks = true) {
		if (marks) {
			this.step = this.conf.step;
			let length = parseFloat(this.scaleWidth);

			let singleIntervalCount = (this.conf.range[1] - this.conf.range[0])//кол-во единичных интервалов
			let singleLength = length / singleIntervalCount;//ширина единичного интервала
			let stepLength = singleLength * this.conf.step;// ширина шага (шаг может быть равен одному или нескольким единичным интервалам)
			// console.log(this.conf.range[0]);
			// console.log(this.conf.range[1]);
			// console.log('this.conf.step: ' + this.conf.step);
			// console.log('length: ' + length);
			// console.log('singleIntervalCount: ' + singleIntervalCount);
			// console.log('singleLength: ' + singleLength);
			// console.log('stepLength: ' + stepLength);

			let innerText = this.conf.range[0] + this.conf.step; //значение шага
			while (length >= stepLength) { // создаем деления шкалы
				let elem = document.createElement('div');
				let elemWidth = 2;
				elem.innerText = innerText;
				elem.classList.add('rs__mark');
				//	console.log(elem.offsetWidth);
				elem.style.width = elemWidth + 'px';
				elem.style.marginLeft = stepLength - elemWidth;
				this.scale.appendChild(elem);
				length = length - stepLength;
				innerText = innerText + this.conf.step;
			}
		}
	}

	/*красим диапазон выбора (область шкалы между ползунками)*/
	updateProgressBar(left, width) {

		this.progressBar.style.left = left;
		this.progressBar.style.width = width;
	}




	bindMoveControlDouble(mouseDownOnControlHandler, mouseMoveHandler) {

		this.slider.addEventListener('click', (e) => {
			if (e.target.classList.contains('rs__slider') || e.target.classList.contains('rs__progressBar')) {


				this.leftControl = this.slider.querySelector('.rs__control-min');
				this.rightControl = this.slider.querySelector('.rs__control-max');
				let leftControlPos = getCoords(this.leftControl).leftX;
				let rightControlPos = getCoords(this.rightControl).leftX;

				let leftControlDist = Math.abs(leftControlPos - e.clientX);
				let rightControlDist = Math.abs(rightControlPos - e.clientX);

				// console.log('e.clientX: ' + e.clientX);
				// console.log('leftControlPos: ' + leftControlPos);
				// console.log('rightControlPos: ' + rightControlPos);
				// console.log('leftControlDist: ' + leftControlDist);
				// console.log('rightControlDist: ' + rightControlDist);

				//	let a = e.clientX - 60
				let controlData = {};




				//определяем ползунок, за который тянут
				leftControlDist <= rightControlDist ? controlData.currentControl = this.leftControl :
					controlData.currentControl = this.rightControl;

				//определяем второй ползунок
				controlData.currentControl == this.leftControl ? controlData.secondControl = this.rightControl : controlData.secondControl = this.leftControl;

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.leftControl ? controlData.currentControlFlag = false : controlData.currentControlFlag = true;

				mouseDownOnControlHandler(controlData);// вызов хендлера захвата ползунка

				document.addEventListener('mousemove', mouseMoveHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('mouseup', this.handleMouseUp);
				document.addEventListener('touchmove', mouseMoveHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('touchend', this.handleMouseUp);
			}
		})
	}



}

class sliderViewDoubleControl extends sliderView {
	constructor(conf) {
		super(conf);
		this.renderLeftControl();
		this.renderRightControl();
	}

	renderLeftControl() {
		/*Определяем ползунок минимального значения*/
		this.leftControl = this.slider.querySelector('.rs__control-min');
	}

	renderRightControl() {
		/*Определяем ползунок максимального значения*/
		this.rightControl = this.slider.querySelector('.rs__control-max');
	}

	// Вешаем обработчики события нажатия кнопки на ползунке (захвата ползунка) и перемещения ползунка
	bindMoveControlDouble(mouseDownOnControlHandler, mouseMoveHandler) {

		this.slider.addEventListener('mousedown', (e) => {
			if (e.target.classList.contains('rs__control')) {
				let controlData = {};
				//определяем ползунок, за который тянут
				controlData.currentControl = e.target;

				//определяем второй ползунок
				controlData.currentControl == this.leftControl ? controlData.secondControl = this.rightControl : controlData.secondControl = this.leftControl;

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.leftControl ? controlData.currentControlFlag = false : controlData.currentControlFlag = true;

				mouseDownOnControlHandler(controlData);// вызов хендлера захвата ползунка

				document.addEventListener('mousemove', mouseMoveHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('mouseup', this.handleMouseUp);
				document.addEventListener('touchmove', mouseMoveHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('touchend', this.handleMouseUp);
			}
		})
	}


	//Вызывается из модели через контроллер для установки ползунку новой позиции, нового значения, закрашивания диапазона выбора (области шкалы между ползунками)
	updateControlPos(elem, newLeft) {

		//console.log(newLeft);

		/*устанавливаем отступ ползунку*/
		//	console.log(this.slider.getBoundingClientRect().left);
		//	console.log(elem.style.left);
		if (newLeft) elem.style.left = newLeft + 'px';
		//	console.log(elem.style.left);

	}
}


class sliderViewPanel extends sliderView {
	constructor(conf) {
		super(conf);

		this.renderPanelWrapper()
		this.renderMinPanel();
		this.renderMaxPanel();
	}
	renderPanelWrapper() {
		this.PanelWrapper = document.createElement('div');
		this.PanelWrapper.className = 'rs__panelWrapper';
		this.slider.prepend(this.PanelWrapper);
	}

	renderMinPanel() {
		this.minPanelValue = document.createElement('input');
		this.minPanelValue.value = this.conf.values[0];
		this.minPanelValue.className = 'rs__panel rs__panel-min';
		this.PanelWrapper.append(this.minPanelValue);
		this.leftControlStartVal = this.conf.values[0];
	}

	renderMaxPanel() {
		this.maxPanelValue = document.createElement('input');
		this.maxPanelValue.value = this.conf.values[1];
		this.maxPanelValue.className = 'rs__panel rs__panel-max';
		this.PanelWrapper.append(this.maxPanelValue);
		this.rightControlStartVal = this.conf.values[1];
	}

	updatePanelValue(elem, newValue) {
		elem.classList.contains('rs__control-min') ? this.minPanelValue.value = newValue : this.maxPanelValue.value = newValue;
	}
}


class sliderController {
	constructor(model, view, viewScale, viewDoubleControl, viewPanel) {
		this.model = model;
		this.view = view;
		this.viewScale = viewScale;
		this.viewDoubleControl = viewDoubleControl;
		this.viewPanel = viewPanel;

		this.handleOnControlPosUpdated(this.viewDoubleControl.leftControl, this.model.leftControlStartPos);//передаем во view начальное положение левого ползунка
		this.handleOnControlPosUpdated(this.viewDoubleControl.rightControl, this.model.rightControlStartPos); //передаем во view начальное положение левого ползунка
		this.handleOnprogressBarUpdated(this.model.leftControlStartPos, this.model.progressBarStartWidth); // передаем во view начальное положение прогресс-бара


		//this.viewScale.bindClickScale(this.clickScaleHandler);
		this.viewDoubleControl.bindMoveControlDouble(this.handleMouseDownOnControl, this.handleMouseMove);// вешаем обработчики handleMouseDownOnControl и handleMouseMove для обработки в view события захвата и перетаскивания ползунка
		this.viewScale.bindMoveControlDouble(this.handleMouseDownOnControl, this.handleMouseMove);// вешаем обработчики handleMouseDownOnControl и handleMouseMove для обработки в view события захвата и перетаскивания ползунка


		this.view.bindMouseUp(this.handleMouseUp);//вешаем обработчик handleMouseUp для обработки в view события отпускания кнопки (завершение перетаскивания ползунка)




		this.model.bindControlPosUpdated(this.handleOnControlPosUpdated)//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindprogressBarUpdated(this.handleOnprogressBarUpdated)//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindСontrolValueUpdated(this.handleOnСontrolValueUpdated)//Вызываем для обновления панели (обращение к view)

	}



	//вызываем метод mouseDownOnControl в модели
	handleMouseDownOnControl = (controlData) => {

		console.log('MOUSEDOWN!');
		this.model.mouseDownOnControl(controlData)
	}


	// вызываем метод mouseMove в модели
	handleMouseMove = (e) => {
		this.model.mouseMove(e);
	}

	clickScaleHandler = (e) => {
		this.model.clickScale(e);
	}


	//вызываем метод updateСurrentControl в view
	handleOnprogressBarUpdated = (selectedLeft, selectedWidth) => {
		this.viewScale.updateProgressBar(selectedLeft, selectedWidth);
	}

	//вызываем метод updateСurrentControl в view
	handleOnControlPosUpdated = (elem, newLeft) => {
		//	console.log(this.viewDoubleControl);
		this.viewDoubleControl.updateControlPos(elem, newLeft);
	}

	//вызываем метод updateСurrentControl в view
	handleOnСontrolValueUpdated = (elem, newValue) => {
		this.viewPanel.updatePanelValue(elem, newValue);
	}


	// снимаем обработчики, повешенные на событие перемещения мыши
	handleMouseUp = (e) => {
		console.log('MOUSEUP!');
		document.removeEventListener('mousemove', this.handleMouseMove);
		//	document.removeEventListener('mouseup', this.handleMouseUp);
		document.removeEventListener('touchmove', this.handleMouseMove);
		//	document.removeEventListener('touchend', this.handleMouseUp);
	}
}

let conf = {
	target: '.rs__wrapper',
	range: [0, 100],
	values: [25, 45],
	step: 26
}

new sliderController(
	new sliderModel(conf),
	new sliderView(conf),
	new sliderViewScale(conf),
	new sliderViewDoubleControl(conf),
	new sliderViewPanel(conf),
);


