
import '../../plugins/airdatepicker/datepicker.min.js';


const calendar =jQuery('document').ready(function($){
  $('.input__datepicker-plain').datepicker(
      {
      clearButton: true,
      navTitles: {
        days: 'MM <i>yyyy</i>',
          }
      },
  );
  $('.input__datepicker-range').datepicker(
        {
            clearButton: true,
            navTitles: {
                days: 'MM <i>yyyy</i>',
            },
            range: true,
            multipleDatesSeparator: ' - '
        });
  $('.input__datepicker-visible').datepicker(
        {
            clearButton: true,
            inline: true,
            navTitles: {
                days: 'MM <i>yyyy</i>',
            },
            range: true,
            multipleDatesSeparator: ' - '
        });




    $('.datepicker--button').after(function(indx){
        return '<div class="action action-apply action-purple">применить</div>';
    });


    $('.action').click(function (){

        //$(this).parent('.datepicker--buttons').parent('.datepicker').parent('.datepicker-inline').hide();
        $(this).parent('.datepicker--buttons').parent('.datepicker').hide();
    });


    $("div[data-type='calendar']").click(function () {
        $('.datepicker').show();
    })


 /*
    $('.input__datepicker-range').click(function (){

        //$(this).parent('.datepicker--buttons').parent('.datepicker').parent('.datepicker-inline').hide();
        $('.datepicker').show();
        //$('.datepicker-range').show();
    });
*/

});









export { calendar }