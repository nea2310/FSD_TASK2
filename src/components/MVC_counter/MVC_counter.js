class Model {
	constructor() {
		// The state of the model, an array of todo objects, prepopulated with some data
		this.counters = [
			{ id: 1, text: 'взрослый', cnt: 1 },
			{ id: 2, text: 'ребенок', cnt: 0 },
			{ id: 3, text: 'младенец', cnt: 0 },
		]
	}



	// Map through all counters, and replace the cnt of the counter with the specified id
	changeCounter(id, updatedCnt) {
		this.counters = this.counters.map((counter) =>
			counter.id === id ? { id: counter.id, cnt: updatedCnt } : counter,
		)
	}
}



class View {
	constructor(root, categories, options) {

		this.dropdownWrapper = document.querySelector(root);
		this.dropdownWrapper.className = 'dropdown-wrapper dropdown-wrapper_narrow';



		this.createElement({ elemName: 'input', elemType: 'div', elemParent: 'dropdownWrapper', elemClassName: 'input-wrapper' }, { 'data-type': 'dropdown' })
		this.createElement({ elemName: 'label', elemType: 'label', elemParent: 'input', elemClassName: 'input-label' })
		this.createElement({ elemName: 'icon', elemType: 'i', elemParent: 'label', elemClassName: 'maticons  maticons-grey maticons-base', elemInnerText: 'keyboard_arrow_down' })
		this.createElement({ elemName: 'text', elemType: 'input', elemParent: 'label', elemClassName: 'input input_collapsed' }, { 'placeholder': options.placeholder, 'readonly': 'readonly' })
		this.createElement({ elemName: 'counterWrapper', elemType: 'div', elemParent: 'dropdownWrapper', elemClassName: 'dropdown-countwrapper dropdown-countwrapper_collapsed dropdown-countwrapper_narrow' })
		this.createElement({ elemName: 'counter', elemType: 'ul', elemParent: 'counterWrapper', elemClassName: 'counter' })


		for (let elem of categories) {
			this.createElement({ elemName: 'counterCategory', elemType: 'li', elemParent: 'counter', elemClassName: 'counter-category' })
			this.createElement({ elemName: 'counterCategoryName', elemType: 'p', elemParent: 'counterCategory', elemClassName: 'counter-category__name', elemInnerText: elem[0] })
			this.createElement({ elemName: 'countWrapper', elemType: 'div', elemParent: 'counterCategory', elemClassName: 'count-wrapper' })
			this.createElement({ elemName: 'countDecrem', elemType: 'a', elemParent: 'countWrapper', elemClassName: 'count count_decrem count_inactive', elemInnerText: '-' })
			this.createElement({ elemName: 'countValue', elemType: 'span', elemParent: 'countWrapper', elemClassName: 'count__value', elemInnerText: elem[1] })
			this.createElement({ elemName: 'countIncrem', elemType: 'a', elemParent: 'countWrapper', elemClassName: 'count count_increm', elemInnerText: '+' })

		}










	}

	createElement(elemOptions, elemAttrs = {}) {
		this[elemOptions.elemName] = document.createElement(elemOptions.elemType);
		this[elemOptions.elemParent].append(this[elemOptions.elemName]);
		this[elemOptions.elemName].className = elemOptions.elemClassName;

		if (elemOptions.elemInnerText) {
			console.log(elemOptions.elemInnerText);
			this[elemOptions.elemName].innerText = elemOptions.elemInnerText;
		}



		for (let key in elemAttrs) {
			this[elemOptions.elemName].setAttribute(key, elemAttrs[key]);
		}


	}


}


new View('.MVC_counter',
	[
		['спальни', '2'],
		['кровати', '2'],
		['ванные комнаты', '0']
	],
	{
		placeholder: '2 спальни, 2 кровати...',
		width: '',
		applyButton: false
	});