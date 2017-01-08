/**
 * main.js
 *
 * Created by xiepan on 2017/1/8 下午7:29.
 */

;$(function () {
    'use strict'
    var $sidebar = $('.sidebar'),
        $mask = $('.mask'),
        $menu = $('#menu'),
        $backToTop = $('.back-to-top')


    $menu.on('click', function () {
        $mask.fadeIn()
        $sidebar.css('right', 0)
    })

    $mask.on('click', function () {
        $mask.fadeOut()
        $sidebar.css('right', -$sidebar.width())
    })

    $backToTop.on('click', function () {
        $('html,body').animate({scrollTop: 0}, 600)
    })

    $(window).on('scroll', function () {
        console.log($(window).scrollTop())
        console.log($(window).height())
        if ($(window).scrollTop() > $(window).height()) {
            $backToTop.fadeIn();
        }
        else {
            $backToTop.fadeOut();
        }
    })


    $(window).trigger('scroll')

})

