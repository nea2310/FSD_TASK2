            /*quantity increment*/
            $(document).on("click", ".twidget-q-btn", function() {
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