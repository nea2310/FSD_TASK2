const counter = jQuery('document').ready(function ($) {

	// $("div[data-type='dropdown']").children('.input-label').children('.input').click(function () {
	// 	$(this).parents('.dropdown-wrapper').children('.dropdown-countwrapper').toggleClass('dropdown-countwrapper_collapsed');
	// 	$(this).toggleClass('input_collapsed');
	// 	$(this).toggleClass('input_expanded')
	// })

	$("div[data-type='dropdown']").children('.input-label').children('.input').prop("value", function (i, text) {

		if (text.length >= 10) {
			text = text.substring(0, 10);
			var lastIndex = text.lastIndexOf(" ");       // позиция последнего пробела
			text = text.substring(0, lastIndex) + '...'; // обрезаем до последнего слова
		}

		$(this).prop("value", text);


	});



	// $('.dropdown-submit').click(function () {
	// 	$(this).parents('.dropdown-countwrapper').addClass('dropdown-countwrapper_collapsed');
	// 	$(this).parents('.dropdown-wrapper').children('.input-wrapper').children('.input-label').children('.input').addClass('input_collapsed')
	// 	$(this).parents('.dropdown-wrapper').children('.input-wrapper').children('.input-label').children('.input').removeClass('input_expanded')
	// })



	// $('.dropdown-clean').click(function () {
	// 	let input = $(this).parents('.dropdown-wrapper').children('.input-wrapper').children('.input-label').children('.input');
	// 	let default_val = input.attr('value');
	// 	$(this).parents('.dropdown-countwrapper').children('.counter').children('.counter-category').children('.count-wrapper').children('.count_decrem').addClass('count_inactive')
	// 	$(this).parents('.dropdown-countwrapper').children('.counter').children('.counter-category').children('.count-wrapper').children('.count__value').text('0').addClass('count__value_inactive')
	// 	input.val(default_val);
	// 	$(this).children('.action').addClass('action_inactive');

	// })

	// $('.count').click(function () {
	// 	let clearButton = $(this).parents('.dropdown-countwrapper').children('.button-wrapper').children('.dropdown-clean').children('div');
	// 	if ($(this).hasClass('count_increm')) {
	// 		let count = $(this).prev();
	// 		let count_val = count.text();
	// 		if (count_val <= 98) {
	// 			count.text(++count_val);
	// 			if (clearButton.hasClass('action_inactive'))
	// 				clearButton.removeClass('action_inactive');
	// 		}
	// 		let decrement = $(this).siblings('.count_decrem');
	// 		if (decrement.hasClass('count_inactive'))
	// 			decrement.removeClass('count_inactive')

	// 	}
	// 	else if ($(this).hasClass('count_decrem')) {
	// 		let count = $(this).next();
	// 		let count_val = count.text();
	// 		if (count_val > 1)
	// 			count.text(--count_val)
	// 		else if (count_val == 1) {
	// 			$(this).addClass('count_inactive');
	// 			count.text(--count_val);
	// 			let inactiveCategories = $(this).parents('.counter').children('.counter-category').children('.count-wrapper').children('.count_inactive');
	// 			let Categories = $(this).parents('.counter').children('.counter-category');
	// 			console.log(inactiveCategories);
	// 			console.log(Categories);
	// 			if (inactiveCategories.length == Categories.length)
	// 				clearButton.addClass('action_inactive');
	// 		}
	// 		else
	// 			count.text(count_val);
	// 	}

	// 	let list = $(this).parents('.counter').children('.counter-category');
	// 	let category_names = [];
	// 	let category_counters = [];

	// 	list.each(function (indx) {
	// 		category_names.push($(this).children('.counter-category__name').text());
	// 		category_counters.push($(this).children('.count-wrapper').children('.count__value').text());
	// 	});


	// 	let cat1_name;
	// 	let cat1_value;
	// 	let cat2_name;
	// 	let cat2_value;
	// 	let cat3_name;
	// 	let cat3_value;
	// 	let str;
	// 	switch (category_names[0]) {
	// 		case 'взрослые':
	// 			cat1_value = Number(category_counters[0]) + Number(category_counters[1]);
	// 			switch (cat1_value) {
	// 				case 1:
	// 					cat1_name = 'гость';
	// 					break;
	// 				case 2:
	// 				case 3:
	// 				case 4:
	// 					cat1_name = 'гостя';
	// 					break;
	// 				default:
	// 					cat1_name = 'гостей';
	// 			}
	// 			cat2_value = Number(category_counters[2]);
	// 			switch (cat2_value) {
	// 				case 0:
	// 					cat2_name = '';
	// 					break;
	// 				case 1:
	// 					cat2_name = 'младенец';
	// 					break;
	// 				case 2:
	// 				case 3:
	// 				case 4:
	// 					cat2_name = 'младенца';
	// 					break;
	// 				default:
	// 					cat2_name = 'младенцев';
	// 			}
	// 			str = cat1_value + ' ' + cat1_name + ', ' + cat2_value + ' ' + cat2_name
	// 			if (str.substr(str.length - 2) === '0 ')
	// 				str = str.substr(0, str.length - 4)
	// 			break;

	// 		case 'спальни':
	// 			cat1_value = Number(category_counters[0]);
	// 			switch (cat1_value) {
	// 				case 1:
	// 					cat1_name = 'спальня';
	// 					break;
	// 				case 2:
	// 				case 3:
	// 				case 4:
	// 					cat1_name = 'спальни';
	// 					break;
	// 				default:
	// 					cat1_name = 'спален';
	// 			}
	// 			cat2_value = Number(category_counters[1]);
	// 			switch (cat2_value) {
	// 				case 1:
	// 					cat2_name = 'кровать';
	// 					break;
	// 				case 2:
	// 				case 3:
	// 				case 4:
	// 					cat2_name = 'кровати';
	// 					break;
	// 				default:
	// 					cat2_name = 'кроватей';
	// 			}
	// 			cat3_value = Number(category_counters[2]);
	// 			switch (cat3_value) {
	// 				case 1:
	// 					cat3_name = 'ванная комната';
	// 					break;
	// 				case 2:
	// 				case 3:
	// 				case 4:
	// 					cat3_name = 'ванные комнаты';
	// 					break;
	// 				default:
	// 					cat3_name = 'ванных комнат';
	// 			}
	// 			str = cat1_value + ' ' + cat1_name + ', ' + cat2_value + ' ' + cat2_name + ', ' + cat3_value + ' ' + cat3_name
	// 			break;

	// 		default:
	// 			cat1_name = '';
	// 			cat2_name = '';
	// 			cat3_name = '';
	// 	}


	// 	$(this).parents('.dropdown-wrapper').children('.input-wrapper').children('.input-label').children('.input').val(str);


	// });

	// $(document).mouseup(function (e) { // событие клика по веб-документу
	// 	let block = $('.dropdown-wrapper'); // тут указываем ID элемента
	// 	if (!block.is(e.target) // если клик был не по нашему блоку
	// 		&& block.has(e.target).length === 0) { // и не по его дочерним элементам
	// 		$('.dropdown-countwrapper').addClass('dropdown-countwrapper_collapsed')// скрываем его
	// 		block.children('.input-wrapper').children('.input-label').children('.input').addClass('input_collapsed')// скрываем его
	// 		block.children('.input-wrapper').children('.input-label').children('.input').removeClass('input_expanded')// скрываем его
	// 	}
	// });


});
export { counter }
