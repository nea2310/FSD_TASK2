const checklist_expand =jQuery('document').ready(function($) {
	$('.checklist__inpwrapper-expand').on('click', function(){
	$(this).next().slideToggle(300);
	});


});

export { checklist_expand }