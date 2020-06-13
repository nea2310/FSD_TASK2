import 'ion-rangeslider/css/ion.rangeSlider.min.css';
import 'ion-rangeslider/js/ion.rangeSlider.min';

class RangeSlider {
  constructor(element) {
    this.$container = $(element);
    this.findDomElement();
    this.initSlider();

  }

  findDomElement() {
    this.$slider = this.$container.find('.js-range-slider__slider');
    this.$price = this.$container.find('.js-range-slider__price');
  }

  initSlider() {
    const { $price } = this;
    this.$slider.ionRangeSlider({
      onStart(data) {
        const {from, to} = data;
        $price.val(`${from}₽ - ${to}₽`);
      },
      onChange(data) {
        const {from, to} = data;
        $price.val(`${from}₽ - ${to}₽`);
      }
    })
  } 
};



const sliderinstance = jQuery('document').ready(function($) {
    const $sliders = $('.js-range-slider');

    $sliders.each((i, val) => {
        new RangeSlider(val);
    });
});


export { sliderinstance }