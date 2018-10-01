/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';

(function() {
  let Uno;
  const app = document.body;

  window.Uno = (Uno = {
    version: '2.9.0',

    is(k, v) {
      if (!Array.isArray(v)) { return app.dataset[k] === v; }
      return v.some(v => app.dataset[k] === v);
    },

    attr(k, v) { if (v != null) { return app.dataset[k] = v; } else { return app.dataset[k]; } },

    context() {
      // get the context from the first class name of body
      // https://github.com/TryGhost/Ghost/wiki/Context-aware-Filters-and-Helpers
      const className = document.body.className.split(' ')[0].split('-')[0];
      if (className === '') { return 'error'; } else { return className; }
    },

    linkify(selector) {
      return $(selector).each(function() {
        const el = $(this);
        const text = el.text();
        const id = el.attr('id');

        el.html('');
        el.addClass('deep-link');
        return el.append(`<a href=#${id} class=\"title-link\">${text}</a>`);
      });
    },

    search: {
      form: (function() {
        const context =  $('#search-container');
        return action => context[action]();
      })()
    },

    timeAgo(selector) {
      return $(selector).each(function() {
        const postDate = $(this).html();
        let postDateInDays = Math.floor((Date.now() - new Date(postDate)) / 86400000);

        if (postDateInDays === 0) { postDateInDays = 'today';
        } else if (postDateInDays === 1) { postDateInDays = 'yesterday';
        } else { postDateInDays = `${postDateInDays} days ago`; }

        $(this).html(postDateInDays);
        $(this).mouseover(function() { return $(this).html(postDate); });
        return $(this).mouseout(function() { return $(this).html(postDateInDays); });
      });
    },

    device() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w <= 480) { return 'mobile'; }
      if (w <= 1024) { return 'tablet'; }
      return 'desktop';
    }
  });


  Uno.attr('page', Uno.context());
  Uno.attr('device', Uno.device());

  // window global properties
  if (window.profile_title) { $('#profile-title').text(window.profile_title); }
  if (window.profile_resume) { $('#profile-resume').text(window.profile_resume); }
  if (window.posts_headline) { $('#posts-headline').text(window.posts_headline); }
  return window.open_button = window.open_button || '.nav-posts > a';
})();

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
