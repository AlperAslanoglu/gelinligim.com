(function ($) {
    'use strict';

    $(document).ready(function () {
        $('.story-posts').selectize({
            plugins: ['remove_button'],
        });
    });

    function story_create_cookie(name, value, days) {
        let expires;

        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=" + + window.location.pathname;
    }

    function story_read_cookie(name) {
        let nameEQ = encodeURIComponent(name) + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function story_delete_cookie(name) {
        story_create_cookie(name, "", -1);
    }

    function story_animate(element, animationName, callback) {
        const node = document.querySelector(element);
        node.classList.add('animated', animationName);

        function handleAnimationEnd() {
            node.classList.remove('animated', animationName);
            node.removeEventListener('animationend', handleAnimationEnd);

            if (typeof callback === 'function') callback()
        }

        node.addEventListener('animationend', handleAnimationEnd)
    }

    $(document).ready(function ($) {
        if ($('.updated.notice.notice-success.is-dismissible').length && story_read_cookie('wp_story_readed') !== 'yes') {
            let text = wpStoryObject.dont_forget;
            $('#menu-posts-wp-story ul').find('li:nth-child(4)').append('<span class="wp-story-settings-alert"><span class="dashicons dashicons-no-alt wssa-closer"></span>' + text + '</span>');
            $(document).on('click', '.wssa-closer', function () {
                $(this).parent().remove();
                story_create_cookie('wp_story_readed', 'yes');
            });
        }

        $('#post').submit(function () {
            if ($("#set-post-thumbnail").find('img').size() > 0) {
                $('#ajax-loading').hide();
                $('#publish').removeClass('button-primary-disabled');
                return true;
            } else {
                alert(wpStoryObject.featured_required);
                $('#ajax-loading').hide();
                $('#publish').removeClass('button-primary-disabled');
                story_animate('#postimagediv', 'tada');
                $('#postimagediv').addClass('alerted');
                return false;
            }
            return false;
        });
    });
})(jQuery);
