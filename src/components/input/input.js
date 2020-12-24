const input =jQuery('document').ready(function($) {
	$('.input').on('focus', function(e){
		//$(this).parents('.input-wrapper').css('border-color', 'rgba(31, 32, 65, 0.5)')
		//$(this).parents('.input-wrapper').addClass('input-wrapper-focused');
		$(this).addClass('input_focused');
	});
	$('.input').on('blur', function(e){
		//$(this).parents('.input-wrapper').css('border-color', 'rgba(31, 32, 65, 0.25)')
		//$(this).parents('.input-wrapper').removeClass('input-wrapper-focused')
		$(this).removeClass('input_focused')
	});

/*
        $('.input-label').click(function(e) {
			let input = $(this).children('.input');
			if (e.target !== input[0]) {
				console.log('click');
				input.click();
			}
        });*/



        $('.maticons').click(function() {
			console.log('click!');
            $(this).prev('.input').click();
        });



});
export { input }
