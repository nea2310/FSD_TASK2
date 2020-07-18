const counter =jQuery('document').ready(function($) {



	$('.counter-minusplus').click(function () {
	let span = $(this).parent().children(".counter");
	let span_numb = parseInt(span.text());
	let opertype = $(this).attr("class")
	let container = $(this).parent().parent().parent().parent().children(".counter-inpwrapper");
	let textinit = container.children(".counter-input");

	let val1 = container.children(".val1");
	let val2 = container.children(".val2");
	let val3 = container.children(".val3");
	let text1 = container.children(".text1");
	let text2 = container.children(".text2");
	let text3 = container.children(".text3");

	let val;
	let text;
	if (textinit.css("display")!='none')
		textinit.hide();



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
							break;		
						}
				break;
			case 'category-two':
						switch(Number(span.text())){
						case 1:

							text = $(this).attr('data-coun1cat2');
							val = span.text();
							val2.text(', '+val);
							text2.text(text);
							break;
						case 2:
						case 3:
						case 4:

							text = $(this).attr('data-coun2cat2');
							val = span.text();
							val2.text(', '+val);
							text2.text(text);
							break;
						default:

							text = $(this).attr('data-coun5cat2');
							val = span.text();
							val2.text(', '+val);
							text2.text(text);
							break;				
						}
				break;
			case 'category-three':
					switch(Number(span.text())){
						case 1:

							text = $(this).attr('data-coun1cat3');
							val = span.text();
							val3.text(', '+val);
							text3.text(text);
							break;
						case 2:
						case 3:
						case 4:

							text = $(this).attr('data-coun2cat3');
							val = span.text();
							val3.text(', '+val);
							text3.text(text);
							break;
						default:

							text = $(this).attr('data-coun5cat3');
							val = span.text();
							val3.text(', '+val);
							text3.text(text);
							break;		
						}
				break;		
			}
	});

	$('.action-grey').click(function (){
		let counterContainer = $(this).parent().parent().parent().parent();
		console.log(counterContainer);
		if (counterContainer.hasClass("counter-wrapper")){
			counterContainer.children(".counter-inpwrapper").children("span").text('');
			counterContainer.children(".counter-inpwrapper").children(".counter-input").show();
			counterContainer.children(".counter-categories").children(".category-wrapper").children(".category-counter").children(".counter").text('0');
		}
           
		
	});


	$('.counter-inpwrapper').on('click', function(){
	$(this).nextAll().show();
	if ($(this).parent().hasClass("counter-guests")){
		$(this).children(".counter-input").hide();
		$(this).children(".val1").text('1');
		$(this).children(".text1").text('взрослый');

	}

	if ($(this).parent().hasClass("counter-rooms")){
		$(this).children(".counter-input").hide();
		$(this).children(".val1").text('2');
		$(this).children(".text1").text('спальни');
		$(this).children(".val2").text(', 2');
		$(this).children(".text2").text('кровати');

	}
	}); 
	
	//Повторяющийся код - нужен рефакторинг

	$(document).mouseup(function (e){ // событие клика по веб-документу
		let block = $('.counter-guests'); // тут указываем ID элемента
		let block_to_hide = $('.counter-guests').children('.counter-categories');
		if (!block.is(e.target) // если клик был не по нашему блоку
		    && block.has(e.target).length === 0) { // и не по его дочерним элементам
			block_to_hide.hide(); // скрываем его
		}
	});

	$(document).mouseup(function (e){ // событие клика по веб-документу
		let block = $('.counter-rooms'); // тут указываем ID элемента
		let block_to_hide = $('.counter-rooms').children('.counter-categories');
		if (!block.is(e.target) // если клик был не по нашему блоку
		    && block.has(e.target).length === 0) { // и не по его дочерним элементам
			block_to_hide.hide(); // скрываем его
		}
	});


});

export { counter }