
/*
это не работает:
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/themes/base/datepicker.css';*/


import '../../plugins/airdatepicker/datepicker.min.js';


const calendar =jQuery('document').ready(function($){
  $('.datepicker-input').datepicker(

{
//  inline: true,
  clearButton: true,                       }

)
})




/*var calendar = $('.datepicker-input').datepicker().data('datepicker');

calendar.clear();*/



export { calendar }