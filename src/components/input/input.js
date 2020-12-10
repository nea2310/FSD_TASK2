const input =jQuery('document').ready(function($) {
	$('.input').on('focus', function(e){
		$(this).parent('.inpwrapper').css('border-color', 'rgba(31, 32, 65, 0.5)')
	});
	$('.input').on('blur', function(e){
		$(this).parent('.inpwrapper').css('border-color', 'rgba(31, 32, 65, 0.25)')
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
