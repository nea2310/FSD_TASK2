const counter =jQuery('document').ready(function($) {


	$('.counter-minus').click(function () {
	let cat1quant1 = $(this).parent().parent().parent().parent().parent().children(".cat1quant1")
	let cat1quant2 = $(this).parent().parent().parent().parent().parent().children(".cat1quant2")
	let cat1quant3 = $(this).parent().parent().parent().parent().parent().children(".cat1quant3")
	let cat2quant1 = $(this).parent().parent().parent().parent().parent().children(".cat2quant1")
	let cat2quant2 = $(this).parent().parent().parent().parent().parent().children(".cat2quant2")
	let cat2quant3 = $(this).parent().parent().parent().parent().parent().children(".cat2quant3")
	let cat3quant1 = $(this).parent().parent().parent().parent().parent().children(".cat3quant1")
	let cat3quant2 = $(this).parent().parent().parent().parent().parent().children(".cat3quant2")
	let cat3quant3 = $(this).parent().parent().parent().parent().parent().children(".cat3quant3")
	
	let span = $(this).next();
	let span_numb = parseInt(span.text());
	if(span_numb) {
	span.text(--span_numb);
		switch($(this).attr('data-name')){
			case 'category-one':
				$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-one-count").text(span.text());
					switch(Number(span.text())){
						case 1:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-one-name").text(cat1quant1.text());
							break;
						case 2:
						case 3:
						case 4:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-one-name").text(cat1quant2.text());
							break;
						default:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-one-name").text(cat1quant3.text());
							break;		
						}
				console.log(span.text())
				console.log(cat1quant2.text())
				break;
			case 'category-two':
				$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-two-count").text(span.text());
					switch(Number(span.text())){
						case 1:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-two-name").text(cat2quant1.text());
							break;
						case 2:
						case 3:
						case 4:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-two-name").text(cat2quant2.text());
							break;
						default:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-two-name").text(cat2quant3.text());
							break;		
						}
				break;
			case 'category-three':
				$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-three-count").text(span.text());
					switch(Number(span.text())){
						case 1:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-three-name").text(cat3quant1.text());
							break;
						case 2:
						case 3:
						case 4:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-three-name").text(cat3quant2.text());
							break;
						default:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-three-name").text(cat3quant3.text());
							break;		
						}
				break;		
			}
		}
	});

	$('.counter-plus').on('click', function () {
	let cat1quant1 = $(this).parent().parent().parent().parent().parent().children(".cat1quant1")
	let cat1quant2 = $(this).parent().parent().parent().parent().parent().children(".cat1quant2")
	let cat1quant3 = $(this).parent().parent().parent().parent().parent().children(".cat1quant3")
	let cat2quant1 = $(this).parent().parent().parent().parent().parent().children(".cat2quant1")
	let cat2quant2 = $(this).parent().parent().parent().parent().parent().children(".cat2quant2")
	let cat2quant3 = $(this).parent().parent().parent().parent().parent().children(".cat2quant3")
	let cat3quant1 = $(this).parent().parent().parent().parent().parent().children(".cat3quant1")
	let cat3quant2 = $(this).parent().parent().parent().parent().parent().children(".cat3quant2")
	let cat3quant3 = $(this).parent().parent().parent().parent().parent().children(".cat3quant3")


	let span = $(this).prev();
	let span_numb = parseInt(span.text());
	if(span_numb || span_numb == 0) {
	span.text(++span_numb);

	switch($(this).attr('data-name')){
			case 'category-one':
				$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-one-count").text(span.text());
					switch(Number(span.text())){
						case 1:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-one-name").text(cat1quant1.text());
							break;
						case 2:
						case 3:
						case 4:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-one-name").text(cat1quant2.text());
							break;
						default:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-one-name").text(cat1quant3.text());
							break;		
						}
				break;
			case 'category-two':
				$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-two-count").text(span.text());
					switch(Number(span.text())){
						case 1:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-two-name").text(cat2quant1.text());
							break;
						case 2:
						case 3:
						case 4:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-two-name").text(cat2quant2.text());
							break;
						default:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-two-name").text(cat2quant3.text());
							break;		
						}
				break;	
			case 'category-three':
				$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-three-count").text(span.text());
					switch(Number(span.text())){
						case 1:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-three-name").text(cat3quant1.text());
							break;
						case 2:
						case 3:
						case 4:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-three-name").text(cat3quant2.text());
							break;
						default:
							$(this).parent().parent().parent().parent().parent().children(".counter-inpwrapper").children(".category-three-name").text(cat3quant3.text());
							break;		
						}
				break;		
			}
		}
	});

	$('.counter-inpwrapper').on('click', function(){
	$(this).nextAll().slideToggle(300);
	});


});

export { counter }