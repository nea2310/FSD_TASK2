class sliderModel {
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


	//#1-3 Сохраняем в объекте модели диапазон, рассчитываем и сохраняем положение ползунков в момент рендеринга страницы
	initialValAndRange(scaleWidth, minRangeVal, maxRangeVal, leftControlStartVal, rightControlStartVal, leftControl, rightControl) {
		this.minRangeVal = minRangeVal;//минимальное значение диапазона
		this.maxRangeVal = maxRangeVal;//максимальное значение диапазона
		this.leftControlStartPos = (parseInt(leftControlStartVal) - minRangeVal) * scaleWidth / (maxRangeVal - minRangeVal);// начальнное положение левого ползунка на шкале
		this.rightControlStartPos = (parseInt(rightControlStartVal) - minRangeVal - 0.3) * scaleWidth / (maxRangeVal - minRangeVal);// начальнное положение правого ползунка на шкале
		this.startWidth = this.rightControlStartPos - this.leftControlStartPos; // начальная ширина активного диапазона
		this.leftControl = leftControl;//левый ползунок
		this.rightControl = rightControl;// правый ползунок


	}

	/*#2-4 метод mouseDownOnControl получает элемент ползунка, определяет координаты в момент начала перемещения ползунка, и сохраняет в объекте модели*/
	mouseDownOnControl(controlData) {

		this.currentControl = controlData.currentControl; // ползунок, за который тянут
		this.currentControlCoords = this.getCoords(this.currentControl);
		this.secondControl = controlData.secondControl; // второй ползунок
		this.secondControlCoords = this.getCoords(this.secondControl);
		this.parentElementCoords = this.getCoords(this.currentControl.parentElement);
		this.currentControlFlag = controlData.currentControlFlag;
	}

	/*#2-5 метод mouseMove получает событие движения мыши с захваченным ползунком и рассчитывает новое положение ползунка на шкале и новое значение*/
	mouseMove(e) {

		/*Определяем положение мыши в зависимости от устройства*/
		/*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
		/*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/

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



		this.scaleUpdated(selectedLeft, selectedWidth); //Вызываем для обновления закрашенной области шкалы в view
		this.сontrolPosUpdated(this.currentControl, newLeft); //Вызываем для обновления положения ползунка в view
		this.сontrolValueUpdated(this.currentControl, newValue); //Вызываем для обновления панели view
	}



	//#2-6 Вызываем для обновления положения  и значения ползунка (обращение к контроллеру)
	bindControlPosUpdated(callback) {
		this.сontrolPosUpdated = callback
	}

	bindScaleUpdated(callback) {
		this.scaleUpdated = callback
	}

	//#2-6 Вызываем для обновления панели (обращение к контроллеру)
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
	}
	renderScale() {
		//определяем родительский элемент ползунков и его ширину в момент рендеринга страницы
		this.scale = this.slider.querySelector('.rs__slider');
		this.scaleWidth = this.scale.offsetWidth;
		/*Определяем зону окрашивания*/
		this.scaleColored = this.slider.querySelector('.rs__colorRange')
		//Получаем min и max значения диапазона
		this.minRangeVal = this.conf.range[0];
		this.maxRangeVal = this.conf.range[1];

		//Устанавливаем min и max значения диапазона в инпуты
		this.minRangeValInput = this.slider.querySelector('.rs__range-min');
		this.maxRangeValInput = this.slider.querySelector('.rs__range-max');
		this.minRangeValInput.value = this.minRangeVal;
		this.maxRangeValInput.value = this.maxRangeVal;

	}

	/*#2-9 красим диапазон выбора (область шкалы между ползунками)*/
	updateActiveRange(left, width) {

		this.scaleColored.style.left = left;
		this.scaleColored.style.width = width;
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

	// #2-1 Вешаем обработчики события нажатия кнопки на ползунке (захвата ползунка) и перемещения ползунка
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


	//#2-9 Вызывается из модели через контроллер для установки ползунку новой позиции, нового значения, закрашивания диапазона выбора (области шкалы между ползунками)
	updateControlPos(elem, newLeft) {

		/*устанавливаем отступ ползунку*/
		if (newLeft) elem.style.left = newLeft + 'px';

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
		this.handleInitialValAndRange(this.viewScale.scaleWidth, this.viewScale.minRangeVal, this.viewScale.maxRangeVal, this.viewPanel.leftControlStartVal, this.viewPanel.rightControlStartVal, this.viewDoubleControl.leftControl, this.viewDoubleControl.rightControl);//#1-1 запускаем обработчик handleInitialValAndRange для передачи диапазона и  первоначальных значений ползунков (получены в классе view) в модель
		this.handleInitialControlPos(this.viewDoubleControl.leftControl, this.model.leftControlStartPos);//#1-4-1 запускаем для передачи во view информации о начальном положениее левого ползунка
		this.handleInitialControlPos(this.viewDoubleControl.rightControl, this.model.rightControlStartPos); //#1-4-2 запускаем для передачи во view информации о начальном положениее правого ползунка
		this.handleActiveRange(this.model.leftControlStartPos, this.model.startWidth)// //#1-5 запускаем для передачи во view информации об активном диапазоне (чтобы покрасить внутреннюю часть шкалы между двумя ползунками)
		this.viewDoubleControl.bindMoveControlDouble(this.handleMouseDownOnControl, this.handleMouseMove);// #2-2 запускаем обработчики handleMouseDownOnControl и handleMouseMove при возникновении в view события захвата и перетаскивания ползунка

		this.model.bindControlPosUpdated(this.handleOnControlPosUpdated)//#2-7 Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindScaleUpdated(this.handleOnScaleUpdated)//#2-7 Вызываем для обновления положения ползунка (обращение к view)

		this.view.bindMouseUp(this.handleMouseUp);// #3-2 запускаем обработчик handleMouseUp при возникновении в view события отпускания кнопки (завершение перетаскивания ползунка)

		this.model.bindСontrolValueUpdated(this.handleOnСontrolValueUpdated)//#2-7 Вызываем для обновления панели (обращение к view)
	}

	//#1-2 Передаем диапазон и  первоначальные значения ползунков (получены в классе view) в модель
	// Это нужно для установки начального положения ползунков на шкале
	handleInitialValAndRange = (scaleWidth, minRangeVal, maxRangeVal, leftControlStartVal, rightControlStartVal, leftControl, rightControl) => {
		this.model.initialValAndRange(scaleWidth, minRangeVal, maxRangeVal, leftControlStartVal, rightControlStartVal, leftControl, rightControl);
	}
	//#1-6 Передаем информацию о расположении ползунков в view (newLeft был посчитан в модели) - ДЛЯ ПОЗИЦИОНИРОВАНИЯ ПОЛЗУНКОВ НА ШКАЛЕ И УКАЗАНИЯ ЗНАЧЕНИЯ
	handleInitialControlPos = (elem, newLeft) => {
		this.viewDoubleControl.updateControlPos(elem, newLeft);
	}
	//#1-6 Передаем информацию о расположении ползунков в view (left, width были посчитаны в модели) - ДЛЯ ЗАКРАШИВАНИЯ АКТИВНОГО ДИАПАЗОНА (область шкалы между ползунками)
	handleActiveRange = (left, width) => {
		this.viewScale.updateActiveRange(left, width);
	}


	// #2-3 Обработчик handleMouseDownOnControl вызывает метод mouseDownOnControl в модели
	handleMouseDownOnControl = (controlData) => {

		console.log('MOUSEDOWN!');
		this.model.mouseDownOnControl(controlData)
	}


	// #2-4 Обработчик handleMouseMove вызывает метод mouseMove в модели
	handleMouseMove = (e) => {
		this.model.mouseMove(e);
	}


	//#2-8 Обработчик handleOnСurrentControlUpdated вызывает метод updateСurrentControl в view
	handleOnScaleUpdated = (selectedLeft, selectedWidth) => {
		this.viewScale.updateActiveRange(selectedLeft, selectedWidth);
	}

	//#2-8 Обработчик handleOnСurrentControlUpdated вызывает метод updateСurrentControl в view
	handleOnControlPosUpdated = (elem, newLeft) => {
		this.viewDoubleControl.updateControlPos(elem, newLeft);
	}


	//#2-8 Обработчик handleOnСontrolValueUpdated вызывает метод updateСurrentControl в view
	handleOnСontrolValueUpdated = (elem, newValue) => {
		this.viewPanel.updatePanelValue(elem, newValue);
	}


	// #3-3 Обработчик handleMouseUp снимает обработчики, повешенные на событие перемещения мыши
	handleMouseUp = (e) => {
		console.log('MOUSEUP!');
		document.removeEventListener('mousemove', this.handleMouseMove);
		//	document.removeEventListener('mouseup', this.handleMouseUp);
		document.removeEventListener('touchmove', this.handleMouseMove);
		//	document.removeEventListener('touchend', this.handleMouseUp);
	}
}



new sliderController(
	new sliderModel(),
	new sliderView({
		target: '.rs__wrapper',
		range: [0, 5],
		values: [1, 4]
	}),
	new sliderViewScale({
		target: '.rs__wrapper',
		range: [0, 5],
		values: [1, 4]
	}),
	new sliderViewDoubleControl({
		target: '.rs__wrapper',
		range: [0, 5],
		values: [1, 4]
	}),
	new sliderViewPanel({
		target: '.rs__wrapper',
		range: [0, 5],
		values: [1, 4]
	}),
);


