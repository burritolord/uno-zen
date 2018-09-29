/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';

$(function() {

  const _animate = () =>
    setTimeout(() => $('.cover').addClass('animated')
    , 1000)
  ;

  const _expand = function(options){
    $('main, .cover, .links > li, html').toggleClass('expanded');
    return Uno.search.form(options.form);
  };

  $('#menu-button').click(() => $('.cover, main, #menu-button, html').toggleClass('expanded'));

  $(`${window.open_button}, #avatar-link`).click(function(event) {
    if (Uno.is('page', 'home')) {
      event.preventDefault();
      location.hash = location.hash === '' ? '#open' : '';
      if (!Uno.is('device', 'desktop')) { return $('#menu-button').trigger('click'); }
      return _expand({form: 'toggle'});
    }
  });

  if ((Uno.is('device', 'desktop')) && (Uno.is('page', 'home'))) {
    _animate();
    if (location.hash !== '#open') { return _expand({form: 'hide'}); }
  }
});
