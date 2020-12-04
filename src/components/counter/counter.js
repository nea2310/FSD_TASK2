const counter =jQuery('document').ready(function($) {
	$("div[data-type='dropdown']").click(function () {
		$(this).parents('.dropdown-wrapper').children('.dropdown-countwrapper').removeClass('dropdown-countwrapper_collapsed')
	})


	$("a[rel='nofollow']");

	$('.dropdown-submit').click(function () {
		$(this).parents('.dropdown-countwrapper').addClass('dropdown-countwrapper_collapsed')
	})

	$('.dropdown-clean').click(function () {
		let input = $(this).parents('.dropdown-wrapper').children('.input-wrapper').children('.input-label').children('.input');
		let default_val = input.attr('value');
		input.val(default_val);
	})

	$('.count').click(function () {

		if ($(this).hasClass('count_increm')) {
			let count = $(this).prev();
			let count_val = count.text();
				if (count_val<=98)
					count.text(++count_val);
			let decrement = $(this).siblings('.count_decrem');
				if (decrement.hasClass('count_inactive'))
					decrement.removeClass('count_inactive')

		}
		else if ($(this).hasClass('count_decrem')) {
			let count = $(this).next();
			let count_val = count.text();
				if (count_val>0)
					count.text(--count_val)
				else
					count.text(count_val);
					$(this).addClass('count_inactive')

		}

		let list = $(this).parents('.counter').children('.counter-category');
		let category_names = [];
		let category_counters = [];

		list.each(function(indx){
			category_names.push($(this).children('.counter-category__name').text());
			category_counters.push($(this).children('.count-wrapper').children('.count__value').text());
					});

		console.log(category_names);
		console.log(category_counters);
		let cat1_name;
		let cat1_value;
		let cat2_name;
		let cat2_value;
		let cat3_name;
		let cat3_value;
		let str;
			switch (category_names[0]){
				case 'взрослые':
					cat1_value = Number(category_counters[0]) + Number(category_counters[1]);
					switch (cat1_value) {
						case 1:
							cat1_name = 'гость';
							break;
						case 2:
						case 3:
						case 4:
							cat1_name = 'гостя';
							break;
						default:
							cat1_name = 'гостей';
					}
					cat2_value = Number(category_counters[2]);
					switch (cat2_value) {
						case 0:
							cat2_name = '';
							break;
						case 1:
							cat2_name = 'младенец';
							break;
						case 2:
						case 3:
						case 4:
							cat2_name = 'младенца';
							break;
						default:
							cat2_name = 'младенцев';
					}
					str = cat1_value + ' ' + cat1_name + ', ' + cat2_value + ' '+ cat2_name
						if(str.substr(str.length - 2 )==='0 ')
							str = str.substr(0, str.length - 4)
					break;

				case 'спальни':
					cat1_value = Number(category_counters[0]);
					switch (cat1_value) {
						case 1:
							cat1_name = 'спальня';
							break;
						case 2:
						case 3:
						case 4:
							cat1_name = 'спальни';
							break;
						default:
							cat1_name = 'спален';
					}
					cat2_value = Number(category_counters[1]);
					switch (cat2_value) {
						case 1:
							cat2_name = 'кровать';
							break;
						case 2:
						case 3:
						case 4:
							cat2_name = 'кровати';
							break;
						default:
							cat2_name = 'кроватей';
					}
					cat3_value = Number(category_counters[2]);
					switch (cat3_value) {
						case 1:
							cat3_name = 'ванная комната';
							break;
						case 2:
						case 3:
						case 4:
							cat3_name = 'ванные комнаты';
							break;
						default:
							cat3_name = 'ванных комнат';
					}
					str = cat1_value + ' ' + cat1_name + ', ' + cat2_value + ' '+ cat2_name + ', ' + cat3_value + ' ' + cat3_name
					break;

				default:
					cat1_name = '';
					cat2_name = '';
					cat3_name = '';
			}


$(this).parents('.dropdown-wrapper').children('.input-wrapper').children('.input-label').children('.input').val(str);





/*
		console.log('cat1_name= ' + cat1_name);
		console.log('cat1_value= ' + cat1_value);
		console.log('cat2_name=  ' + cat2_name);
		console.log('cat2_value= ' + cat2_value);
		console.log('cat3_name= ' + cat3_name);
		console.log('cat3_value= ' + cat3_value);
		*/
		console.log('str= ' + str);





	});
});
	export { counter }
