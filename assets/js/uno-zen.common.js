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

/*!
Name: Reading Time
Dependencies: jQuery
Author: Michael Lynch
Author URL: http://michaelynch.com
Date Created: August 14, 2013
Date Updated: February 28, 2018
Licensed under the MIT license
*/

;(function($) {

	$.fn.readingTime = function(options) {

		// define default parameters
		const defaults = {
			readingTimeTarget: '.eta',
			readingTimeAsNumber: false,
			wordCountTarget: null,
			wordsPerMinute: 270,
			round: true,
			lang: 'en',
			lessThanAMinuteString: '',
			prependTimeString: '',
			prependWordString: '',
			remotePath: null,
			remoteTarget: null,
			success: function() {},
			error: function() {}
		};

		const plugin = this;
		const el = $(this);

		let wordsPerSecond;
		let lessThanAMinute;
		let minShortForm;

		let totalWords;
		let totalReadingTimeSeconds;

		let readingTimeMinutes;
		let readingTimeSeconds;
		let readingTime;
		let readingTimeObj;

		// merge defaults and options
		plugin.settings = $.extend({}, defaults, options);

		// define vars
		const s = plugin.settings;

		const setTime = function(o) {

			if(o.text !== '') {

				//split text by spaces to define total words
				totalWords = o.text.trim().split(/\s+/g).length;

				//define words per second based on words per minute (s.wordsPerMinute)
				wordsPerSecond = s.wordsPerMinute / 60;

				//define total reading time in seconds
				totalReadingTimeSeconds = totalWords / wordsPerSecond;

				// define reading time
				readingTimeMinutes = Math.floor(totalReadingTimeSeconds / 60);

				// define remaining reading time seconds
				readingTimeSeconds = Math.round(totalReadingTimeSeconds - (readingTimeMinutes * 60));

				// format reading time
				readingTime = `${readingTimeMinutes}:${readingTimeSeconds}`;

				// if s.round
				if(s.round) {

					// if minutes are greater than 0
					if(readingTimeMinutes > 0) {

						// set reading time by the minute
						$(s.readingTimeTarget).text(s.prependTimeString + readingTimeMinutes + ((!s.readingTimeAsNumber) ? ' ' + minShortForm : ''));

					} else {

						// set reading time as less than a minute
						$(s.readingTimeTarget).text((!s.readingTimeAsNumber) ? s.prependTimeString + lessThanAMinute : readingTimeMinutes);
					}

				} else {

					// set reading time in minutes and seconds
					$(s.readingTimeTarget).text(s.prependTimeString + readingTime);
				}

				// if word count container isn't blank or undefined
				if(s.wordCountTarget !== '' && s.wordCountTarget !== undefined) {

					// set word count
					$(s.wordCountTarget).text(s.prependWordString + totalWords);
				}

				readingTimeObj = {
					wpm: s.wordsPerMinute,
					words: totalWords,
					eta: {
						time: readingTime,
						minutes: readingTimeMinutes,
						seconds: totalReadingTimeSeconds
					}
				};

				// run success callback
				s.success.call(this, readingTimeObj);

			} else {

				// run error callback
				s.error.call(this, {
					error: 'The element does not contain any text'
				});
			}
		};

		// if no element was bound
		if(!this.length) {

			// run error callback
			s.error.call(this, {
				error: 'The element could not be found'
			});

			// return so chained events can continue
			return this;
		}

		// Use switch instead of ifs
		switch (s.lang) {
			// if s.lang is Arabic
			case 'ar':
        lessThanAMinute = s.lessThanAMinuteString || "أقل من دقيقة";
        minShortForm = 'دقيقة';
        break;
			// if s.lang is Czech
			case 'cz':
        lessThanAMinute = s.lessThanAMinuteString || "Méně než minutu";
        minShortForm = 'min';
        break;
			// if s.lang is Danish
			case 'da':
        lessThanAMinute = s.lessThanAMinuteString || "Mindre end et minut";
        minShortForm = 'min';
        break;
			// if s.lang is German
      case 'de':
        lessThanAMinute = s.lessThanAMinuteString || "Weniger als eine Minute";
        minShortForm = 'min';
        break;
			// if s.lang is Spanish
      case 'es':
        lessThanAMinute = s.lessThanAMinuteString || "Menos de un minuto";
        minShortForm = 'min';
        break;
			// if s.lang is French
      case 'fr':
        lessThanAMinute = s.lessThanAMinuteString || "Moins d'une minute";
        minShortForm = 'min';
        break;
			// if s.lang is Hungarian
      case 'hu':
        lessThanAMinute = s.lessThanAMinuteString || "Kevesebb mint egy perc";
        minShortForm = 'perc';
        break;
			// if s.lang is Icelandic
      case 'is':
        lessThanAMinute = s.lessThanAMinuteString || "Minna en eina mínútu";
        minShortForm = 'min';
        break;
			// if s.lang is Italian
      case 'it':
        lessThanAMinute = s.lessThanAMinuteString || "Meno di un minuto";
        minShortForm = 'min';
        break;
			// if s.lang is Dutch
      case 'nl':
        lessThanAMinute = s.lessThanAMinuteString || "Minder dan een minuut";
        minShortForm = 'min';
        break;
			// if s.lang is Norwegian
      case 'no':
        lessThanAMinute = s.lessThanAMinuteString || "Mindre enn ett minutt";
        minShortForm = 'min';
        break;
			// if s.lang is Polish
      case 'pl':
        lessThanAMinute = s.lessThanAMinuteString || "Mniej niż minutę";
        minShortForm = 'min';
        break;
			// if s.lang is Russian
      case 'ru':
        lessThanAMinute = s.lessThanAMinuteString || "Меньше минуты";
        minShortForm = 'мин';
        break;
			// if s.lang is Slovak
      case 'sk':
        lessThanAMinute = s.lessThanAMinuteString || "Menej než minútu";
        minShortForm = 'min';
        break;
			// if s.lang is Swedish
      case 'sv':
        lessThanAMinute = s.lessThanAMinuteString || "Mindre än en minut";
        minShortForm = 'min';
        break;
			// if s.lang is Turkish
      case 'tr':
        lessThanAMinute = s.lessThanAMinuteString || "Bir dakikadan az";
        minShortForm = 'dk';
        break;
			// if s.lang is Ukrainian
      case 'uk':
        lessThanAMinute = s.lessThanAMinuteString || "Менше хвилини";
        minShortForm = 'хв';
        break;
			// if s.lang is Greek
			case 'el':
        lessThanAMinute = s.lessThanAMinuteString || 'Λιγότερο από λεπτό';
        minShortForm = 'λεπτά';
        break;
			// default s.lang in english
			default:
        lessThanAMinute = s.lessThanAMinuteString || 'Less than a minute';
        minShortForm = 'min';
    }

		// for each element
		el.each(function(index) {

			// if s.remotePath and s.remoteTarget aren't null
			if(s.remotePath != null && s.remoteTarget != null) {

				// get contents of remote file
				$.get(s.remotePath, function(data) {

					// set time using the remote target found in the remote file
					setTime({
						text: $('<div>').html(data).find(s.remoteTarget).text()
					});
				});

			} else {

				// set time using the targeted element
				setTime({
					text: el.text()
				});
			}
		});

		return true;
	}
})(jQuery);

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

;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

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

// Moved to ./dist/instantclick.js

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.InstantClick=t()}(this,function(){"use strict";return function(e,t,n){function r(e){var t=e.indexOf("#");return-1==t?e:e.substr(0,t)}function i(e){for(;e&&"A"!=e.nodeName;)e=e.parentNode;return e}function o(e){do{if(!e.hasAttribute)break;if(e.hasAttribute("data-instant"))return!1;if(e.hasAttribute("data-no-instant"))return!0}while(e=e.parentNode);return!1}function a(e){var n=t.protocol+"//"+t.host;return!(e.target||e.hasAttribute("download")||0!=e.href.indexOf(n+"/")||e.href.indexOf("#")>-1&&r(e.href)==I||o(e))}function f(e){for(var t=Array.prototype.slice.call(arguments,1),n=!1,r=0;r<ee[e].length;r++)if("receive"==e){var i=ee[e][r].apply(window,t);i&&("body"in i&&(t[1]=i.body),"title"in i&&(t[2]=i.title),n=i)}else ee[e][r].apply(window,t);return n}function l(i,o,a,l){if(c(),e.documentElement.replaceChild(o,e.body),e.title=i,a){v("remove"),a!=t.href&&(history.pushState(null,null,a),n.indexOf(" CriOS/")>-1&&(e.title==i?e.title=i+String.fromCharCode(160):e.title=i));var s=a.indexOf("#"),h=s>-1&&e.getElementById(a.substr(s+1)),m=0;if(h)for(;h.offsetParent;)m+=h.offsetTop,h=h.offsetParent;"requestAnimationFrame"in window?requestAnimationFrame(function(){scrollTo(0,m)}):scrollTo(0,m),u(),(I=r(a))in re&&(re[I]=[]),te[I]={},g(function(e){return!e.hasAttribute("data-instant-track")}),f("change",!1)}else scrollTo(0,l),R.abort(),d(),g(function(e){return e.hasAttribute("data-instant-restore")}),p(),f("restore")}function d(){Q=!1,V=!1}function s(e){return e.replace(/<noscript[\s\S]+?<\/noscript>/gi,"")}function c(){for(var e=0;e<ne.length;e++)"object"==typeof ne[e]&&"abort"in ne[e]&&(ne[e].instantclickAbort=!0,ne[e].abort());ne=[]}function u(){for(var e in te[I]){var t=te[I][e];window.clearTimeout(t.realId),t.delayLeft=t.delay-+new Date+t.timestamp}}function p(){for(var e in te[I])if("delayLeft"in te[I][e]){for(var t=[te[I][e].callback,te[I][e].delayLeft],n=0;n<te[I][e].params.length;n++)t.push(te[I][e].params[n]);y(t,te[I][e].isRepeating,te[I][e].delay),delete te[I][e]}}function h(){R.abort(),d()}function v(e){if(I in re)for(var t=0;t<re[I].length;t++)window[e+"EventListener"].apply(window,re[I][t])}function g(t){var n,r,i,o,a,f=e.body.getElementsByTagName("script"),l=[];for(a=0;a<f.length;a++)l.push(f[a]);for(a=0;a<l.length;a++)if((n=l[a])&&t(n)){r=e.createElement("script");for(var d=0;d<n.attributes.length;d++)r.setAttribute(n.attributes[d].name,n.attributes[d].value);r.textContent=n.textContent,i=n.parentNode,o=n.nextSibling,i.removeChild(n),i.insertBefore(r,o)}}function m(){for(var t,n,r=e.querySelectorAll("[data-instant-track]"),i=0;i<r.length;i++)n=(t=r[i]).getAttribute("href")||t.getAttribute("src")||t.textContent,$.push(n)}function y(e,t,n){var r,i=e[0],o=e[1],a=[].slice.call(e,2),f=+new Date,l=++G;r=t?function(t){i(t),delete te[I][l],e[0]=i,e[1]=o,y(e,!0)}:function(e){i(e),delete te[I][l]},e[0]=r,void 0!=n&&(f+=o-n,o=n);var d=window.setTimeout.apply(window,e);return te[I][l]={realId:d,timestamp:f,callback:i,delay:o,params:a,isRepeating:t},-l}function b(e){var t=i(e.target);t&&a(t)&&T(t.href)}function w(e){if(!(B>+new Date-500||+new Date-J<100)){var t=i(e.target);t&&t!=i(e.relatedTarget)&&a(t)&&(t.addEventListener("mouseout",L),V||(M=t.href,N=O(T,_)))}}function E(e){B=+new Date;var t=i(e.target);t&&a(t)&&(H&&(D(H),H=!1),t.addEventListener("touchend",k),t.addEventListener("touchcancel",k),T(t.href))}function x(){e.addEventListener("click",A)}function A(t){if(e.removeEventListener("click",A),H&&(D(H),H=!1),!t.defaultPrevented){var n=i(t.target);n&&a(n)&&(0!=t.button||t.metaKey||t.ctrlKey||(t.preventDefault(),C(n.href)))}}function L(e){if(i(e.target)!=i(e.relatedTarget))return N?(D(N),void(N=!1)):void(Q&&!V&&(R.abort(),d()))}function k(e){Q&&!V&&(H=O(h,500))}function P(){if(2==R.readyState){var n=R.getResponseHeader("Content-Type");n&&/^text\/html/i.test(n)||(Y=!0)}if(!(R.readyState<4)){if(0==R.status)return Z=!0,void(V&&(f("exit",W,"network error"),t.href=W));if(Y)V&&(f("exit",W,"non-html content-type"),t.href=W);else{var i=e.implementation.createHTMLDocument("");i.documentElement.innerHTML=s(R.responseText),X=i.title,z=i.body;var o=f("receive",W,z,X);o&&("body"in o&&(z=o.body),"title"in o&&(X=o.title));var a=r(W);U[a]={body:z,title:X,scrollPosition:a in U?U[a].scrollPosition:0};var l,d,c=i.querySelectorAll("[data-instant-track]");if(c.length!=$.length)j=!0;else for(var u=0;u<c.length;u++)d=(l=c[u]).getAttribute("href")||l.getAttribute("src")||l.textContent,-1==$.indexOf(d)&&(j=!0);V&&(V=!1,C(W))}}}function S(){var e=r(t.href);if(e!=I){if(V&&(d(),R.abort()),!(e in U))return f("exit",t.href,"not in history"),void(e==t.href?t.href=t.href:t.reload());U[I].scrollPosition=pageYOffset,u(),v("remove"),I=e,l(U[e].title,U[e].body,!1,U[e].scrollPosition),v("add")}}function T(e){N&&(D(N),N=!1),e||(e=M),Q&&(e==W||V)||(Q=!0,V=!1,W=e,z=!1,Y=!1,Z=!1,j=!1,f("preload"),R.open("GET",e),R.timeout=9e4,R.send())}function C(e){return J=+new Date,N||!Q?N&&W&&W!=e?(f("exit",e,"click occured while preloading planned"),void(t.href=e)):(T(e),f("wait"),void(V=!0)):V?(f("exit",e,"clicked on a link while waiting for another page to display"),void(t.href=e)):Y?(f("exit",W,"non-html content-type"),void(t.href=W)):Z?(f("exit",W,"network error"),void(t.href=W)):j?(f("exit",W,"different assets"),void(t.href=W)):z?(U[I].scrollPosition=pageYOffset,d(),void l(X,z,W)):(f("wait"),void(V=!0))}function O(){return y(arguments,!1)}function D(e){e=-e;for(var t in te)e in te[t]&&(window.clearTimeout(te[t][e].realId),delete te[t][e])}function q(e,t,n){var r=ie[t][e].indexOf(n);r>-1&&ie[t][e].splice(r,1)}var I,M,N,B,F,H,R,Y,j,K,G=0,U={},W=!1,X=!1,z=!1,J=0,Q=!1,V=!1,Z=!1,$=[],_=65,ee={preload:[],receive:[],wait:[],change:[],restore:[],exit:[]},te={},ne=[],re={},ie={};Element.prototype.matches||(Element.prototype.matches=Element.prototype.webkitMatchesSelector||Element.prototype.msMatchesSelector||function(t){for(var n=this,r=e.querySelectorAll(t),i=0;i<r.length;i++)if(r[i]==n)return!0;return!1});var oe=!1;if("pushState"in history&&"file:"!=t.protocol){oe=!0;var ae=n.indexOf("Android ");if(ae>-1){var fe=parseFloat(n.substr(ae+"Android ".length));if(fe<4.4&&(oe=!1,fe>=4))for(var le=[/ Chrome\//,/ UCBrowser\//,/ Firefox\//,/ Windows Phone /],de=0;de<le.length;de++)if(le[de].test(n)){oe=!0;break}}}return{supported:oe,init:function(n){oe?F||(F=!0,"mousedown"==n?K=!0:"number"==typeof n&&(_=n),I=r(t.href),te[I]={},U[I]={body:e.body,title:e.title,scrollPosition:pageYOffset},"loading"==e.readyState?e.addEventListener("DOMContentLoaded",m):m(),(R=new XMLHttpRequest).addEventListener("readystatechange",P),e.addEventListener("touchstart",E,!0),K?e.addEventListener("mousedown",b,!0):e.addEventListener("mouseover",w,!0),e.addEventListener("click",x,!0),addEventListener("popstate",S)):f("change",!0)},on:function(e,t){ee[e].push(t),"change"==e&&t(!J)},setTimeout:O,setInterval:function(){return y(arguments,!0)},clearTimeout:D,xhr:function(e){ne.push(e)},addPageEvent:function(){I in re||(re[I]=[]),re[I].push(arguments),addEventListener.apply(window,arguments)},removePageEvent:function(){var e=arguments;if(I in re)e:for(var t=0;t<re[I].length;t++)if(e.length==re[I][t].length){for(var n=0;n<re[I][t].length;n++)if(e[n]!=re[I][t][n])continue e;re[I].splice(t,1)}},addEvent:function(t,r,i){if(!(r in ie)&&(ie[r]={},e.addEventListener(r,function(e){var t=e.target;for(e.originalStopPropagation=e.stopPropagation,e.stopPropagation=function(){this.isPropagationStopped=!0,this.originalStopPropagation()};t&&1==t.nodeType;){for(var n in ie[r])if(t.matches(n)){for(var i=0;i<ie[r][n].length;i++)ie[r][n][i].call(t,e);if(e.isPropagationStopped)return;break}t=t.parentNode}},!1),"click"==r&&/iP(?:hone|ad|od)/.test(n))){var o=e.createElement("style");o.setAttribute("instantclick-mobile-safari-cursor",""),o.textContent="body { cursor: pointer !important; }",e.head.appendChild(o)}t in ie[r]||(ie[r][t]=[]),q(t,r,i),ie[r][t].push(i)},removeEvent:q}}(document,location,navigator.userAgent)});
/**
 * Pace
 *
 * A progress bar for the command-line.
 *
 * Example usage:
 *
 *     var total = 50000,
 *         count = 0,
 *         pace = require('pace')(total);
 *
 *     while (count++ < total) {
 *       pace.op();
 *
 *       // Cause some work to be done.
 *       for (var i = 0; i < 1000000; i++) {
 *         count = count;
 *       }
 *     }
 */

// Module dependencies.
var charm = require('charm');

/**
 * Pace 'class'.
 */
function Pace(options) {
  options = options || {};

  // Total number of items to process.
  if (!options.total) {
    throw new Error('You MUST specify the total number of operations that will be processed.');
  }
  this.total = options.total;

  // Current item number.
  this.current = 0;

  // Maximum percent of total time the progressbar is allowed to take during processing.
  // Defaults to 0.5%
  this.max_burden = options.maxBurden || 0.5;

  // Whether to show current burden %.
  this.show_burden = options.showBurden || false;

  // Internal time tracking properties.
  this.started = false;
  this.size = 50;
  this.inner_time = 0;
  this.outer_time = 0;
  this.elapsed = 0;
  this.time_start = 0;
  this.time_end = 0;
  this.time_left = 0;
  this.time_burden = 0;
  this.skip_steps = 0;
  this.skipped = 0;
  this.aborted = false;

  // Setup charm.
  this.charm = charm();
  this.charm.pipe(process.stdout);

  // Prepare the output.
  this.charm.write("\n\n\n");
}

/**
 * Export a factory function for new pace instances.
 */
module.exports = function(options) {
  if (typeof options === 'number') {
    options = {
      total: options
    };
  }
  return new Pace(options);
};

/**
 * An operation has been emitted.
 */
Pace.prototype.op = function op(count) {
  if (count) {
    this.current = count;
  }
  else {
    this.current++;
  }

  if (this.burdenReached()) {
    return;
  }

  // Record the start time of the whole task.
  if (!this.started) {
    this.started = new Date().getTime();
  }

  // Record start time.
  this.time_start = new Date().getTime();

  this.updateTimes();
  this.clear();
  this.outputProgress();
  this.outputStats();
  this.outputTimes();

  // The task is complete.
  if (this.current >= this.total) {
    this.finished();
  }

  // Record end time.
  this.time_end = new Date().getTime();
  this.inner_time = this.time_end - this.time_start;
};

/**
 * Update times.
 */
Pace.prototype.updateTimes = function updateTimes() {
  this.elapsed = this.time_start - this.started;
  if (this.time_end > 0) {
    this.outer_time = this.time_start - this.time_end;
  }
  if (this.inner_time > 0 && this.outer_time > 0) {
    // Set Current Burden
    this.time_burden = (this.inner_time / (this.inner_time + this.outer_time)) * 100;

    // Estimate time left.
    this.time_left = (this.elapsed / this.current) * (this.total - this.current);

    if (this.time_left < 0) this.time_left = 0;
  }
  // If our "burden" is too high, increase the skip steps.
  if (this.time_burden > this.max_burden && (this.skip_steps < (this.total / this.size))) {
    this.skip_steps = Math.floor(++this.skip_steps * 1.3);
  }
};

/**
 * Move the cursor back to the beginning and clear old output.
 */
Pace.prototype.clear = function clear() {
  this.charm.erase('line').up(1).erase('line').up(1).erase('line').write("\r");
};

/**
 * Output the progress bar.
 */
Pace.prototype.outputProgress = function outputProgress() {
  this.charm.write('Processing: ');
  this.charm.foreground('green').background('green');
  for (var i = 0; i < ((this.current / this.total) * this.size) - 1 ; i++) {
     this.charm.write(' ');
  }
  this.charm.foreground('white').background('white');
  while (i < this.size - 1) {
    this.charm.write(' ');
    i++;
  }
  this.charm.display('reset').down(1).left(100);
};

/**
 * Output numerical progress stats.
 */
Pace.prototype.outputStats = function outputStats() {
  this.perc = (this.current/this.total)*100;
  this.perc = padLeft(this.perc.toFixed(2), 2);
  this.charm.write('            ').display('bright').write(this.perc + '%').display('reset');
  this.total_len = formatNumber(this.total).length;
  this.charm.write('   ').display('bright').write(padLeft(formatNumber(this.current), this.total_len)).display('reset');
  this.charm.write('/' + formatNumber(this.total));

  // Output burden.
  if (this.show_burden) {
    this.charm.write('    ').display('bright').write('Burden: ').display('reset');
    this.charm.write(this.time_burden.toFixed(2) + '% / ' + this.skip_steps);
  }

  this.charm.display('reset').down(1).left(100);
};

/**
 * Output times.
 */
Pace.prototype.outputTimes = function outputTimes() {
  // Output times.
  var hours = Math.floor(this.elapsed / (1000 * 60 * 60));
  var min = Math.floor(((this.elapsed / 1000) % (60 * 60)) / 60);
  var sec = Math.floor((this.elapsed / 1000) % 60);

  this.charm.write('            ').display('bright').write('Elapsed: ').display('reset');
  this.charm.write(hours + 'h ' + min + 'm ' + sec + 's');

  if (this.time_left){
    hours = Math.floor(this.time_left / (1000 * 60 * 60));
    min = Math.floor(((this.time_left / 1000) % (60 * 60)) / 60);
    sec = Math.ceil((this.time_left / 1000) % 60);

    this.charm.write('   ').display('bright').write('Remaining: ').display('reset');
    this.charm.write(hours + 'h ' + min + 'm ' + sec + 's');
  }
};

/**
 * The progress has finished.
 */
Pace.prototype.finished = function finished() {
  this.charm.write("\n\n");
  this.charm.write('Finished!');
  this.charm.write("\n\n");
};

/**
 * Check if the burden threshold has been reached.
 */
Pace.prototype.burdenReached = function burdenReached() {
  // Skip this cycle if the burden has determined we should.
  if ((this.skip_steps > 0) && (this.current < this.total)) {
    if (this.skipped < this.skip_steps) {
      this.skipped++;
      return true;
    }
    else {
      this.skipped = 0;
    }
  }
  return false;
};


/**
 * Utility functions.
 */

// Left-pad a string.
function padLeft(str, length, pad) {
  pad = pad || ' ';
  while (str.length < length)
    str = pad + str;
  return str;
}

// Ported from php.js. Same has php's number_format().
function formatNumber(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
