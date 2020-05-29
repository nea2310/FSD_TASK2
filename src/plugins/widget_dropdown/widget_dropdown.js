/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  https://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

;( function( $, window, document, undefined ) {

    "use strict";


    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "widget",
        defaults = {
            locale: "en",
            marker: 1111,
            type: 'avia_hotel',
            hide_logos: false,
            open_in_new_tab: true,
            default_origin: '',
            default_destination: '',
			lock_destination: false,
            default_hotel_location: '',
            localization: {
                avia_passengers_select_caption: 'Passengers/Class',
                avia_passengers_caption_1: 'item',
                avia_passengers_caption_2: 'item',
                avia_passengers_caption_5: 'item',
                avia_passengers_select_adults: 'Item type 1',
                avia_passengers_select_children: 'Item type 2',
                avia_passengers_select_infants: 'Item type 3',
                avia_passengers_select_ready_button: 'Done',
                avia_passengers_clean_button: 'Clean',
            }
        },
        // globals
        date = new Date(),
        dateOneWeekLater = new Date(),
        dateTwoWeekLater = new Date();

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {
        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like the example bellow
            //this.yourOtherFunction( "jQuery Boilerplate" );

            this.widget_html();

            var container = $( this.element),
                _this = this;

            /* set marker */
            container.find('input[name="marker"]').val(this.settings.marker);
            /* flight vars */
            var origin_iata_input       = container.find('input[name="origin_iata"]'),
                destination_iata_input  = container.find('input[name="destination_iata"]'),
                oneway_input            = container.find('input[name="oneway"]'),
                trip_class_input        = container.find('input[name="trip_class"]'),
                pas_count_label         = container.find('#twidget-pas'),
                adults_pas_input        = container.find('#twidget-passenger-form input[name="adults"]'),
                children_pas_input      = container.find('#twidget-passenger-form input[name="children"]'),
                infants_pas_input       = container.find('input[name="infants"]'),
            /* hotel vars */
                guests_count_label      = container.find('#twidget-g-no');

            container.find('.twidget-tab-links a').on('click', function(e)  {
                var currentAttrValue = $(this).attr('href'),
                    currentTabContentHeight = container.find('.twidget-tab-content').height()+20;

                // Show/Hide Tabs
                container.find('.twidget-tab-content').css({height: currentTabContentHeight});
                container.find('.twidget-tabs ' + currentAttrValue).siblings().fadeOut(200);
                setTimeout(function(){container.find('.twidget-tabs ' + currentAttrValue).fadeIn(200);container.find('.twidget-tab-content').css({height: 'auto'});}, 250);


                // Change/remove current tab to active
                $(this).parent('li').addClass('active').siblings().removeClass('active');

                e.preventDefault();
            });

            /*passenger details toggle*/
            container.find('.twidget-passengers-detail').click(function(){
                $(this).toggleClass('active');
                container.find('#twidget-passenger-form').fadeToggle(65);
            });

            /* passengers details ready button */
            container.find('.twidget-passengers-ready-button').click(function(){
                container.find('.twidget-passengers-detail').trigger('click');
            });

            /*hotel guest details toggle*/
            container.find('.twidget-guest-detail').click(function(){
                $(this).toggleClass('active');
                container.find('#twidget-guest-form').fadeToggle(65);
            });

            /*quantity increment*/
            $(document).on("click", "#"+this.element.id+" .twidget-q-btn", function() {
                var button = $(this),
                    input = button.parent().find("input"),
                    newVal = parseFloat(input.val()),
                    adults_pas_count = parseFloat(adults_pas_input.val()),
                    children_pas_count = parseFloat(children_pas_input.val()),
                    infants_pas_count = parseFloat(infants_pas_input.val());

                if (button.text() == "+") {
                    if((button.attr('data-age') == 'adults' || button.attr('data-age') == 'children')  && (adults_pas_count + children_pas_count + infants_pas_count ) < 9) { // max 9 passengers (adults+children)
                        newVal++;
                    }
                    if(button.attr('data-age') == 'infants'  && newVal < adults_pas_count && (adults_pas_count + children_pas_count + infants_pas_count ) < 9) { // max infants = current adults
                        newVal++;
                    }
                    if(button.attr('data-age') == 'adults-g' && newVal < 4) { // max 4 adult guests
                        newVal++;
                    }
                    if(button.attr('data-age') == 'children-g' && newVal < 3) { // max 3 children guests
                        newVal++;
                        container.find('#twidget-guest-form .twidget-pas-class ul').append( // add +1 child guest age selection
                            '<li>' +
                            '<div class="twidget-cell twidget-age-name">' + _this.settings.localization.hotel_guests_select_children_age + '</div>' +
                            '<div class="twidget-cell twidget-age-select">' +
                            '<span class="twidget-dec twidget-q-btn" data-age="one-child">-</span><span class="twidget-num"><input type="text" name="children['+newVal+']" value="8"></span><span class="twidget-inc twidget-q-btn" data-age="one-child">+</span>' +
                            '</div>' +
                            '</li>'
                        );
                        container.find('#twidget-guest-form .twidget-pas-class').show();
                    }
                    if(button.attr('data-age') == 'one-child' && newVal < 17) { // children guests max age = 17
                        newVal++;
                    }
                } else {
                    // Don't allow decrementing below zero
                    if (input.val() > 0) {
                        // Don't allow decrementing adultrs below 1
                        if((button.attr('data-age') == 'adults' || button.attr('data-age') == 'adults-g') && input.val() == 1) {
                            return false;
                        }
                        newVal--;
                        if(button.attr('data-age') == 'adults' && infants_pas_count > newVal ) { // correct infants count when decrementing adults count
                            infants_pas_input.val(newVal);
                        }
                        if(button.attr('data-age') == 'children-g') { // remove children age selectors when decrementing children count
                            container.find('#twidget-guest-form .twidget-pas-class li:last-child').remove();
                            if(newVal == 0) {
                                container.find('#twidget-guest-form .twidget-pas-class').hide();
                            }
                        }
                    } else {
                        newVal = 0;
                    }
                }
                input.val(newVal);
                pas_count_label.html(0);
                container.find('#twidget-passenger-form input[name="adults"], #twidget-passenger-form input[name="children"], input[name="infants"]').trigger('change');
                guests_count_label.html(0);
                container.find('#twidget-guest-form input[name="adults"], #twidget-guest-form input[name="children_sum"]').trigger('change');
            });

            /* calculate passengers count label */
            container.find('#twidget-passenger-form input[name="adults"], #twidget-passenger-form input[name="children"], input[name="infants"]').on('change', function() {
                var current_count = parseFloat(pas_count_label.html()),
                    input_count = parseFloat($(this).val());
                pas_count_label.html(current_count+input_count);
                if(current_count+input_count >= 5) {
                    container.find('.twidget-pas-caption').text(_this.settings.localization.avia_passengers_caption_5);
                } else if(current_count+input_count != 1){
                    container.find('.twidget-pas-caption').text(_this.settings.localization.avia_passengers_caption_2);
                } else {
                    container.find('.twidget-pas-caption').text(_this.settings.localization.avia_passengers_caption_1);
                }
            });



        },
        widget_html: function() {
            var _this = this;
            $(this.element).html('<!-- start widget-->'+
            '    <div class="twidget-tabs">'+
            '        <!--select tabs-->'+
            '        <!-- tabs -->'+
            '        <div class="twidget-tab-content">'+
            '            <!--flight tab content-->'+
            '            <div id="twidget-tab1" class="twidget-tab active">'+
            '                <div>'+
            '                </div>'+
            '                <div class="clearfix"></div>'+
            '                <form>'+
            '                    <ul class="twidget-form-list clearfix">'+
            '                        <!-- flight passengers -->'+
            '                        <li class="twidget-passengers">'+
            '                            <div class="twidget-passengers-detail">'+
            '                                <div class="twidget-pas-no"><span id="twidget-pas">1</span> <span class="twidget-pas-caption">'+_this.settings.localization.avia_passengers_caption_1+'</span></div>'+
            '                            </div>'+
            '                            <!--start passenger selection-->'+
            '                            <div id="twidget-passenger-form" style="display: none;">'+
            '                                <div class="twidget-passenger-form-wrapper">'+
            '                                    <ul class="twidget-age-group">'+
            '                                        <li>'+
            '                                            <div class="twidget-cell twidget-age-name">' + _this.settings.localization.avia_passengers_select_adults + '</div>'+
            '                                            <div class="twidget-cell twidget-age-select">'+
            '                                                <span class="twidget-dec twidget-q-btn" data-age="adults">-</span><span class="twidget-num"><input type="text" name="adults" value="1"></span><span class="twidget-inc twidget-q-btn" data-age="adults">+</span>'+
            '                                            </div>'+
            '                                        </li>'+
            '                                        <li>'+
            '                                            <div class="twidget-cell twidget-age-name">' + _this.settings.localization.avia_passengers_select_children + '</div>'+
            '                                            <div class="twidget-cell twidget-age-select">'+
            '                                                <span class="twidget-dec twidget-q-btn" data-age="children">-</span><span class="twidget-num"><input type="text" name="children" value="0"></span><span class="twidget-inc twidget-q-btn" data-age="children">+</span>'+
            '                                            </div>'+
            '                                        </li>'+
            '                                        <li>'+
            '                                            <div class="twidget-cell twidget-age-name">' + _this.settings.localization.avia_passengers_select_infants + '</div>'+
            '                                            <div class="twidget-cell twidget-age-select">'+
            '                                                <span class="twidget-dec twidget-q-btn" data-age="infants">-</span><span class="twidget-num"><input type="text" name="infants" value="0"></span><span class="twidget-inc twidget-q-btn" data-age="infants">+</span>'+
            '                                            </div>'+
            '                                        </li>'+
            '                                    </ul>'+
            '                                    <ul class="twidget-age-group">'+
            '                                        <li class="twidget-passengers-ready-button-wrapper">'+
            '                                            <div class="twidget-clean-button">' + _this.settings.localization.avia_passengers_clean_button + '</div>'+
            '                                            <div class="twidget-passengers-ready-button">' + _this.settings.localization.avia_passengers_select_ready_button + '</div>'+
            '                                        </li>'+
            '                                    </ul>'+
            '                                </div>'+
            '                            </div>'+
            '                            <!-- end passenger selection-->'+
            '                        </li>'+
            '                    </ul>'+
            '                </form>'+
            '                <div class="twidget-tab-bottom">'+
            '                </div>'+
            '            </div>'+

            '        <!--end tab content-->'+
            '    </div>'+
            '    <!--end widget -->');
        }
    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" +
                pluginName, new Plugin( this, options ) );
            }
        } );
    };

    /* handler for clicks outside active autofill */
    $('html').click(function(){
        $('.twidget-auto-fill-wrapper.active ul li:first-child').trigger('click');
    });

} )( jQuery, window, document );


