class sliderModel {
	//#1-3 Сохраняем в объекте модели диапазон, рассчитываем и сохраняем положение ползунков в момент рендеринга страницы
	initialValAndRange(width, rangeMin, rangeMax, valueMin, valueMax) {
		this.rangeMin = rangeMin;
		this.rangeMax = rangeMax;
		this.startLeft = (parseInt(valueMin) - rangeMin) * width / (rangeMax - rangeMin);
		this.startRight = (parseInt(valueMax) - rangeMin - 0.3) * width / (rangeMax - rangeMin);
	}

	/*#2-4 метод mouseDownOnControl получает элемент ползунка, его координаты в момент начала перемещения ползунка, и сохраняет в объекте модели*/
	mouseDownOnControl(controlData) {

		this.currentControl = controlData.currentControl; // ползунок, за который тянут
		this.currentControlCoords = controlData.currentControlCoords;
		this.secondControl = controlData.secondControl; // второй ползунок
		this.secondControlCoords = controlData.secondControlCoords;
		this.parentElementCoords = controlData.parentElementCoords;
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

		/*Определяем новое положение ползунка на шкале*/
		if (this.currentControlFlag == false && pos > this.secondControlCoords.left - this.secondControlCoords.width) {
			newLeft = this.secondControlCoords.left - this.secondControlCoords.width - parent.coords.leftX;
		} else if (this.currentControlFlag == true && pos < this.secondControlCoords.rigth + 5) {
			newLeft = this.secondControlCoords.rigth - this.secondControlCoords.left;
		}

		/*Определяем новое значение ползунка*/
		let value;
		if (this.currentControlFlag == false) {
			value = (newLeft / (this.parentElementCoords.width / (this.rangeMax - this.rangeMin)) + this.rangeMin).toFixed(1);
		} else {
			value = (newLeft / (this.parentElementCoords.width / (this.rangeMax - this.rangeMin)) + 0.3 + this.rangeMin).toFixed(1);
		}

		this.сurrentControlUpdated(this.currentControl, newLeft, value); //Вызываем для обновления положения и значения ползунка в view
	}

	//#2-6 Вызываем для обновления положения  и значения ползунка (обращение к контроллеру)
	bindСurrentControlUpdated(callback) {
		this.сurrentControlUpdated = callback
	}

}

class sliderView {

	constructor(conf) {
		/*Находим корневой элемент*/
		this.slider = document.querySelector(conf.target);
		//Получаем min и max значения диапазона и min и max предустановленные значения ползунков
		this.rangeMin = conf.range[0];
		this.rangeMax = conf.range[1];
		this.valueMin = conf.values[0];
		this.valueMax = conf.values[1];
		//Устанавливаем min и max значения диапазона
		this.rangeMinInput = this.slider.querySelector('.rs__range-min');
		this.rangeMaxInput = this.slider.querySelector('.rs__range-max');
		this.rangeMinInput.value = this.rangeMin;
		this.rangeMaxInput.value = this.rangeMax;


		//определяем родительский элемент ползунков и его ширину в момент рендеринга страницы
		this.sliderScale = this.slider.querySelector('.rs__slider');
		this.sliderWidth = this.sliderScale.offsetWidth;

		/*Определяем зону окрашивания*/
		this.colorRange = this.slider.querySelector('.rs__colorRange')

		/*Определяем ползунок минимального значения*/
		this.minControl = this.slider.querySelector('.rs__control-min');

		/*Определяем ползунок максимального значения*/
		this.maxControl = this.slider.querySelector('.rs__control-max');

		this.slider.addEventListener('dragstart', function (e) {
			e.preventDefault();
		})
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
	// #2-1 Вешаем обработчики события нажатия кнопки на ползунке ползунка (захвата ползунка) и перемещения ползунка
	bindMoveControl(mouseDownOnControlHandler, mouseMoveHandler) {

		this.slider.addEventListener('mousedown', (e) => {
			if (e.target.classList.contains('rs__control')) {
				let controlData = {};
				//определяем ползунок, за который тянут, и его координаты
				controlData.currentControl = e.target;
				controlData.currentControlCoords = this.getCoords(controlData.currentControl);

				//определяем второй ползунок и его координаты
				controlData.currentControl == this.minControl ? controlData.secondControl = this.maxControl : controlData.secondControl = this.minControl;
				controlData.secondControlCoords = this.getCoords(controlData.secondControl);

				//определяем координаты родительского элемента ползунков в момент события
				controlData.parentElementCoords = this.getCoords(this.sliderScale);


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




	//#2-9 Вызывается из модели через контроллер для установки ползунку новой позиции
	updateСurrentControl(elem, newLeft, value) {
		/*устанавливаем отступ ползунку*/
		elem.style.left = newLeft + 'px';

		/*Выводим значение над ползунком*/
		elem.firstChild.value = value;
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
		this.handleInitialValAndRange(this.view.sliderWidth, this.view.rangeMin, this.view.rangeMax, this.view.valueMin, this.view.valueMax);//#1-1 запускаем обработчик handleInitialValAndRange для передачи диапазона и  первоначальных значений ползунков (получены в классе view) в модель
		this.handleInitialControlPosition(this.view.minControl, this.model.startLeft, this.view.valueMin);//#1-4 запускаем для передачи во view информации о начальном положениее левого ползунка
		this.handleInitialControlPosition(this.view.maxControl, this.model.startRight, this.view.valueMax); //#1-5 запускаем для передачи во view информации о начальном положениее правого ползунка
		this.view.bindMoveControl(this.handleMouseDownOnControl, this.handleMouseMove);// #2-2 запускаем обработчики handleMouseDownOnControl и handleMouseMove при возникновении в view события захвата и перетаскивания ползунка
		this.model.bindСurrentControlUpdated(this.handleOnСurrentControlUpdated)//#2-7 Вызываем для обновления положения  и значения ползунка (обращение к view)
		this.view.bindMouseUp(this.handleMouseUp);// #3-2 запускаем обработчик handleMouseUp при возникновении в view события отпускания кнопки (завершение перетаскивания ползунка)
	}

	//#1-2 Передаем диапазон и  первоначальные значения ползунков (получены в классе view) в модель
	// Это нужно для установки начального положения ползунков на шкале
	handleInitialValAndRange = (width, rangeMin, rangeMax, valueMin, valueMax) => {
		this.model.initialValAndRange(width, rangeMin, rangeMax, valueMin, valueMax);
	}
	//#1-6 Передаем информацию о расположении ползунков в view (newLeft был посчитан в модели)
	handleInitialControlPosition = (elem, newLeft, value) => {
		this.view.updateСurrentControl(elem, newLeft, value);
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
	handleOnСurrentControlUpdated = (elem, newLeft, value) => {
		this.view.updateСurrentControl(elem, newLeft, value);
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
	target: '.rs__filter',
	range: [50, 100],
	values: [56, 70]

}))