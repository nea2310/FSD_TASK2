const button_like =jQuery('document').ready(function($) {

		$('.like__heart').on('click', function(){
		let counter	 = $(this).next()	
		let counter_val	 = $(this).next().text()	
			
			
		if($(this).hasClass('like-added')){
			counter.text(--counter_val);
			$(this).children().addClass('maticons-grey');
			$(this).children().text('favorite_border');
			}
			
		else {
			counter.text(++counter_val);	
			$(this).children().removeClass('maticons-grey');
			$(this).children().text('favorite');
			}

	$(this).toggleClass('like-added');
	$(this).parent().parent().toggleClass('btn__like-added');
		
	});
});

export { button_like }