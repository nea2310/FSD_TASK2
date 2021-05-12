function collapse(selector) {
	let elemsToCollapse = document.querySelectorAll(selector);
	if (selector == '.dropdown-wrapper') {
		for (let elem of elemsToCollapse) {
			let DropDownCountWrapper = elem.querySelector('.dropdown-countwrapper');
			let DropDownInput = elem.querySelector('.input');
			DropDownCountWrapper.classList.add('dropdown-countwrapper_collapsed');
			DropDownInput.classList.add('input_collapsed');
			DropDownInput.classList.remove('input_expanded');
		}
	}
	if (selector == '') {
	}
	if (selector == '') {
	}
}

function insideClick(elem, parentElemSelector) {
	if (elem.closest(parentElemSelector)) {
		return true;
	}
	else {
		return false;
	}
}

class Model {

	//#3-1-1 - Вешаем обработчик события изменения модели. В данном случае в callback будет передан метод view.updateChangedCounters, т.к. связка с ним задана в контроллере (controller: this.model.bindCounterListChanged(this.handleOnCounterListChanged)) 
	bindCounterListToDisplayChanged(callback) {
		this.counterListToDisplayChanged = callback
	}

	//#3-1-2 - Вешаем обработчик события изменения модели. В данном случае в callback будет передан метод view.updateChangedCountersToDisplay, т.к. связка с ним задана в контроллере (controller: this.model.bindCounterListToDisplayChanged(this.handleOnCounterListToDisplayChanged)) 
	bindCounterListChanged(callback) {
		this.counterListChanged = callback
	}

	//	2-5-1 вызывает метод counterListChanged и обновляет localstorage 
	_commitCounterList(counterList) {
		this.counterListChanged(counterList); // Вызываем для обновления списка категорий и их счетчиков во view после изменения модели
		localStorage.setItem('counters', JSON.stringify(counterList));
	}

	//	2-5-1 вызывает метод counterListToDisplayChanged и обновляет localstorage 
	_commitCounterListToDisplay(counterListToDisplay) {
		this.counterListToDisplayChanged(counterListToDisplay); // Вызываем для обновления главного инпута во view после изменения модели
		localStorage.setItem('countersToDisplay', JSON.stringify(counterListToDisplay));

	}

	//#1-3 Метод initialCounterList получает данные  о первоначальном списке li (полученные в классе view, переданные через controller) и преобразует в массив объектов вида [{id: 0, text: "спальни", cnt: "2"}, ...]), заносим в localStorage
	initialCounterList(counterList) {
		let counterListArr = [];
		for (let i = 0; i < counterList.length; i++) {
			let elemObj = {};
			let catName = counterList[i].querySelector('.counter-category__name');
			let catCnt = counterList[i].querySelector('.count__value');
			elemObj.text = catName.innerText;
			elemObj.type = catName.getAttribute('data-type')
			elemObj.cnt = catCnt.innerText;
			counterListArr.push(elemObj);
		}
		localStorage.setItem('counters', JSON.stringify(counterListArr));
		this.counters = JSON.parse(localStorage.getItem('counters'));
	}

	// #2-4-1 Метод changeCounter получает измененный каунтер и его text, проверяет все каунтеры, ищет по text каунтер, значение которого изменилось, меняет соответствующий каунтер в модели и вызывает методы _commitCounterList и changeCounterToDisplay
	changeCounter(text, editedCounter) {
		//Формируем this.counters - они содержат все категории
		this.counters = this.counters.map((counter) =>
			counter.text === text ? { text: counter.text, type: counter.type, cnt: editedCounter } : counter,
		)
		this._commitCounterList(this.counters);
		this.changeCounterToDisplay(this.counters);
	}

	// #2-4-2 Метод changeCounterToDisplay формирует this.countersToDisplay - они могут объединять несколько категории в одну (например "Взрослые", "Дети" --> "Гости") в зависимости от типа категории; затем вызывает  метод _commitCounterList
	changeCounterToDisplay(changedCounters) {


		//! Здесь еще нужно добавить склонение названий по падежам!
		let arr = [];
		for (let i = 0; i < changedCounters.length; i++) {
			// Если категории такого типа еще нет
			if (i == 0 || i > 0 && changedCounters[i].type != changedCounters[i - 1].type) {
				//console.log('НЕРАВНЫ');
				let type = changedCounters[i].type;
				let cnt = changedCounters[i].cnt;
				let elem = {};
				elem.type = type;
				elem.cnt = cnt;
				// То добавить в массив, который в конце будет присвоен changedCountersToDisplay				
				arr.push(elem);
			}
			// Если  категория такого типа уже есть
			if (i > 0 && changedCounters[i].type == changedCounters[i - 1].type) {
				//console.log('РАВНЫ');
				let elem = arr.find(item => item.type == changedCounters[i].type);
				// То в массив не добавлять, а прибавить значение к значению счетчика этой категории				
				elem.cnt = String(parseInt(elem.cnt) + parseInt(changedCounters[i].cnt))
			}
		}
		this.countersToDisplay = arr;
		this._commitCounterListToDisplay(this.countersToDisplay);
	}

}

class View {
	constructor(root) {
		this.parent = document;
		this.dropdownWrapper = document.querySelector(root);
		this.input = this.dropdownWrapper.querySelector('.input');
		this.inputWrapper = this.dropdownWrapper.querySelector('.input-wrapper');
		this.countWrapper = this.dropdownWrapper.querySelector('.dropdown-countwrapper');
		this.counters = this.dropdownWrapper.querySelector('.counter');
		this.counts = this.dropdownWrapper.querySelectorAll('.count');
		this.listElems = this.counters.children;
		this.submitButton = this.dropdownWrapper.querySelector('.dropdown-submit .action');
		this.dropdownWrapper.addEventListener('click', (e) => this.toggleDropdownByInsideClick(e))
		this.parent.addEventListener('mouseup', this.collapseDropdownByOutsideClick);
	}


	//Закрыть все дропдауны на странице, если кликнули мимо дропдауна (возможно надо вынести этот метод из этого класса???)
	collapseDropdownByOutsideClick(e) {
		if (insideClick(e.target, '.dropdown-wrapper')) e.preventDefault();
		else {
			collapse('.dropdown-wrapper');
		}
	}

	// Переключить состояние дропдауна, если кликнули по его инпуту или кнопке [Применить]
	toggleDropdownByInsideClick(e) {
		//Если текущий дропдаун закрыт
		if (this.input.classList.contains('input_collapsed')) {
			//Закрыть все открытые дропдауны
			collapse('.dropdown-wrapper');
		}
		//Если клик был по инпуту или кнопке [Применить]
		if (e.target == this.input || e.target == this.submitButton) {
			//Переключаем состояние текущего дропдауна	
			this.input.classList.toggle('input_collapsed');
			this.input.classList.toggle('input_expanded');
			this.countWrapper.classList.toggle('dropdown-countwrapper_collapsed');
		}
		//Если клик был по какому-либо другому элементу - не обрабатываем клик
		else e.preventDefault();
	}
	//распарсить дата-атрибуты data-min и data-max на кнопках "плюс" и "минус" и сделать их неактивными, если начальное значение равно data-min или data-max
	setInactiveButtons() {
	}


	// #2-1 Вешаем обработчики событий клика по кнопкам "плюс" и "минус"
	bindChangeCounter(handler) {
		for (let elem of this.counts) {
			elem.addEventListener('click', event => {
				const text = event.target.parentElement.parentElement.firstElementChild.innerText.toLowerCase();

				let editedCounter;
				//Для кнопки "минус"
				if (elem.classList.contains('count_decrem')) {
					// Сделать активной кнопку "плюс" при клике на кнопку "минус"					
					elem.parentElement.lastElementChild.classList.remove('count_inactive')
					let currentCounter = parseInt(event.target.nextSibling.innerText);
					//Если дошли до минимального разрешенного значения - не менять значение счетчика, иначе - уменьшить на 1
					currentCounter > parseInt(elem.getAttribute('data-min')) ? editedCounter = String(currentCounter - 1) : editedCounter = String(currentCounter);
				}

				//Для кнопки "плюс"
				else {
					// Сделать активной кнопку "минус" при клике на кнопку "плюс"				
					elem.parentElement.firstElementChild.classList.remove('count_inactive')
					let currentCounter = parseInt(event.target.previousSibling.innerText);
					//Если дошли до максимального разрешенного значения - не менять значение счетчика, иначе - увеличить на 1
					currentCounter < parseInt(elem.getAttribute('data-max')) ? editedCounter = String(currentCounter + 1) : editedCounter = String(currentCounter);
				}
				handler(text, editedCounter)
			})
		}
	}

	//#3-5-1 - Обновление view после каждого изменения модели (обновляем значения в строках со счетчиками)
	updateChangedCounters(counters) {
		for (let i = 0; i < counters.length; i++) {

			let cnt = counters[i].cnt;
			let cntToChange = this.listElems[i].querySelector('.count__value')
			let minCnt = cntToChange.previousSibling.getAttribute('data-min');
			let maxCnt = cntToChange.nextSibling.getAttribute('data-max')
			cntToChange.innerText = cnt;
			//Если обновленное значение - минимальное разрешенное значение, то сделать кнопку "минус" неактивной
			if (cnt == minCnt) {
				cntToChange.previousSibling.classList.add('count_inactive')
			};
			//Если обновленное значение - максимальное разрешенное значение, то сделать кнопку "плюс" неактивной
			if (cnt == maxCnt) {
				cntToChange.nextSibling.classList.add('count_inactive')
			}
		}
	}

	//#3-5-2 - Обновление view после каждого изменения модели (обновляем главный INPUT)
	updateChangedCountersToDisplay(countersToDisplay) {
		let value = '';
		countersToDisplay.forEach(counter => {
			value += counter.cnt + ' ' + counter.type + ', ';
		});
		this.input.value = value;
	}
}

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.handleInitialCounterList(this.view.listElems);//#1-1 запускаем обработчик handleInitialCounterList  для передачи первоначального списка li (получен в классе view) в модель
		this.view.bindChangeCounter(this.handleChangeCounter);// #2-2 запускаем обработчик handleChangeCounter при возникновении в view события клика по кнопкам "плюс" и "минус"
		this.model.bindCounterListChanged(this.handleOnCounterListChanged)//#3-3-1 - запускаем обработчик handleOnCounterListChanged при возникновении в модели события ее изменения 
		this.model.bindCounterListToDisplayChanged(this.handleOnCounterListToDisplayChanged)//#3-3-2 - запускаем обработчик handleOnCounterListToDisplayChanged при возникновении в модели события ее изменения 
	}

	//#1-2 Обработчик handleInitialCounterList вызывает метод initialCounterList в модели
	handleInitialCounterList = counterList => {
		this.model.initialCounterList(counterList);
	}


	// #2-3 Обработчик handleChangeCounter вызывает метод changeCounter в модели
	handleChangeCounter = (text, editedCounter) => {
		this.model.changeCounter(text, editedCounter)
	}

	//#3-4-1 - Обработчик handleOnCounterListChanged вызывает метод updateChangedCounters в view
	handleOnCounterListChanged = (counters) => {
		this.view.updateChangedCounters(counters);
	}

	//#3-4-1 - Обработчик handleOnCounterListToDisplayChanged вызывает метод updateChangedCountersToDisplay в view
	handleOnCounterListToDisplayChanged = (countersToDisplay) => {
		this.view.updateChangedCountersToDisplay(countersToDisplay);
	}
}

new Controller(new Model(), new View('.dropdown-wrapper_narrow'))
new Controller(new Model(), new View('.dropdown-wrapper_wide'))




