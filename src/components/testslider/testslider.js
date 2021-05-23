class sliderModel {
	/*метод moveControl получает элемент и его координаты в момент начала перемещения ползунка*/
	moveControl(controlData) {

		this.currentControl = controlData.currentControl;
		this.currentControlCoords = controlData.currentControlCoords;
		this.secondControl = controlData.secondControl;
		this.secondControlCoords = controlData.secondControlCoords;
		this.parentElement = controlData.parentElement;
		this.parentElementCoords = controlData.parentElementCoords;
		this.currentControlFlag = controlData.currentControlFlag;
	}


	moveMouse(e) {

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
		if (this.currentControlFlag == false && pos > this.secondControlCoords.left - this.secondControlCoords.width) {
			newLeft = this.secondControlCoords.left - this.secondControlCoords.width - parent.coords.leftX;
		} else if (this.currentControlFlag == true && pos < this.secondControlCoords.rigth + 5) {
			newLeft = this.secondControlCoords.rigth - this.secondControlCoords.left;
		}

		this.сurrentControlUpdated(this.currentControl, newLeft); //Вызываем для обновления положения ползунка
	}

	//Вызываем для обновления положения ползунка (обращение к контроллеру)
	bindСurrentControlUpdated(callback) {
		this.сurrentControlUpdated = callback
	}

}

class sliderView {

	constructor(conf) {
		/*Находим корневой элемент*/
		this.slider = document.querySelector(conf.target);

		/*Определяем зону окрашивания*/
		this.colorRange = this.slider.querySelector('.rs__colorRange')

		/*Определяем ползунок минимального значения*/
		this.minControl = this.slider.querySelector('.rs__control-min');
		this.minControlCoords = this.getCoords(this.minControl);
		this.minControlValue = this.slider.querySelector('.rs__value-min');
		this.minControlValue.style.left = - this.minControlCoords.width / 2 + "px";
		this.minControlValue.style.top = parseFloat(window.getComputedStyle(this.minControl).getPropertyValue('top')) - 10 + "px";
		this.minControlValue.innerText = '&&&&&&&&'

		/*Определяем ползунок максимального значения*/
		this.maxControl = this.slider.querySelector('.rs__control-max');
		this.maxControlCoords = this.getCoords(this.maxControl);
		this.maxControlValue = this.slider.querySelector('.rs__value-max');
		this.maxControlValue.style.left = - this.maxControlCoords.width / 2 + "px";
		this.maxControlValue.style.top = parseFloat(window.getComputedStyle(this.maxControl).getPropertyValue('top')) - 10 + "px";
		this.maxControlValue.innerText = '&&&&&&&&'


		this.slider.addEventListener('dragstart', function (e) {
			e.preventDefault();
		})

	}

	/*Вешаем обработчики событий mousedown и touchstart */


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
			width: coords.width
		}
	}
	// #1-1 Вешаем обработчики события перетаскивания ползунка
	bindMoveControl(handler) {

		this.slider.addEventListener('mousedown', (e) => {
			if (e.target.classList.contains('rs__control')) {
				let controlData = {};
				//определяем ползунок, за который тянут, и его координаты
				controlData.currentControl = e.target;
				controlData.currentControlCoords = this.getCoords(controlData.currentControl);

				//определяем второй ползунок и его координаты
				controlData.currentControl == this.minControl ? controlData.secondControl = this.maxControl : controlData.secondControl = this.minControl;
				controlData.secondControlCoords = this.getCoords(controlData.secondControl);

				//определяем родительский элемент ползунков и его координаты
				controlData.parentElement = controlData.currentControl.parentElement;
				controlData.parentElementCoords = this.getCoords(controlData.parentElement);

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.minControl ? controlData.currentControlFlag = false : controlData.currentControlFlag = true;


				handler(controlData);// обращение к контроллеру
			}
		})

	}

	// Вызывается из модели через контроллер для установки ползунку новой позиции
	updateСurrentControl(elem, newLeft) {
		/*устанавливаем отступ ползунку*/
		elem.style.left = newLeft + 'px';
	}

	// Вешаем обработчик события отпускания мыши
	bindReleaseControl(handler) {
		this.slider.addEventListener('mouseup', () => {
			handler();
		})
	}







}

class sliderController {
	constructor(model, view) {
		this.model = model;
		this.view = view;

		this.view.bindMoveControl(this.handleMoveControl);// #1-2 запускаем обработчик handleMoveControl при возникновении в view события перетаскивания ползунка
		this.view.bindReleaseControl(this.handleReleaseControl);// #1-2 запускаем обработчик handleMoveControl при возникновении в view события перетаскивания ползунка
		this.model.bindСurrentControlUpdated(this.handleOnСurrentControlUpdated)//#3-3-2 - запускаем обработчик handleOnCounterListToDisplayChanged при возникновении в модели события ее изменения 


	}

	// #1-3 Обработчик handleMoveControl вызывает метод moveControl в модели
	handleMoveControl = (controlData) => {

		console.log('MOUSEMOVE!');

		document.addEventListener('mousemove', this.onMouseMove);
		//	document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('touchmove', this.onMouseMove);
		//	document.addEventListener('touchend', this.onMouseUp);

		//console.log(this);


		this.model.moveControl(controlData)
	}


	handleReleaseControl = (e) => {
		console.log('MOUSEUP!');
		document.removeEventListener('mousemove', this.onMouseMove);
		//	document.removeEventListener('mouseup', this.onMouseUp);
		document.removeEventListener('touchmove', this.onMouseMove);
		//	document.removeEventListener('touchend', this.onMouseUp);
	}


	handleOnСurrentControlUpdated = (elem, newLeft) => {
		this.view.updateСurrentControl(elem, newLeft);
	}


	onMouseMove = (e) => {

		this.model.moveMouse(e);

	}

	// onMouseUp = (e) => {
	// 	//console.log('MOUSEUP');

	// }


}



new sliderController(new sliderModel(), new sliderView({
	target: '.rs__filter',

}))