const dropdown =jQuery('document').ready(function($) {


	$('.dropdown-minus').click(function () {
	let span = $(this).next();
	let span_numb = parseInt(span.text());
	if(span_numb) {
	span.text(--span_numb);
		switch($(this).attr('data-name')){
			case 'category-one':
				$(this).parent().parent().parent().parent().parent().children(".dropdown-header").children(".category-one-count").text(span.text());
				break;
			case 'category-two':
				$(this).parent().parent().parent().parent().parent().children(".dropdown-header").children(".category-two-count").text(span.text());
				break;
			case 'category-three':
				$(this).parent().parent().parent().parent().parent().children(".dropdown-header").children(".category-three-count").text(span.text());
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
				$(this).parent().parent().parent().parent().parent().children(".dropdown-header").children(".category-one-count").text(span.text());
				break;
			case 'category-two':
				$(this).parent().parent().parent().parent().parent().children(".dropdown-header").children(".category-two-count").text(span.text());
				break;	
			case 'category-three':
				$(this).parent().parent().parent().parent().parent().children(".dropdown-header").children(".category-three-count").text(span.text());
				break;		
			}
		}
	});

	$('.dropdown-header').on('click', function(){
	$(this).nextAll().slideToggle(500);
	});


});

export { dropdown }