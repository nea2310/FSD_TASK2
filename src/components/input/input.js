const input =jQuery('document').ready(function($) {
	$('.inp').on('focus', function(e){
		$(this).parent('.inpwrapper').css('border-color', 'rgba(31, 32, 65, 0.5)')
	});
	$('.inp').on('blur', function(e){
		$(this).parent('.inpwrapper').css('border-color', 'rgba(31, 32, 65, 0.25)')
	});
});
export { input }
