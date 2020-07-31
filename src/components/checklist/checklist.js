const checklist_expand =jQuery('document').ready(function($) {
	$('.checklist__inpwrapper-expand').on('click', function(){
	$(this).next().toggle();
	});


});

export { checklist_expand }