
import '../../plugins/airdatepicker/datepicker.min.js';


const calendar =jQuery('document').ready(function($){
  $('.datepicker-plain').datepicker(
      {
      clearButton: true,
      navTitles: {
        days: 'MM <i>yyyy</i>',
          }
      },
  );
  $('.datepicker-range').datepicker(
        {
            clearButton: true,
            navTitles: {
                days: 'MM <i>yyyy</i>',
            },
            range: true,
            multipleDatesSeparator: ' - '
        });
  $('.datepicker-visible').datepicker(
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


    $('.calendar-inpwrapper').click(function (){

        //$(this).parent('.datepicker--buttons').parent('.datepicker').parent('.datepicker-inline').hide();
        $('.datepicker').show();
    });


});









export { calendar }