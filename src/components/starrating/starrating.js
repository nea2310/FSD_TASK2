const starrating =jQuery('document').ready(function($) {

let cStars = function(nowPos) {
  // У всех убираем active
  $('.stars .star').removeClass('active');
  
  for (let i = 0; nowPos + 1 > i; i++) {
    $('.stars .star').eq(i).toggleClass('active');
  }
}
// переменная содержит количество активных звезд
let starsCount = $('.star.active').length; 

// При наведении
$('.stars .star').hover(function() {
  cStars($(this).index());
  //$(this).children().text('star');
});

// При клике
$('.stars .star').click(function() {
  cStars($(this).index());
  // меняем количество по клику
  starsCount = $('.star.active').length; 
});

// Как только отводим мышку, возвращаем количество активных айтемов, которые были изначально
$('.stars .star').on('mouseleave', function() {
  cStars(+starsCount - 1);
});
});

export { starrating }



