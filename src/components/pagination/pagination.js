/* 
this javascript is only to change the "actpage" attribut on the .cdp div
*/
const pagination = jQuery('document').ready(function($) {
  let paginationPage = parseInt($('.cdp').attr('actpage'), 10);
  $('.cdp_i').on('click', function(){
    let go = $(this).attr('href').replace('#!', '');
    if (go === '+1') {
      paginationPage++;
    } else if (go === '-1') {
      paginationPage--;
    }else{
      paginationPage = parseInt(go, 10);
    }
    $('.cdp').attr('actpage', paginationPage);
  });
});  

export { pagination }