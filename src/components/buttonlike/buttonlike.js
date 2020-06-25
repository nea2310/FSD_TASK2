const button_like =jQuery('document').ready(function($) {

		$('.like__wrapper').on('click', function(){
		let counter	 = $(this).children('.like__number')	
		let counter_val	 = $(this).children('.like__number').text()	
		//console.log(counter);	
		console.log("counter_val= "+counter_val);	
		console.log("counter_val= "+counter.text());	
			
		if($(this).hasClass('like-added')){
			counter.text(--counter_val);
			$(this).children().children().addClass('maticons-grey');
			$(this).children().children().text('favorite_border');
			}
			
		else {
			counter.text(++counter_val);	
			$(this).children().children().removeClass('maticons-grey');
			$(this).children().children().text('favorite');
			}

	$(this).parent().toggleClass('buttonwrapper-grey');
	$(this).parent().toggleClass('buttonwrapper-white');
	$(this).parent().toggleClass('buttonwrapper-thin');
	$(this).toggleClass('like-added');
		
	});
});

export { button_like }