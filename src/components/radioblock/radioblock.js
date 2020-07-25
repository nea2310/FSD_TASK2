const radioblock =jQuery('document').ready(function($) {
	$('.radiomark').on('click', function(e){
		let container = $(this).parent().parent('.radioblock');
		let checkboxcurrent = $(this).prev("input");
		let checkbox;
		if (checkboxcurrent.hasClass('radiomark__checkbox-1')){
			checkbox = container.children('.radiomark__wrapper-2').children('.radiomark__checkbox-2')
		}
		else {
			checkbox = container.children('.radiomark__wrapper-1').children('.radiomark__checkbox-1')
		}
		let ischecked = checkboxcurrent.is(":checked");
		ischecked==false ? checkbox.prop('checked', false) : e.preventDefault();

	});
});
export { radioblock }
