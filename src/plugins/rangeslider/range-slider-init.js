import RangeSlider from './range-slider';

$(() => {
    const $sliders = $('.js-range-slider');

    $sliders.each((i, val) => {
        new RangeSlider(val);
    });
});