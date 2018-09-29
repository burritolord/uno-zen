/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';

$(function() {

  InstantClick.init();

  if (Uno.is('device', 'desktop')) {
    $('a').not('[href*="mailto:"]').click(function() {
      if (this.href.indexOf(location.hostname) === -1) {
        window.open($(this).attr('href'));
        return false;
      }
    });
  } else {
    FastClick.attach(Uno.app);
  }

  if (Uno.is('page', 'home') || Uno.is('page', 'paged') || Uno.is('page', 'tag')) {
    Uno.timeAgo('#posts-list time');
  }

  if (Uno.is('page', 'post')) {
    Uno.timeAgo('.post.meta > time');
    $('main').readingTime({readingTimeTarget: '.post.reading-time > span'});
    Uno.linkify($('#post-content').children('h1, h2, h3, h4, h5, h6'));
    $('.content').fitVids();
  }

  if (Uno.is('page', 'error')) {
    $('#panic-button').click(function() {
      const s = document.createElement('script');
      s.setAttribute('src','https://nthitz.github.io/turndownforwhatjs/tdfw.js');
      return document.body.appendChild(s);
    });
  }

  return $('#search-input').keyup(e => $('#search-form').attr('action', Uno.search.url + '+' + encodeURIComponent(e.target.value)));
});
