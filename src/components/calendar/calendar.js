/*import './calendar.scss';
import $ from 'jquery';

if (!$.fn.datepicker) {
  require('jquery-ui/ui/widgets/datepicker');
  require('jquery-ui/themes/base/datepicker.css');
}
*/

import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/themes/base/datepicker.css';

class Calendar {
  constructor($component) {
    this.$component = $component;
    this.render();
  }

  render() {
   // let $day = $('.js-calendar__day', this.$component);
    let $widget = $('.js-calendar__widget', this.$component);

    $widget.datepicker({
      changeYear: false,
    //  altField: $day,
      altFormat: "dd",
      firstDay: 1
    });

    $('.calendar__btn-today', this.$component).on('click', () => {
      $widget.datepicker('setDate', new Date());
    });
  }
}

const calendarinstance = jQuery('document').ready(function($) {
  $(() => {
    $('.js-calendar').each((index, node) => {
      new Calendar($(node));
    });
  });
});

export { calendarinstance }

/*

export default function renderComponent() {
  $(() => {
    $('.js-calendar').each((index, node) => {
      new Calendar($(node));
    });
  });
}

renderComponent();


*/