
/*
это не работает:
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/themes/base/datepicker.css';*/


import '../../plugins/airdatepicker/datepicker.min.js';


const calendar =jQuery('document').ready(function($){
  $('.datepicker-input').datepicker({clearButton: true})
});


const calendarTest =jQuery('document').ready(function($){
  $('.datepicker-test').datepicker({clearButton: true})
  //let buttons = $(".calendar-buttons")

  $('.datepicker--content').after(function(indx){
    	return '<div class="datepicker-buttons"><div data-acton="clear" class="action  action-grey">очистить</div><div class="action  action-purple">применить</div></div>';
  });

/* // $("path").detach()
  $('.datepicker--nav-action').click(function () {
  	alert('!!!');
  		$("path").detach();
  });*/




});




/*var calendar = $('.datepicker-input').datepicker().data('datepicker');

calendar.clear();*/



export { calendar }