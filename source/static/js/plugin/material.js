'use strict';

//import $ from 'jquery';
import Plugin from '../global/plugin';

const NAME = 'material';

function isChar(e) {
    if (typeof e.which === 'undefined') {
        return true;
    } else if (typeof e.which === 'number' && e.which > 0) {
        return !e.ctrlKey && !e.metaKey && !e.altKey && e.which !== 8 && e.which !== 9;
    }
    return false;
}

class FormMaterial extends Plugin {
    getName() {
        return NAME;
    }

    render() {
        this.hiddenDiv = $('.hiddendiv').first();

        if (!this.hiddenDiv.length) {
            this.hiddenDiv = $('<div class="hiddendiv common"></div>');
            $('body').append(this.hiddenDiv);
        }

        let $el = this.$el;

        let $control = this.$control = $el.find('.b-input-container__control');

        // Add hint label if required
        if ($control.attr('data-hint')) {
            $control.after(`<div class=hint>${$control.attr('data-hint')}</div>`);
        }

        if ($el.hasClass('b-input-container_floating')) {
            // Add floating label if required
            if ($control.hasClass('b-input-container__control_label')) {
                let placeholder = $control.attr('placeholder');

                $control.attr('placeholder', null).removeClass('b-input-container__control_label');
                $control.after(`<label class=b-input-container__label>${placeholder}</label>`);
            }

            // Set as empty if is empty
            if ($control.val() === null || $control.val() === 'undefined' || $control.val() === '') {
                $control.addClass('b-input-container__control_empty');
            }
        }

        if ($control.is('[disabled]')) {
            $el.addClass('b-input-container_disabled');
        }

        // Support for file input
        if ($control.next().is('[type=file]')) {
            $el.addClass('b-input-container_file');
        }

        this.$file = $el.find('[type=file]');
        this.bind();
        $el.data('formMaterialAPI', this);
    }

    bind() {
        let $el = this.$el;
        let $control = this.$control = $el.find('.b-input-container__control');

        $el.on('keydown.site.material paste.site.material autoresize', '.b-input-container__control', e => {
            if (isChar(e)) {
                $control.removeClass('b-input-container__control_empty');
                this.textareaAutoResize($control);
            }
        }).on('keyup.site.material change.site.material autoresize', '.b-input-container__control', () => {
            this.textareaAutoResize($control);

            if ($control.val() === '' && (typeof $control[0].checkValidity !== 'undefined' && $control[0].checkValidity())) {
                $control.addClass('b-input-container__control_empty');
            } else {
                $control.removeClass('b-input-container__control_empty');
            }
        });

        if (this.$file.length > 0) {
            this.$file
                .on('focus', () => this.$el.find('input').addClass('focus'))
                .on('blur', () => this.$el.find('input').removeClass('focus'))
                .on('change', e => {
                    let $this = $(e);
                    let value = '';

                    $.each($this[0].files, (i, file) => {
                        value += `${file.name}, `;
                    });

                    value = value.substring(0, value.length - 2);

                    if (value) {
                        $this.prev().removeClass('b-input-container__control_empty');
                    } else {
                        $this.prev().addClass('b-input-container__control_empty');
                    }

                    $this.prev().val(value);
                });
        }
    }

    textareaAutoResize($textarea) {
        // Set font properties of hiddenDiv

        if (!$textarea.is('textarea')) return false;

        let hiddenDiv = this.hiddenDiv;
        let fontFamily = $textarea.css('font-family');
        let fontSize = $textarea.css('font-size');
        let lineHeight = $textarea.css('line-height');
        let padding = $textarea.css('padding');

        if (fontSize) {
            hiddenDiv.css('font-size', fontSize);
        }

        if (fontFamily) {
            hiddenDiv.css('font-family', fontFamily);
        }

        if (lineHeight) {
            hiddenDiv.css('line-height', lineHeight);
        }

        if (padding) {
            hiddenDiv.css('padding', padding);
        }

        // Set original-height, if none
        if (!$textarea.data('original-height')) {
            $textarea.data('original-height', $textarea.height());
        }

        if ($textarea.attr('wrap') === 'off') {
            hiddenDiv
                .css('overflow-wrap', 'normal')
                .css('white-space', 'pre');
        }

        hiddenDiv.text($textarea.val() + '\n');
        let content = hiddenDiv.html().replace(/\n/g, '<br>');
        hiddenDiv.html(content);

        // When textarea is hidden, width goes crazy.
        // Approximate with half of window size

        if ($textarea.is(':visible')) {
            hiddenDiv.css('width', $textarea.outerWidth());
        } else {
            hiddenDiv.css('width', $(window).width() / 2);
        }

        /**
         * Resize if the new height is greater than the
         * original height of the textarea
         */
        if ($textarea.data('original-height') <= hiddenDiv.height()) {
            $textarea.css('height', hiddenDiv.height());
        } else if ($textarea.val().length < $textarea.data('previous-length')) {
            /**
             * In case the new height is less than original height, it
             * means the textarea has less text than before
             * So we set the height to the original one
             */
            $textarea.css('height', $textarea.data('original-height'));
        }
        $textarea.data('previous-length', $textarea.val().length);
    }
}

Plugin.register(NAME, FormMaterial);

export default FormMaterial;
