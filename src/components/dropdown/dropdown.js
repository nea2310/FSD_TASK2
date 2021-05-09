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
	//#4-1 - Вешаем обработчик события изменения модели. В данном случае в callback будет передан метод view.displayChangedCounters, т.к. связка с ним задана в контроллере (controller: this.model.bindCounterListChanged(this.handleOnCounterListChanged)) 
	bindCounterListChanged(callback) {
		this.counterListChanged = callback
	}

	//	3-5 вызывает метод counterListChanged и обновляет localstorage 
	_commit(counterList) {
		this.counterListChanged(counterList); //#6-1 - Вызываем для обновления view после изменения модели
		localStorage.setItem('counters', JSON.stringify(counterList))
	}

	//#1-3 Метод initialCounterList получает данные  о первоначальном списке li (полученные в классе view, переданные через controller) и преобразует в массив объектов вида [{id: 0, text: "спальни", cnt: "2"}, ...]), заносим в localStorage
	initialCounterList(counterList) {
		let counterListArr = [];
		for (let i = 0; i < counterList.length; i++) {
			let elemObj = {};
			let catName = counterList[i].querySelector('.counter-category__name');
			let catCnt = counterList[i].querySelector('.count__value');
			elemObj.id = i;
			elemObj.text = catName.innerText;
			elemObj.cnt = catCnt.innerText;
			counterListArr.push(elemObj);
		}
		localStorage.setItem('counters', JSON.stringify(counterListArr));
		this.counters = JSON.parse(localStorage.getItem('counters'));
	}

	// #3-4 Метод changeCounter получает измененный каунтер и его ID, проверяет все каунтеры, ищет по ID каунтер, значение которого изменилось, меняет соответствующий каунтер в модели и вызывает метод _commit
	changeCounter(id, editedCounter) {
		this.counters = this.counters.map((counter) =>
			counter.id === id ? { id: counter.id, text: counter.text, cnt: editedCounter } : counter,
		)
		this._commit(this.counters);
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


	// №2-3 Метод assignCounterID получает объект, сформированный в модели, и прописывает свойства ID объектам LI
	assignCounterID(counters) {
		counters.forEach(counter => {
			this.listElems[counter.id].id = counter.id; //присваиваем ID узлам li
		})
	}

	// #3-1 Вешаем обработчики событий клика по кнопкам "плюс" и "минус"
	bindChangeCounter(handler) {
		for (let elem of this.counts) {
			elem.addEventListener('click', event => {
				console.log(elem);
				const id = parseInt(event.target.parentElement.parentElement.id);
				let editedCounter;
				//Для кнопки "минус"
				if (elem.classList.contains('count_decrem')) {
					let currentCounter = parseInt(event.target.nextSibling.innerText);
					editedCounter = String(currentCounter - 1);
				}
				//Для кнопки "плюс"
				else {
					let currentCounter = parseInt(event.target.previousSibling.innerText);
					editedCounter = String(currentCounter + 1);
				}
				handler(id, editedCounter)
			})
		}
	}

	//#4-5 - Обновление view после каждого изменения модели
	displayChangedCounters(counters) {
		// обновляем INPUT
		let value = '';
		counters.forEach(counter => {
			value += counter.cnt + ' ' + counter.text + ', ';
		})
		this.input.value = value;
		// обновляем значения в строках со счетчиками
		for (let elem of counters) {
			let id = elem.id;
			let cnt = elem.cnt;
			let cntToChange = this.listElems[id].querySelector('.count__value');
			cntToChange.innerText = cnt;
		}
	}
}

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.handleInitialCounterList(this.view.listElems);//#1-1 запускаем обработчик handleInitialCounterList  для передачи первоначального списка li (получен в классе view) в модель
		this.handleCounterID(this.model.counters); // №2-1 запускаем обработчик handleCounterID для установки объектам LI значения ID (на основании объекта, сформированного в модели)
		this.view.bindChangeCounter(this.handleChangeCounter);// #3-2 запускаем обработчик handleChangeCounter при возникновении в view события клика по кнопкам "плюс" и "минус"
		this.model.bindCounterListChanged(this.handleOnCounterListChanged)//#4-3 - запускаем обработчик handleOnCounterListChanged при возникновении в модели события ее изменения 
	}

	//#1-2 Обработчик handleInitialCounterList вызывает метод initialCounterList в модели
	handleInitialCounterList = counterList => {
		this.model.initialCounterList(counterList);
	}

	// №2-2 Обработчик handleCounterID вызывает метод assignCounterID в view
	handleCounterID = counters => {
		this.view.assignCounterID(counters)
	}

	// #3-3 Обработчик handleChangeCounter вызывает метод changeCounter в модели
	handleChangeCounter = (id, editedCounter) => {
		this.model.changeCounter(id, editedCounter)
	}

	//#4-4 - Обработчик handleOnCounterListChanged вызывает метод displayChangedCounters в view
	handleOnCounterListChanged = counters => {
		this.view.displayChangedCounters(counters);
	}
}

new Controller(new Model(), new View('.dropdown-wrapper_narrow'))
new Controller(new Model(), new View('.dropdown-wrapper_wide'))




