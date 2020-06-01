jQuery('document').ready(function($) {


	$('.minus').click(function () {
	let span = $(this).next();
	let span_numb = parseInt(span.text());
	if(span_numb) {
	span.text(--span_numb);
		switch($(this).attr('data-name')){
			case 'adults':
				$(".adults_count").text(span.text());
				break;
			case 'children':
				$(".children_count").text(span.text());
				break;
			case 'infants':
				$(".infants_count").text(span.text());
				break;		
			}
		}
	});

	$('.plus').on('click', function () {
	let span = $(this).prev();
	let span_numb = parseInt(span.text());
	if(span_numb || span_numb == 0) {
	span.text(++span_numb);

	switch($(this).attr('data-name')){
			case 'adults':
				$(".adults_count").text(span.text());
				break;
			case 'children':
				$(".children_count").text(span.text());
				break;	
			case 'infants':
				$(".infants_count").text(span.text());
				break;		
			}
		}
	});

});