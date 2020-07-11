const counter =jQuery('document').ready(function($) {



	$('.counter-minusplus').click(function () {
	let span = $(this).parent().children(".counter");
	let span_numb = parseInt(span.text());
	let opertype = $(this).attr("class")
	let container = $(this).parent().parent().parent().parent().children(".counter-inpwrapper");

	let val1 = container.children(".val1");
	let val2 = container.children(".val2");
	let val3 = container.children(".val3");
	let text1 = container.children(".text1");
	let text2 = container.children(".text2");
	let text3 = container.children(".text3");

	let val;
	let text;



				if(opertype=='counter-minus counter-minusplus' && span_numb != 0) {
					span.text(--span_numb);
					}
				else if (opertype=='counter-plus counter-minusplus'){
					span.text(++span_numb);
				}

		switch($(this).attr('data-name')){
			case 'category-one':
					switch(Number(span.text())){
						case 1:
							text = $(this).attr('data-coun1cat1');
							val = span.text();
							val1.text(val);
							text1.text(text);
							break;
						case 2:
						case 3:
						case 4:
						//case 0:
							text = $(this).attr('data-coun2cat1');
							val = span.text();
							val1.text(val);
							text1.text(text);
							break;
						default:
							text = $(this).attr('data-coun5cat1');
							val = span.text();
							val1.text(val);
							text1.text(text);
							let a = $(this).attr('data-coun5cat1');
							let b = span.text();
							console.log('a '+a);
							console.log('b '+b);
							break;		
						}
				break;
			case 'category-two':
						switch(Number(span.text())){
						case 1:

							text = $(this).attr('data-coun1cat2');
							val = span.text();
							val2.text(val);
							text2.text(text);
							break;
						case 2:
						case 3:
						case 4:

							text = $(this).attr('data-coun2cat2');
							val = span.text();
							val2.text(val);
							text2.text(text);
							break;
						default:

							text = $(this).attr('data-coun5cat2');
							val = span.text();
							val2.text(val);
							text2.text(text);
							break;				
						}
				break;
			case 'category-three':
					switch(Number(span.text())){
						case 1:

							text = $(this).attr('data-coun1cat3');
							val = span.text();
							val3.text(val);
							text3.text(text);
							break;
						case 2:
						case 3:
						case 4:

							text = $(this).attr('data-coun2cat3');
							val = span.text();
							val3.text(val);
							text3.text(text);
							break;
						default:

							text = $(this).attr('data-coun5cat3');
							val = span.text();
							val3.text(val);
							text3.text(text);
							break;		
						}
				break;		
			}
	});


	$('.counter-inpwrapper').on('click', function(){
	$(this).nextAll().show(300);
	}); 
	
	

	$(document).mouseup(function (e){ // событие клика по веб-документу
		let block = $('.counter-wrapper'); // тут указываем ID элемента
		let block_to_hide = $('.counter-categories');
		if (!block.is(e.target) // если клик был не по нашему блоку
		    && block.has(e.target).length === 0) { // и не по его дочерним элементам
			block_to_hide.hide(300); // скрываем его
		}
	});


});

export { counter }