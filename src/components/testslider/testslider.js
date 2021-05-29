class sliderModel {
	constructor(conf) {
		/*Находим корневой элемент*/
		this.conf = conf;
		this.slider = document.querySelector(conf.target);
		this.leftControl = this.slider.querySelector('.rs__control-min');
		this.rightControl = this.slider.querySelector('.rs__control-max');
		this.computeInitialPos();
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


	/*Получаем элемент ползунка, определяем координаты в момент начала перемещения ползунка, и сохраняем в объекте модели*/
	getControlData(controlData) {

		this.currentControl = controlData.currentControl; // ползунок, за который тянут
		this.secondControl = controlData.secondControl; // второй ползунок
		this.parentElement = this.currentControl.parentElement;
		this.currentControlFlag = controlData.currentControlFlag;
		//console.log(this.secondControl);
		//console.log(this.currentControlFlag);
	}

	/*Обрабатываем событие*/
	processEvent(e) {
		//	console.log(e);
		/*Определяем положение мыши в зависимости от устройства*/
		/*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
		/*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/
		//	console.log(e);
		let pos;
		e.touches === undefined ? pos = e.clientX : pos = e.targetTouches[0].clientX;

		/*Определяем новую позицию ползунка*/

		this.newLeft = pos - this.parentElement.getBoundingClientRect().left;
		let rigthEdge = this.parentElement.offsetWidth - (this.currentControl.offsetWidth + 1);

		if (this.newLeft < 0) {
			this.newLeft = 0;
		} else if (this.newLeft > rigthEdge) {

			this.newLeft = rigthEdge;
		}



		// console.log(this.newLeft);
		// console.log(rigthEdge);

		/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
		if (!this.secondControl.classList.contains('rs__control-hidden')) {
			if ((!this.currentControlFlag && pos > this.secondControl.getBoundingClientRect().left + window.pageXOffset - this.secondControl.offsetWidth) ||
				(this.currentControlFlag && pos < this.secondControl.getBoundingClientRect().left + this.secondControl.offsetWidth + window.pageXOffset - 3)) return
		}
		/*Определяем новое значение ползунка*/
		//this.newValue;
		if (!this.currentControlFlag) {
			this.newValue = (this.newLeft / (this.parentElement.offsetWidth / (this.maxRangeVal - this.minRangeVal)) + this.minRangeVal).toFixed(1);
		} else {
			this.newValue = (this.newLeft / (this.parentElement.offsetWidth / (this.maxRangeVal - this.minRangeVal)) + 0.3 + this.minRangeVal).toFixed(1);
		}


		// let selectedLeft;
		// let selectedWidth;

		/*определяем прогресс-бар*/

		//режим Double
		if (!this.secondControl.classList.contains('rs__control-hidden')) {
			this.selectedWidth = Math.abs(parseFloat(this.secondControl.style.left) - this.newLeft) + "px";
			if (!this.currentControlFlag) { //перемещатся левый ползунок
				this.selectedLeft = this.newLeft + this.currentControl.offsetWidth + "px";

			} else {//перемещатся правый ползунок
				this.selectedLeft = this.secondControl.getBoundingClientRect().left + window.pageXOffset - this.parentElement.getBoundingClientRect().left + "px";
			}
		} else { //Режим Single
			this.selectedLeft = 0;

			this.selectedWidth = this.newLeft + "px";
		}

		//	console.log(parseFloat(this.currentControl.parentElement.getBoundingClientRect().left));


		this.progressBarUpdated(this.selectedLeft, this.selectedWidth); //Вызываем для обновления прогресс бара в view
		this.сontrolPosUpdated(this.currentControl, this.newLeft); //Вызываем для обновления положения ползунка в view
		this.сontrolValueUpdated(this.currentControl, this.newValue); //Вызываем для обновления панели view

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




	// doubleMode() {
	// 	console.log('DOUBLEMODE');
	// 	this.progressBar.classList.toggle('rs__progressBar-double');
	// 	this.progressBar.classList.toggle('rs__progressBar-single')
	// }

	// singleMode() {
	// 	console.log('SINGLEMODE');
	// 	this.progressBar.classList.toggle('rs__progressBar-double');
	// 	this.progressBar.classList.toggle('rs__progressBar-single')
	// }

	/*красим диапазон выбора (область шкалы между ползунками)*/
	updateProgressBar(left, width) {

		this.progressBar.style.left = left;
		this.progressBar.style.width = width;
	}



	bindClickOnScale(firstEventHandler, secondEventHandler) {

		this.slider.addEventListener('click', (e) => {
			if (e.target.classList.contains('rs__slider') || e.target.classList.contains('rs__progressBar')) {


				this.leftControl = this.slider.querySelector('.rs__control-min');
				this.rightControl = this.slider.querySelector('.rs__control-max');
				let leftControlPos = this.leftControl.getBoundingClientRect().left
				let rightControlPos = this.rightControl.getBoundingClientRect().left

				let leftControlDist = Math.abs(leftControlPos - e.clientX);
				let rightControlDist = Math.abs(rightControlPos - e.clientX);

				let controlData = {};

				//определяем ползунок, находящийся ближе к позиции клика
				leftControlDist <= rightControlDist ? controlData.currentControl = this.leftControl :
					controlData.currentControl = this.rightControl;

				//определяем второй ползунок
				controlData.currentControl == this.leftControl ? controlData.secondControl = this.rightControl : controlData.secondControl = this.leftControl;

				// Устанавливаем флаг, какой из ползунков (левый или правый) ближе к позиции клика
				controlData.currentControl == this.leftControl ? controlData.currentControlFlag = false : controlData.currentControlFlag = true;

				firstEventHandler(controlData);// вызов хендлера обработки события
				secondEventHandler(e);

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
	bindMoveControl(firstEventHandler, secondEventHandler) {

		this.slider.addEventListener('mousedown', (e) => {
			if (e.target.classList.contains('rs__control')) {
				let controlData = {};
				//определяем ползунок, за который тянут
				controlData.currentControl = e.target;

				//определяем второй ползунок
				controlData.currentControl == this.leftControl ? controlData.secondControl = this.rightControl : controlData.secondControl = this.leftControl;

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.leftControl ? controlData.currentControlFlag = false : controlData.currentControlFlag = true;


				firstEventHandler(controlData);// вызов хендлера обработки события


				document.addEventListener('mousemove', secondEventHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('mouseup', this.handleMouseUp);
				document.addEventListener('touchmove', secondEventHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('touchend', this.handleMouseUp);
			}
		})
	}


	//Вызывается из модели через контроллер для установки ползунку новой позиции, нового значения, закрашивания диапазона выбора (области шкалы между ползунками)
	updateControlPos(elem, newLeft) {
		/*устанавливаем отступ ползунку*/
		if (newLeft) elem.style.left = newLeft + 'px';

	}



	doubleMode() {
		console.log('DOUBLEMODE');
		this.rightControl.classList.remove('rs__control-hidden')
	}

	singleMode() {
		console.log('SINGLEMODE');
		this.rightControl.classList.add('rs__control-hidden')
	}



	verticalMode() { console.log('VERTICALMODE') }

	horizontalMode() { console.log('HORIZONTALMODE') }

}


class sliderViewPanel extends sliderView {
	constructor(conf) {
		super(conf);

		this.renderPanelWrapper()
		this.renderMinPanel();
		this.renderMaxPanel();
		this.renderIsVerticalToggle();
		this.renderIsRangeToggle();
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

	renderIsVerticalToggle() {
		this.isVerticalToggle = document.createElement('label');
		//this.minPanelValue.value = this.conf.values[0];
		this.isVerticalToggle.className = 'togglemark__wrapper';
		this.PanelWrapper.append(this.isVerticalToggle);

		this.isVerticalToggleInput = document.createElement('input');
		this.isVerticalToggleInput.type = 'checkbox';
		this.isVerticalToggleInput.checked = 'checked';

		this.isVerticalToggleSpan = document.createElement('span');
		this.isVerticalToggleSpan.className = 'togglemark';

		this.isVerticalToggleLabel = document.createElement('label');
		this.isVerticalToggleLabel.className = 'togglemark__label';
		this.isVerticalToggleLabel.innerText = 'vertical';


		this.isVerticalToggle.append(this.isVerticalToggleInput);
		this.isVerticalToggle.append(this.isVerticalToggleSpan);
		this.isVerticalToggle.append(this.isVerticalToggleLabel);

	}



	bindCheckIsVerticalControl(checkedEventHandler, notCheckedEventHandler) {

		this.isVerticalToggleInput.addEventListener('change', () => {
			console.log("Состояние чекбокса изменено!")
			console.log(this.isVerticalToggleInput.checked)
			this.isVerticalToggleInput.checked ? checkedEventHandler() : notCheckedEventHandler()
		})
	}



	bindCheckIsRangeControl(checkedEventHandler, notCheckedEventHandler) {

		this.isRangeToggleInput.addEventListener('change', () => {
			console.log("Состояние чекбокса изменено")
			console.log(this.isRangeToggleInput.checked)

			this.isRangeToggleInput.checked ? checkedEventHandler() : notCheckedEventHandler()
		})
	}


	renderIsRangeToggle() {
		this.isRangeToggle = document.createElement('label');
		//this.minPanelValue.value = this.conf.values[0];
		this.isRangeToggle.className = 'togglemark__wrapper';
		this.PanelWrapper.append(this.isRangeToggle);

		this.isRangeToggleInput = document.createElement('input');
		this.isRangeToggleInput.type = 'checkbox';
		this.isRangeToggleInput.checked = 'checked';

		this.isRangeToggleSpan = document.createElement('span');
		this.isRangeToggleSpan.className = 'togglemark';

		this.isRangeToggleLabel = document.createElement('label');
		this.isRangeToggleLabel.className = 'togglemark__label';
		this.isRangeToggleLabel.innerText = 'range';


		this.isRangeToggle.append(this.isRangeToggleInput);
		this.isRangeToggle.append(this.isRangeToggleSpan);
		this.isRangeToggle.append(this.isRangeToggleLabel);

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

		this.viewDoubleControl.bindMoveControl(this.handleGetControlData, this.handleProcessEvent);// вешаем обработчики handleGetControlData и handleProcessEvent для обработки в view события захвата и перетаскивания ползунка
		this.viewScale.bindClickOnScale(this.handleGetControlData, this.handleProcessEvent);// вешаем обработчики handleGetControlData и handleProcessEvent для обработки в view события клика по шкале


		this.viewPanel.bindCheckIsRangeControl(this.handleIsRangeChecked, this.handleIsRangeNotChecked);
		this.viewPanel.bindCheckIsVerticalControl(this.handleIsVerticalChecked, this.handleIsVerticalNotChecked);

		this.view.bindMouseUp(this.handleMouseUp);//вешаем обработчик handleMouseUp для обработки в view события отпускания кнопки (завершение перетаскивания ползунка)


		this.model.bindControlPosUpdated(this.handleOnControlPosUpdated)//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindprogressBarUpdated(this.handleOnprogressBarUpdated)//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindСontrolValueUpdated(this.handleOnСontrolValueUpdated)//Вызываем для обновления панели (обращение к view)

	}



	//вызываем метод GetControlData в модели
	handleGetControlData = (controlData) => {

		console.log('MOUSEDOWN!');
		this.model.getControlData(controlData)
	}


	// вызываем метод processEvent в модели
	handleProcessEvent = (e) => {
		this.model.processEvent(e);
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


	handleIsRangeChecked = () => {
		this.viewDoubleControl.doubleMode();
		//	this.viewScale.doubleMode();
	}

	handleIsRangeNotChecked = () => {
		this.viewDoubleControl.singleMode();
		//	this.viewScale.singleMode();
	}


	handleIsVerticalChecked = () => {
		this.viewDoubleControl.verticalMode();
	}

	handleIsVerticalNotChecked = () => {
		this.viewDoubleControl.horisontalMode();
	}


	// снимаем обработчики, повешенные на событие перемещения мыши
	handleMouseUp = (e) => {
		console.log('MOUSEUP!');
		document.removeEventListener('mousemove', this.handleProcessEvent);
		//	document.removeEventListener('mouseup', this.handleMouseUp);
		document.removeEventListener('touchmove', this.handleProcessEvent);
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


