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
	//#3-1 - Вешаем обработчик события изменения модели. В данном случае в callback будет передан метод view.displayChangedCounters, т.к. связка с ним задана в контроллере (controller: this.model.bindCounterListChanged(this.handleOnCounterListChanged)) 
	bindCounterListChanged(callback) {
		this.counterListChanged = callback
	}

	//	2-5 вызывает метод counterListChanged и обновляет localstorage 
	_commit(counterList, counterListtoDisplay) {
		this.counterListChanged(counterList, counterListtoDisplay); // Вызываем для обновления view после изменения модели
		localStorage.setItem('counters', JSON.stringify(counterList));
		localStorage.setItem('countersToDisplay', JSON.stringify(counterListtoDisplay))
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

	// #2-4 Метод changeCounter получает измененный каунтер и его text, проверяет все каунтеры, ищет по text каунтер, значение которого изменилось, меняет соответствующий каунтер в модели и вызывает метод _commit
	changeCounter(text, editedCounter) {
		//Формируем this.counters - они содержат все категории
		this.counters = this.counters.map((counter) =>
			counter.text === text ? { text: counter.text, type: counter.type, cnt: editedCounter } : counter,
		)

		//Формируем this.countersToDisplay - они могут объединять несколько категории в одну (например "Взрослые", "Дети" --> "Гости") в зависимости от типа категории 
		//! Здесь еще нужно добавить склонение названий по падежам!
		let arr = [];
		for (let i = 0; i < this.counters.length; i++) {
			// Если категории такого типа еще нет
			if (i == 0 || i > 0 && this.counters[i].type != this.counters[i - 1].type) {
				//console.log('НЕРАВНЫ');
				let type = this.counters[i].type;
				let cnt = this.counters[i].cnt;
				let elem = {};
				elem.type = type;
				elem.cnt = cnt;
				// То добавить в массив, который в конце будет присвоен this.countersToDisplay				
				arr.push(elem);
			}
			// Если  категория такого типа уже есть
			if (i > 0 && this.counters[i].type == this.counters[i - 1].type) {
				//console.log('РАВНЫ');
				let elem = arr.find(item => item.type == this.counters[i].type);
				// То в массив не добавлять, а прибавить значение к значению счетчика этой категории				
				elem.cnt = String(parseInt(elem.cnt) + parseInt(this.counters[i].cnt))
			}
		}
		this.countersToDisplay = arr;
		this._commit(this.counters, this.countersToDisplay);
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

	//#3-5 - Обновление view после каждого изменения модели
	displayChangedCounters(counters, countersToDisplay) {
		// обновляем INPUT
		let value = '';
		countersToDisplay.forEach(counter => {
			value += counter.cnt + ' ' + counter.type + ', ';
		});
		this.input.value = value;
		// обновляем значения в строках со счетчиками
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
}

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.handleInitialCounterList(this.view.listElems);//#1-1 запускаем обработчик handleInitialCounterList  для передачи первоначального списка li (получен в классе view) в модель
		this.view.bindChangeCounter(this.handleChangeCounter);// #2-2 запускаем обработчик handleChangeCounter при возникновении в view события клика по кнопкам "плюс" и "минус"
		this.model.bindCounterListChanged(this.handleOnCounterListChanged)//#3-3 - запускаем обработчик handleOnCounterListChanged при возникновении в модели события ее изменения 
	}

	//#1-2 Обработчик handleInitialCounterList вызывает метод initialCounterList в модели
	handleInitialCounterList = counterList => {
		this.model.initialCounterList(counterList);
	}


	// #2-3 Обработчик handleChangeCounter вызывает метод changeCounter в модели
	handleChangeCounter = (text, editedCounter) => {
		this.model.changeCounter(text, editedCounter)
	}

	//#3-4 - Обработчик handleOnCounterListChanged вызывает метод displayChangedCounters в view
	handleOnCounterListChanged = (counters, countersToDisplay) => {
		this.view.displayChangedCounters(counters, countersToDisplay);
	}
}

new Controller(new Model(), new View('.dropdown-wrapper_narrow'))
new Controller(new Model(), new View('.dropdown-wrapper_wide'))




