class Model {
	constructor() {
		this.counters;

	}

	//#6-2 - Вызываем метод onCounterListChanged (в контроллере) для обновления view после изменения модели
	bindCounterListChanged(callback) {
		this.onCounterListChanged = callback
	}

	_commit(counterList) {
		this.onCounterListChanged(counterList); //#6-1 - Вызываем для обновления view после изменения модели
		localStorage.setItem('counters', JSON.stringify(counterList))
	}
	//#3 Получаем в модель данные  о первоначальном списке li (массив объектов вида [{id: 0, text: "спальни", cnt: "2"}, ...]) (полученные в классе view, переданные через controller), заносим в localStorage
	initialCounterList(counterList) {
		//this._commit(counterList);
		localStorage.setItem('counters', JSON.stringify(counterList));
		this.counters = JSON.parse(localStorage.getItem('counters'));
	}

	// #5-4 Проверяем все каунтеры, ищем по ID каунтер, значение которого изменилось (на основании данных из view->controller) и меняем соответсвующий каунтер в модели
	editCounter(id, editedCounter) {
		this.counters = this.counters.map((counter) =>
			counter.id === id ? { id: counter.id, text: counter.text, cnt: editedCounter } : counter,
		)
		this._commit(this.counters);
	}
}


class View {
	constructor(root) {

		this.dropdownWrapper = document.querySelector(root);
		this.input = this.dropdownWrapper.querySelector('.input');
		this.counters = this.dropdownWrapper.querySelector('.counter');
		this.decrements = this.dropdownWrapper.querySelectorAll('.count_decrem');
		this.increments = this.dropdownWrapper.querySelectorAll('.count_increm');
		this.listElems = this.counters.children;
		this.counterList = this.bindInitialCounterList();// #1 получаем первоначальный список li (из разметки) и создаем массив объектов вида [{id: 0, text: "спальни", cnt: "2"}, ...]
	}
	// №4 Устанавливаем объектам LI значения ID (на основании данных, ранее переданных в модель)
	assignCounterID(counters) {
		counters.forEach(counter => {
			this.listElems[counter.id].id = counter.id; //присваиваем ID узлам li
		})
	}


	//#6-5 - Обновление view после каждого изменения модели
	displayUpdatedCounters(counters) {
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


	// #5-1 Вешаем обработчики событий клика по кнопкам "плюс" и "минус"
	bindEditCounter(handler) {
		for (let elem of this.decrements) {
			elem.addEventListener('click', event => {
				const id = parseInt(event.target.parentElement.parentElement.id);
				let currentCounter = parseInt(event.target.nextSibling.innerText);
				let editedCounter = String(currentCounter - 1);
				handler(id, editedCounter)
			})
		}
	}

	// #1 получаем первоначальный список li (из разметки) и создаем массив объектов вида [{id: 0, text: "спальни", cnt: "2"}, ...]
	bindInitialCounterList() {

		let counterList = [];
		for (let i = 0; i < this.listElems.length; i++) {
			let elemObj = {};
			let catName = this.listElems[i].querySelector('.counter-category__name');
			let catCnt = this.listElems[i].querySelector('.count__value');
			elemObj.id = i;
			elemObj.text = catName.innerText;
			elemObj.cnt = catCnt.innerText;
			counterList.push(elemObj);
		}
		return counterList;
	}
}

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.handleInitialCounterList(this.view.counterList);//#2 Передаем в модель первоначальный список li (полученные в классе view), массив объектов вида [{id: 0, text: "спальни", cnt: "2"}, ...]
		this.onInitialCounterListSet(this.model.counters); // №4 Устанавливаем объектам LI значения ID (на основании данных, ранее переданных в модель)
		this.view.bindEditCounter(this.handleEditCounter);// #5-2 Ловим события клика по кнопкам "плюс" и "минус"
		this.model.bindCounterListChanged(this.onCounterListChanged)//#6-3 - связка с методом onCounterListChanged (в контроллере) для обновления view после изменения модели (чтобы его можно было вызывать из модели)
	}


	//#6-4 - Вызываем метод onCounterListChanged (в контроллере) для обновления view после изменения модели
	onCounterListChanged = counters => {
		this.view.displayUpdatedCounters(counters);
	}


	// #5-3 Передаем в модель событии клика по кнопкам "плюс" и "минус"
	handleEditCounter = (id, editedCounter) => {
		this.model.editCounter(id, editedCounter)
	}

	//#2 Передаем в модель первоначальный список li (полученные в классе view), массив объектов вида [{id: 0, text: "спальни", cnt: "2"}, ...]
	handleInitialCounterList = (counterList) => {
		this.model.initialCounterList(counterList);

	}

	// №4 Устанавливаем объектам LI значения ID (на основании данных, ранее переданных в модель)
	onInitialCounterListSet = counters => {
		this.view.assignCounterID(counters)
	}
}


new Controller(new Model(), new View('.dropdown-wrapper'))




