import '../../plugins/widget_dropdown/widget_dropdown.js'
const dropdown_guests = $('#twidget').widget({
					locale: 'en',
					marker: 1234,
					default_origin: 'SVO',
					default_destination: 'ekat',
					default_hotel_location: 'rio'
				});
				
export { dropdown_guests }