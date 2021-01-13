
import '../../plugins/airdatepicker/datepicker.min.js';


const calendar = jQuery('document').ready(function ($) {


	let startdate;
	let source = $('.calendarblock__wrapper').children('.calendar-wrapper').eq(1).children('.input-wrapper');
	console.log("source");
	console.log(source);
	source.click(function () {
		init(this);
	});


	function init(element) {
		startdate = $(element).parents('.calendarblock__wrapper').children('.calendar-wrapper').children('.input-wrapper').eq(0).children('.input-label').children('.input').val();
		startdate = startdate.substr(startdate.length - 4) + '-' + startdate.substr(-7, 2) + '-' + startdate.substr(-10, 2);
		console.log("startdate");
		console.log(startdate);
		$('.input__datepicker-end').datepicker(
			{
				minDate: new Date(startdate)
			},
		);

	}


	$('.input__datepicker-start').datepicker(
		{
			minDate: new Date(),
			clearButton: true,
			navTitles: {
				days: 'MM <i>yyyy</i>',
			}
		},
	);


	$('.input__datepicker-end').datepicker(
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
			inline: true,
			clearButton: true,
			navTitles: {
				days: 'MM <i>yyyy</i>',
			},
			range: true,
			multipleDatesSeparator: ' - '
		});

	/*  $('.input__datepicker-visible').datepicker(
			 {
					clearButton: true,
				  inline: true,
					navTitles: {
						 days: 'MM <i>yyyy</i>',
					},
					range: true,
					multipleDatesSeparator: ' - '
			  });*/


	$('.datepicker--button').after(function (indx) {
		return '<div class="action action-apply action-purple">применить</div>';
	});


	$('.action').click(function () {
		$(this).parent('.datepicker--buttons').parent('.datepicker').hide();
	});


	$("div[data-type='calendar']").click(function () {
		$('.datepicker').show();
	})

});


export { calendar }