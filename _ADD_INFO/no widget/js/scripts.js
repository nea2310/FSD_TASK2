jQuery('document').ready(function($) {


	$('.dropdown-minus').click(function () {
	let span = $(this).next();
	let span_numb = parseInt(span.text());
	if(span_numb) {
	span.text(--span_numb);
		switch($(this).attr('data-name')){
			case 'category-one':
				$(".category-one-count").text(span.text());
				break;
			case 'category-two':
				$(".category-two-count").text(span.text());
				break;
			case 'category-three':
				$(".category-three-count").text(span.text());
				break;		
			}
		}
	});

	$('.dropdown-plus').on('click', function () {
	let span = $(this).prev();
	let span_numb = parseInt(span.text());
	if(span_numb || span_numb == 0) {
	span.text(++span_numb);

	switch($(this).attr('data-name')){
			case 'category-one':
				$(".category-one-count").text(span.text());
				break;
			case 'category-two':
				$(".category-two-count").text(span.text());
				break;	
			case 'category-three':
				$(".category-three-count").text(span.text());
				break;		
			}
		}
	});

	$('.dropdown-header').on('click', function(){
	$(this).nextAll().slideToggle(500);
	});


});