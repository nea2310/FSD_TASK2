jQuery('document').ready(function($) {
$('.minus').click(function () {
var span = $(this).next();
var span_numb = parseInt(span.text());
if(span_numb) {
span.text(--span_numb);
}
});
$('.plus').click(function () {
var span = $(this).prev();
var span_numb = parseInt(span.text());
if(span_numb || span_numb == 0) {
//alert(++span_numb);
span.text(++span_numb);
}
});
});