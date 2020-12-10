const checklist_expand =jQuery('document').ready(function($) {
	$("[data-type='checklistexpand']").on('click', function(){
	$(this).next().removeClass('checklist-exp_collapsed');
	$(this).next().toggle();
	});



	$(document).mouseup(function (e){ // событие клика по веб-документу
		let checklist = $('.checklist-exp'); // тут указываем ID элемента
		let input = $('.input-wrapper'); // тут указываем ID элемента
		if (!checklist.is(e.target) // если клик был не по нашему блоку
			&& checklist.has(e.target).length === 0
		    && !input.is(e.target)
			&& input.has(e.target).length === 0
		)
		{ // и не по его дочерним элементам
			$('.checklist-exp').addClass('checklist-exp_collapsed');// скрываем его
				//block.children('.input-wrapper').addClass('input-wrapper_collapsed')// скрываем его
		}
	});


});

export { checklist_expand }