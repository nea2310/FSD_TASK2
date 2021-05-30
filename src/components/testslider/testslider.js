class sliderModel {
	constructor(conf) {
		/*Находим корневой элемент*/
		this.conf = conf;
		this.slider = document.querySelector(conf.target);
		this.leftControl = this.slider.querySelector('.rs__control-min');
		this.rightControl = this.slider.querySelector('.rs__control-max');
		this.computeInitialPos();
	}



	/*Получаем элемент ползунка, определяем координаты в момент начала перемещения ползунка, и сохраняем в объекте модели*/
	getControlData(controlData) {

		this.currentControl = controlData.currentControl; // ползунок, за который тянут
		this.secondControl = controlData.secondControl; // второй ползунок
		this.parentElement = this.currentControl.parentElement;
		this.currentControlFlag = controlData.currentControlFlag;
	}

	//Сохраняем в объекте модели диапазон, рассчитываем и сохраняем положение ползунков в момент рендеринга страницы
	computeInitialPos() {
		this.scale = this.slider.querySelector('.rs__slider');
		this.scaleWidth = this.scale.offsetWidth;

		this.minRangeVal = this.conf.range[0];//минимальное значение диапазон
		this.maxRangeVal = this.conf.range[1];//максимальное значение диапазона

		this.leftControlStartVal = this.conf.values[0];
		this.rightControlStartVal = this.conf.values[1];

		this.leftControlStartPos = this.computeControlPosFromVal(this.leftControlStartVal);// начальное положение левого ползунка на шкале
		this.rightControlStartPos = this.computeControlPosFromVal(this.rightControlStartVal);// начальное положение правого ползунка на шкале
		this.progressBarStartWidth = this.rightControlStartPos - this.leftControlStartPos; // начальная ширина активного диапазона
	}

	//Рассчитываем положение ползунка на основании значения, введенного в панели конфигурирования или в объекте конфигурации
	computeControlPosFromVal(val, isInitialRendering = true, control) {
		this.newLeft = (parseInt(val) - this.minRangeVal) * this.scaleWidth / (this.maxRangeVal - this.minRangeVal);// начальное положение левого ползунка на шкале
		if (isInitialRendering) {
			return this.newLeft
		}
		if (!isInitialRendering) {
			if (control.classList.contains('rs__control-min')) {
				this.secondControl = this.rightControl;
				this.currentControlFlag = false;
			} else {
				this.secondControl = this.leftControl;
				this.currentControlFlag = true;
			}

			this.сontrolPosUpdated(control, this.newLeft);
			this.getControlData({
				currentControl: control,
				secondControl: this.secondControl,
				currentControlFlag: this.currentControlFlag
			})
			this.computeProgressBar();
		}
	}



	//Рассчитываем положение ползунка при возникновении события перетяшивания ползунка или щелчка по шкале
	computeControlPosFromEvent(e) {
		/*Определяем положение мыши в зависимости от устройства*/
		/*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
		/*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/

		if (e.type == 'change') {//если переключили чекбокс на панели конфигурации (например смена режима Double -> Single)
			this.changeMode = true;
			if (e.target.classList.contains('rs__rangeModeToggle')) { //меняется режим double->single или наоборот
				this.rightControl.classList.contains('rs__control-hidden') ? this.switchToSingleMode = true : this.switchToSingleMode = false;
				!this.rightControl.classList.contains('rs__control-hidden') ? this.switchToDoubleMode = true : this.switchToDoubleMode = false;
			}

			if (e.target.classList.contains('rs__verticalModeToggle')) { //меняется режим vertical->horizontal или наоборот
				// [УСЛОВИЕ]? this.switchToVerticalMode = true : this.switchToVerticalMode = false;
				// [УСЛОВИЕ] ? this.switchToDoubleMode = true : this.switchToDoubleMode = false;
			}
		}

		else if (e.type == 'click' || e.type == 'mousemove') { //если потянули ползунок или кликнули по шкале
			this.changeMode = false;
			this.switchToSingleMode = false;
			this.switchToDoubleMode = false;
			this.switchToVerticalMode = false;
			this.switchToHorizontalMode = false;
			e.touches === undefined ? this.pos = e.clientX : this.pos = e.targetTouches[0].clientX;


			this.newLeft = this.pos - this.parentElement.getBoundingClientRect().left;
			let rigthEdge = this.parentElement.offsetWidth;

			if (this.newLeft < 0) {
				this.newLeft = -0.00001; // если здесь поставить this.newLeft =0, то по какой-то причине левый ползунок не доходит до самого края шкалы (т.е. вместо elem.style.left=0px ему присваивается 2px)
			} else if (this.newLeft > rigthEdge) {

				this.newLeft = rigthEdge;
			}

			/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
			if (!this.rightControl.classList.contains('rs__control-hidden')) {
				if ((!this.currentControlFlag && this.pos > this.secondControl.getBoundingClientRect().left + window.pageXOffset - this.secondControl.offsetWidth) ||
					(this.currentControlFlag && this.pos < this.secondControl.getBoundingClientRect().left + this.secondControl.offsetWidth + window.pageXOffset - 3)) return
			}
			this.сontrolPosUpdated(this.currentControl, this.newLeft); //Вызываем для обновления положения ползунка в view
		}

		this.computeControlValue();
	}

	computeControlValue() {		/*Определяем новое значение ползунка*/
		if (!this.changeMode) {
			this.newValue = (this.newLeft / (this.parentElement.offsetWidth / (this.maxRangeVal - this.minRangeVal)) + this.minRangeVal).toFixed(0);
			if (this.newValue == -0) {//Значение -0 возникает из-за строки this.newLeft = -0.00001;
				this.newValue = 0;
			}
			this.сontrolValueUpdated(this.currentControl, this.newValue); //Вызываем для обновления панели view
		}
		this.computeProgressBar();
	}

	computeProgressBar() {
		/*определяем прогресс-бар*/

		if (!this.changeMode) { //Если это не переключение режима
			//режим Double
			if (!this.rightControl.classList.contains('rs__control-hidden')) {
				this.selectedWidth = Math.abs(parseFloat(this.secondControl.style.left) - this.newLeft) + "px";
				if (!this.currentControlFlag) { //перемещатся левый ползунок
					this.selectedLeft = this.newLeft + this.currentControl.offsetWidth + "px";
				} else {//перемещатся правый ползунок
					this.selectedLeft = this.secondControl.getBoundingClientRect().left + window.pageXOffset - this.parentElement.getBoundingClientRect().left + "px";
				}
				//Режим Single
			} else {
				this.selectedLeft = 0;
				this.selectedWidth = this.newLeft + "px";
			}
		}
		//Если это переключение режима
		else if (this.changeMode) {
			if (this.switchToSingleMode) {//переключение в Single режим
				this.selectedLeft = 0;
				this.selectedWidth = this.leftControl.style.left;
			}

			else if (this.switchToDoubleMode) {//переключение в Double режим
				this.selectedLeft = parseFloat(this.leftControl.style.left);
				this.selectedWidth = parseFloat(this.rightControl.style.left) - parseFloat(this.leftControl.style.left) + 'px';
			}

			else if (this.switchToVerticalMode) {//переключение в вертикальный режим
				console.log('switchToVerticalMode');
			}

			else if (this.switchToHorizontalMode) {//переключение в горизонтальный режим
				console.log('switchToHorizontalMode');
			}
		}
		this.progressBarUpdated(this.selectedLeft, this.selectedWidth); //Вызываем для обновления прогресс бара в view
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
		/*Определяем progress bar*/
		this.progressBar = this.slider.querySelector('.rs__progressBar')
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
				elem.style.width = elemWidth + 'px';
				elem.style.marginLeft = stepLength - elemWidth;
				this.scale.appendChild(elem);
				length = length - stepLength;
				innerText = innerText + this.conf.step;
			}
		}
	}


	/*красим Progress Bar*/
	updateProgressBar(left, width) {

		this.progressBar.style.left = left;
		this.progressBar.style.width = width;
	}

	//Клик по шкале

	bindClickOnScale(firstEventHandler, secondEventHandler) {

		this.slider.addEventListener('click', (e) => {
			if (e.target.classList.contains('rs__slider') || e.target.classList.contains('rs__progressBar') || e.isTrusted == false) {

				this.leftControl = this.slider.querySelector('.rs__control-min');
				this.rightControl = this.slider.querySelector('.rs__control-max');
				let leftControlPos = this.leftControl.getBoundingClientRect().left
				let rightControlPos = this.rightControl.getBoundingClientRect().left

				let leftControlDist = Math.abs(leftControlPos - e.clientX);
				let rightControlDist = Math.abs(rightControlPos - e.clientX);

				let controlData = {};
				if (this.rightControl.classList.contains('rs__control-hidden')) {
					controlData.currentControl = this.leftControl;
					controlData.secondControl = this.rightControl;
					controlData.currentControlFlag = false;
				}

				else {//определяем ползунок, находящийся ближе к позиции клика
					leftControlDist <= rightControlDist ? controlData.currentControl = this.leftControl :
						controlData.currentControl = this.rightControl;

					//определяем второй ползунок
					controlData.currentControl == this.leftControl ? controlData.secondControl = this.rightControl : controlData.secondControl = this.leftControl;

					// Устанавливаем флаг, какой из ползунков (левый или правый) ближе к позиции клика
					controlData.currentControl == this.leftControl ? controlData.currentControlFlag = false : controlData.currentControlFlag = true;
				}

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
		this.rightControl.classList.remove('rs__control-hidden')
	}

	singleMode() {
		this.rightControl.classList.add('rs__control-hidden')
	}



	verticalMode() { //console.log('VERTICALMODE') 
	}

	horizontalMode() { //console.log('HORIZONTALMODE')
	}

}


class sliderViewPanel extends sliderView {
	constructor(conf) {
		super(conf);

		this.renderPanelWrapper()
		this.renderMinInput();
		this.renderMaxInput();
		this.renderStepInput();
		this.renderFromInput();
		this.renderToInput();
		this.renderIsVerticalToggle();
		this.renderIsRangeToggle();
		this.renderIsScaleToggle();
		this.renderIsBarToggle();
		this.renderIsTipToggle();
	}
	renderPanelWrapper() {
		this.panelWrapper = document.createElement('div');
		this.panelWrapper.className = 'rs__panelWrapper';
		this.slider.append(this.panelWrapper);
		this.panelTop = document.createElement('div');
		this.panelTop.className = 'rs__panel rs__panel-top';
		this.panelWrapper.append(this.panelTop);
		this.panelBottom = document.createElement('div');
		this.panelBottom.className = 'rs__panel rs__panel-bottom';
		this.panelWrapper.append(this.panelBottom);
	}


	renderMinInput() {
		this.minLabel = document.createElement('label');
		this.minLabel.innerText = 'min';
		this.minInput = document.createElement('input');
		this.minInput.value = this.conf.range[0];
		this.minInput.className = 'rs__input rs__input-min';
		this.minLabel.append(this.minInput);
		this.panelTop.append(this.minLabel);
	}


	renderMaxInput() {
		this.maxLabel = document.createElement('label');
		this.maxLabel.innerText = 'max';
		this.maxInput = document.createElement('input');
		this.maxInput.value = this.conf.range[1];
		this.maxInput.className = 'rs__input rs__input-max';
		this.maxLabel.append(this.maxInput);
		this.panelTop.append(this.maxLabel);
	}


	renderStepInput() {
		this.stepLabel = document.createElement('label');
		this.stepLabel.innerText = 'step';
		this.stepInput = document.createElement('input');
		this.stepInput.value = this.conf.step;
		this.stepInput.className = 'rs__input rs__input-step';
		this.stepLabel.append(this.stepInput);
		this.panelTop.append(this.stepLabel);
	}



	renderFromInput() {
		this.fromLabel = document.createElement('label');
		this.fromLabel.innerText = 'from';
		this.fromInput = document.createElement('input');
		this.fromInput.value = this.conf.values[0];
		this.fromInput.className = 'rs__input rs__input-from';
		this.fromLabel.append(this.fromInput);
		this.leftControlStartVal = this.conf.values[0];
		this.panelTop.append(this.fromLabel);
	}

	renderToInput() {
		this.toLabel = document.createElement('label');
		this.toLabel.innerText = 'to';
		this.toInput = document.createElement('input');
		this.toInput.value = this.conf.values[1];
		this.toInput.className = 'rs__input rs__input-to';
		this.toLabel.append(this.toInput);
		this.rightControlStartVal = this.conf.values[1];
		this.panelTop.append(this.toLabel);
	}

	renderIsVerticalToggle() {
		this.isVerticalToggle = document.createElement('label');
		this.isVerticalToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isVerticalToggle);

		this.isVerticalToggleInput = document.createElement('input');
		this.isVerticalToggleInput.type = 'checkbox';
		this.isVerticalToggleInput.checked = 'checked';
		this.isVerticalToggleInput.className = 'rs__verticalModeToggle';

		this.isVerticalToggleSpan = document.createElement('span');
		this.isVerticalToggleSpan.className = 'togglemark';

		this.isVerticalToggleLabel = document.createElement('label');
		this.isVerticalToggleLabel.className = 'togglemark__label';
		this.isVerticalToggleLabel.innerText = 'vertical';


		this.isVerticalToggle.append(this.isVerticalToggleInput);
		this.isVerticalToggle.append(this.isVerticalToggleSpan);
		this.isVerticalToggle.append(this.isVerticalToggleLabel);
	}

	renderIsRangeToggle() {
		this.isRangeToggle = document.createElement('label');
		this.isRangeToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isRangeToggle);

		this.isRangeToggleInput = document.createElement('input');
		this.isRangeToggleInput.type = 'checkbox';
		this.isRangeToggleInput.checked = 'checked';
		this.isRangeToggleInput.className = 'rs__rangeModeToggle';


		this.isRangeToggleSpan = document.createElement('span');
		this.isRangeToggleSpan.className = 'togglemark';

		this.isRangeToggleLabel = document.createElement('label');
		this.isRangeToggleLabel.className = 'togglemark__label';
		this.isRangeToggleLabel.innerText = 'range';


		this.isRangeToggle.append(this.isRangeToggleInput);
		this.isRangeToggle.append(this.isRangeToggleSpan);
		this.isRangeToggle.append(this.isRangeToggleLabel);
	}




	renderIsScaleToggle() {
		this.isScaleToggle = document.createElement('label');
		this.isScaleToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isScaleToggle);

		this.isScaleToggleInput = document.createElement('input');
		this.isScaleToggleInput.type = 'checkbox';
		this.isScaleToggleInput.checked = 'checked';
		this.isScaleToggleInput.className = 'rs__scaleModeToggle';


		this.isScaleToggleSpan = document.createElement('span');
		this.isScaleToggleSpan.className = 'togglemark';

		this.isScaleToggleLabel = document.createElement('label');
		this.isScaleToggleLabel.className = 'togglemark__label';
		this.isScaleToggleLabel.innerText = 'scale';


		this.isScaleToggle.append(this.isScaleToggleInput);
		this.isScaleToggle.append(this.isScaleToggleSpan);
		this.isScaleToggle.append(this.isScaleToggleLabel);
	}


	renderIsBarToggle() {
		this.isBarToggle = document.createElement('label');
		this.isBarToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isBarToggle);

		this.isBarToggleInput = document.createElement('input');
		this.isBarToggleInput.type = 'checkbox';
		this.isBarToggleInput.checked = 'checked';
		this.isBarToggleInput.className = 'rs__barModeToggle';


		this.isBarToggleSpan = document.createElement('span');
		this.isBarToggleSpan.className = 'togglemark';

		this.isBarToggleLabel = document.createElement('label');
		this.isBarToggleLabel.className = 'togglemark__label';
		this.isBarToggleLabel.innerText = 'bar';


		this.isBarToggle.append(this.isBarToggleInput);
		this.isBarToggle.append(this.isBarToggleSpan);
		this.isBarToggle.append(this.isBarToggleLabel);
	}


	renderIsTipToggle() {
		this.isTipToggle = document.createElement('label');
		this.isTipToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isTipToggle);

		this.isTipToggleInput = document.createElement('input');
		this.isTipToggleInput.type = 'checkbox';
		this.isTipToggleInput.checked = 'checked';
		this.isTipToggleInput.className = 'rs__tipModeToggle';


		this.isTipToggleSpan = document.createElement('span');
		this.isTipToggleSpan.className = 'togglemark';

		this.isTipToggleLabel = document.createElement('label');
		this.isTipToggleLabel.className = 'togglemark__label';
		this.isTipToggleLabel.innerText = 'tip';


		this.isTipToggle.append(this.isTipToggleInput);
		this.isTipToggle.append(this.isTipToggleSpan);
		this.isTipToggle.append(this.isTipToggleLabel);
	}
	//ввод значения FROM
	bindFromChange(eventHandler) {
		this.fromInput.addEventListener('input', (e) => {
			eventHandler(this.fromInput.value);
		})
	}

	//ввод значения TO
	bindToChange(eventHandler) {
		this.toInput.addEventListener('input', (e) => {
			eventHandler(this.toInput.value);
		})
	}

	//щелчок по чекбоксу VERTICAL
	bindCheckIsVerticalControl(checkedEventHandler, notCheckedEventHandler) {

		this.isVerticalToggleInput.addEventListener('change', (e) => {
			this.isVerticalToggleInput.checked ? checkedEventHandler(e) : notCheckedEventHandler(e)
		})
	}

	//Эмуляция события ввода в инпут
	createEvent(input, pos) {

		input.value = this.conf.range[1] * pos;
		let event = new Event('input', {
			bubbles: true,
			cancelable: true,
		});

		this.fromInput.dispatchEvent(event);
	}


	//щелчок по чекбоксу RANGE
	bindCheckIsRangeControl(checkedEventHandler, notCheckedEventHandler) {

		this.isRangeToggleInput.addEventListener('change', (e) => {


			if (this.isRangeToggleInput.checked) {

				if (parseInt(this.fromInput.value) >= parseInt(this.toInput.value))
					this.createEvent(this.fromInput, 0.0001);
				checkedEventHandler(e)
			}
			else {
				notCheckedEventHandler(e)
			}
		})
	}


	//Обновление значений инпутов FROM и TO при перемещении ползунков
	updateFromTo(elem, newValue) {
		elem.classList.contains('rs__control-min') ? this.fromInput.value = newValue : this.toInput.value = newValue;
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

		this.viewDoubleControl.bindMoveControl(this.handleGetControlData, this.handlecomputeControlPosFromEvent);// вешаем обработчики handleGetControlData и handlecomputeControlPosFromEvent для обработки в view события захвата и перетаскивания ползунка
		this.viewScale.bindClickOnScale(this.handleGetControlData, this.handlecomputeControlPosFromEvent);// вешаем обработчики handleGetControlData и handlecomputeControlPosFromEvent для обработки в view события клика по шкале


		this.viewPanel.bindCheckIsRangeControl(this.handleIsRangeChecked, this.handleIsRangeNotChecked);
		this.viewPanel.bindCheckIsVerticalControl(this.handleIsVerticalChecked, this.handleIsVerticalNotChecked);
		this.viewPanel.bindFromChange(this.handleFromChanged);
		this.viewPanel.bindToChange(this.handleToChanged);
		this.view.bindMouseUp(this.handleMouseUp);//вешаем обработчик handleMouseUp для обработки в view события отпускания кнопки (завершение перетаскивания ползунка)


		this.model.bindControlPosUpdated(this.handleOnControlPosUpdated)//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindprogressBarUpdated(this.handleOnprogressBarUpdated)//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindСontrolValueUpdated(this.handleOnСontrolValueUpdated)//Вызываем для обновления панели (обращение к view)

	}



	//вызываем метод GetControlData в модели
	handleGetControlData = (controlData) => {
		this.model.getControlData(controlData)
	}


	// вызываем метод computeControlPosFromEvent в модели
	handlecomputeControlPosFromEvent = (e) => {
		this.model.computeControlPosFromEvent(e);
	}


	//вызываем метод updateСurrentControl в view
	handleOnprogressBarUpdated = (selectedLeft, selectedWidth) => {
		this.viewScale.updateProgressBar(selectedLeft, selectedWidth);
	}

	//вызываем метод updateСurrentControl в view
	handleOnControlPosUpdated = (elem, newLeft) => {
		this.viewDoubleControl.updateControlPos(elem, newLeft);
	}

	//вызываем метод updateСurrentControl в view
	handleOnСontrolValueUpdated = (elem, newValue) => {
		this.viewPanel.updateFromTo(elem, newValue);
	}


	handleIsRangeChecked = (e) => {
		this.viewDoubleControl.doubleMode();
		this.model.computeControlPosFromEvent(e);

	}

	handleIsRangeNotChecked = (e) => {
		this.viewDoubleControl.singleMode();
		this.model.computeControlPosFromEvent(e);

	}

	handleFromChanged = (val) => {
		this.model.computeControlPosFromVal(val, false, this.viewDoubleControl.leftControl);
	}


	handleToChanged = (val) => {
		this.model.computeControlPosFromVal(val, false, this.viewDoubleControl.rightControl);
	}
	handleIsVerticalChecked = () => {
		this.viewDoubleControl.verticalMode();
	}

	handleIsVerticalNotChecked = () => {
		this.viewDoubleControl.horisontalMode();
	}


	// снимаем обработчики, повешенные на событие перемещения мыши
	handleMouseUp = (e) => {
		document.removeEventListener('mousemove', this.handlecomputeControlPosFromEvent);
		//	document.removeEventListener('mouseup', this.handleMouseUp);
		document.removeEventListener('touchmove', this.handlecomputeControlPosFromEvent);
		//	document.removeEventListener('touchend', this.handleMouseUp);
	}
}

let conf = {
	target: '.rs__wrapper',
	range: [0, 10000],
	values: [2000, 7000],
	step: 1000
}

new sliderController(
	new sliderModel(conf),
	new sliderView(conf),
	new sliderViewScale(conf),
	new sliderViewDoubleControl(conf),
	new sliderViewPanel(conf),
);


