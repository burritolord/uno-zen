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
