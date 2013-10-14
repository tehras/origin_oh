// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.


//= require jquery
//= require jquery_ujs
//= require jquery-migrate-1.2.1
//= require jquery.turbolinks
//= require bootstrap/bootstrap
//= require the-story/lazyload
//= require the-story/spin
//= require the-story/lightbox
//= require the-story/main
//= require the-story/jquery.history
//= require the-story/hashchange
//= require the-story/html5shiv

$(function() {
    $("#locations_search input").keyup(function() {
        $.get($("#locations_search").attr("action"), $("#locations_search").serialize(), null, "script");
        return false;
    });
    $(".location").click(function() {
        $(".location").not(this).removeClass('location-clicked h4');
        $(this).toggleClass('location-clicked h4');
    });
});


