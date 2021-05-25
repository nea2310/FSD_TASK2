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
	initialValAndRange(sliderWidth, minRangeVal, maxRangeVal, minControlStartVal, maxControlStartVal, minControl, maxControl) {
		this.minRangeVal = minRangeVal;//минимальное значение диапазона
		this.maxRangeVal = maxRangeVal;//максимальное значение диапазона
		this.minControlStartPos = (parseInt(minControlStartVal) - minRangeVal) * sliderWidth / (maxRangeVal - minRangeVal);// начальнное положение левого ползунка на шкале
		this.maxControlStartPos = (parseInt(maxControlStartVal) - minRangeVal - 0.3) * sliderWidth / (maxRangeVal - minRangeVal);// начальнное положение правого ползунка на шкале
		this.startWidth = this.maxControlStartPos - this.minControlStartPos; // начальная ширина активного диапазона
		this.minControl = minControl;//левый ползунок
		this.maxControl = maxControl;// правый ползунок


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

	/*#2-5 метод mouseMove получает событие движения мыши с захваченным ползунком и рассчитывает новое положение ползунка на шкале и нове значение*/
	mouseMove(e) {

		/*Определяем положение мыши в зависимости от устройства*/
		/*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
		/*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/

		let pos;
		e.touches === undefined ? pos = e.clientX : pos = e.targetTouches[0].clientX;

		/*Устанавливаем границы движения ползунка*/

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

		/*обновляем закрашенную область диапазона выбора*/


		if (!this.currentControlFlag) {
			selectedLeft = newLeft + this.currentControlCoords.width + "px";
			selectedWidth = this.secondControlCoords.left - this.getCoords(this.currentControl).left - this.currentControlCoords.width + "px";

		} else {
			selectedLeft = this.secondControlCoords.left - this.parentElementCoords.leftX + "px";
			selectedWidth = this.getCoords(this.currentControl).left - this.secondControlCoords.left + "px";
		}



		this.сurrentControlUpdated(this.currentControl, newLeft, newValue, selectedLeft, selectedWidth); //Вызываем для обновления положения и значения ползунка в view
	}



	//#2-6 Вызываем для обновления положения  и значения ползунка (обращение к контроллеру)
	bindСurrentControlUpdated(callback) {
		this.сurrentControlUpdated = callback
	}



}

class sliderView {

	constructor(conf) {
		/*Находим корневой элемент*/
		this.conf = conf;
		this.slider = document.querySelector(conf.target);
		//Получаем min и max значения диапазона и min и max предустановленные значения ползунков
		this.minRangeVal = conf.range[0];
		this.maxRangeVal = conf.range[1];
		this.minControlStartVal = conf.values[0];
		this.maxControlStartVal = conf.values[1];
		//Устанавливаем min и max значения диапазона в инпуты
		this.minRangeValInput = this.slider.querySelector('.rs__range-min');
		this.maxRangeValInput = this.slider.querySelector('.rs__range-max');
		this.minRangeValInput.value = this.minRangeVal;
		this.maxRangeValInput.value = this.maxRangeVal;




		/*Определяем зону окрашивания*/
		this.colorRange = this.slider.querySelector('.rs__colorRange')




		this.renderScale();
		this.renderLeftControl();
		this.renderRightControl();

	}
	renderScale() {
		//определяем родительский элемент ползунков и его ширину в момент рендеринга страницы
		this.sliderScale = this.slider.querySelector('.rs__slider');
		this.sliderWidth = this.sliderScale.offsetWidth;
	}

	renderLeftControl() {
		/*Определяем ползунок минимального значения*/
		this.minControl = this.slider.querySelector('.rs__control-min');
		this.minControl.firstChild.value = this.conf.values[0];
	}

	renderRightControl() {
		/*Определяем ползунок максимального значения*/
		this.maxControl = this.slider.querySelector('.rs__control-max');
		this.maxControl.firstChild.value = this.conf.values[1];
	}



	// #2-1 Вешаем обработчики события нажатия кнопки на ползунке (захвата ползунка) и перемещения ползунка
	bindMoveControl(mouseDownOnControlHandler, mouseMoveHandler) {

		this.slider.addEventListener('mousedown', (e) => {
			if (e.target.classList.contains('rs__control')) {
				let controlData = {};
				//определяем ползунок, за который тянут
				controlData.currentControl = e.target;

				//определяем второй ползунок
				controlData.currentControl == this.minControl ? controlData.secondControl = this.maxControl : controlData.secondControl = this.minControl;

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.minControl ? controlData.currentControlFlag = false : controlData.currentControlFlag = true;

				mouseDownOnControlHandler(controlData);// вызов хендлера захвата ползунка

				document.addEventListener('mousemove', mouseMoveHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('mouseup', this.handleMouseUp);
				document.addEventListener('touchmove', mouseMoveHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('touchend', this.handleMouseUp);
			}
		})
	}




	//#2-9 Вызывается из модели через контроллер для установки ползунку новой позиции, нового значения, закрашивания диапазона выбора (области шкалы между ползунками)
	updateСurrentControl(elem, newLeft, newValue, selectedLeft, selectedWidth) {

		/*устанавливаем отступ ползунку*/
		if (newLeft) elem.style.left = newLeft + 'px';

		/*Выводим значение над ползунком*/
		if (newValue) elem.firstChild.value = newValue;

		/*красим диапазон выбора (область шкалы между ползунками)*/
		if (selectedLeft && selectedWidth) this.updateActiveRange(selectedLeft, selectedWidth)
	}


	/*#2-9 красим диапазон выбора (область шкалы между ползунками)*/
	updateActiveRange(left, width) {

		this.colorRange.style.left = left;
		this.colorRange.style.width = width;
	}

	//3-1 Вешаем обработчик события отпускания мыши
	bindMouseUp(mouseUpHandler) {
		this.slider.addEventListener('mouseup', () => {
			mouseUpHandler();
		})
	}

}




class sliderController {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.handleInitialValAndRange(this.view.sliderWidth, this.view.minRangeVal, this.view.maxRangeVal, this.view.minControlStartVal, this.view.maxControlStartVal, this.view.minControl, this.view.maxControl);//#1-1 запускаем обработчик handleInitialValAndRange для передачи диапазона и  первоначальных значений ползунков (получены в классе view) в модель
		this.handleInitialControlPosition(this.view.minControl, this.model.minControlStartPos);//#1-4-1 запускаем для передачи во view информации о начальном положениее левого ползунка
		this.handleInitialControlPosition(this.view.maxControl, this.model.maxControlStartPos); //#1-4-2 запускаем для передачи во view информации о начальном положениее правого ползунка
		this.handleActiveRange(this.model.minControlStartPos, this.model.startWidth)// //#1-5 запускаем для передачи во view информации об активном диапазоне (чтобы покрасить внутреннюю часть шкалы между двумя ползунками)
		this.view.bindMoveControl(this.handleMouseDownOnControl, this.handleMouseMove);// #2-2 запускаем обработчики handleMouseDownOnControl и handleMouseMove при возникновении в view события захвата и перетаскивания ползунка
		this.model.bindСurrentControlUpdated(this.handleOnСurrentControlUpdated)//#2-7 Вызываем для обновления положения  и значения ползунка (обращение к view)
		this.view.bindMouseUp(this.handleMouseUp);// #3-2 запускаем обработчик handleMouseUp при возникновении в view события отпускания кнопки (завершение перетаскивания ползунка)
	}

	//#1-2 Передаем диапазон и  первоначальные значения ползунков (получены в классе view) в модель
	// Это нужно для установки начального положения ползунков на шкале
	handleInitialValAndRange = (sliderWidth, minRangeVal, maxRangeVal, minControlStartVal, maxControlStartVal, minControl, maxControl) => {
		this.model.initialValAndRange(sliderWidth, minRangeVal, maxRangeVal, minControlStartVal, maxControlStartVal, minControl, maxControl);
	}
	//#1-6 Передаем информацию о расположении ползунков в view (newLeft был посчитан в модели) - ДЛЯ ПОЗИЦИОНИРОВАНИЯ ПОЛЗУНКОВ НА ШКАЛЕ И УКАЗАНИЯ ЗНАЧЕНИЯ
	handleInitialControlPosition = (elem, newLeft) => {
		this.view.updateСurrentControl(elem, newLeft);
	}
	//#1-6 Передаем информацию о расположении ползунков в view (left, width были посчитаны в модели) - ДЛЯ ЗАКРАШИВАНИЯ АКТИВНОГО ДИАПАЗОНА (область шкалы между ползунками)
	handleActiveRange = (left, width) => {
		this.view.updateActiveRange(left, width);
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
	handleOnСurrentControlUpdated = (elem, newLeft, newValue, selectedLeft, selectedWidth) => {
		this.view.updateСurrentControl(elem, newLeft, newValue, selectedLeft, selectedWidth);
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



new sliderController(new sliderModel(), new sliderView({
	target: '.rs__wrapper',
	range: [0, 5],
	values: [1, 4]

}))