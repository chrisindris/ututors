/* $jq3(function ($) {
    if($('.hero-image-display').length) {
        var active = $('.hero-image-wrapper.active').get(0).id;
        var display = $('#hero-image-display');
        // Use jQuery 3
        $('.hero-image-thumb').on('click', function (ev) {
            ev.preventDefault();
            let button = $(ev.delegateTarget);
            console.log(button.attr('data-target'));
            var target = button.attr('data-target');
            console.log(target);
            if(target != active) {
                $('#' + active).removeClass('active');
                $('.hero-image-thumb[data-target="' + active + '"]').removeClass('active');
                $('#' + target).addClass('active');
                button.addClass('active');
                active = target;
                display.attr('data-active', target);
                console.log(active, target);
            }
            //heroDisplay.setActive(button.attr('data-target'));
        });
    }
});
*/

$jq3(function($) {
    $('#hero-image-carousel').on('slide.bs.carousel', function(ev) {
        $('.hero-image-thumb.active').removeClass('active');
        $('.hero-image-thumb[data-slide-to="' + ev.to + '"]').addClass('active');
    });
});

$jq3(function($) {

    var navigation = $('#navigation');
    var navPanel = $('.nav-panel-inner');
    var menuBTN = $('#small-menu-button');
    var searchBTN = $('#small-search-button');
    var searchBar = $('#search-bar');
    var hasScrollbar = window.innerWidth > document.documentElement.clientWidth;

    // Close Menu / Search Functions
    function closeMenu() {
        menuBTN.attr('aria-expanded', false);
        //navigationModal.modal('hide'); // This breaks animation
        $('body').removeClass('modal-open').css('padding-right', '0');
        $('.modal-backdrop').remove();
        navigation.removeClass('show').removeAttr('aria-modal tabindex').attr('aria-hidden', 'true');

        menuBTN.removeClass('open');
        menuBTN.children('i').addClass('fa-bars').removeClass('fa-times-circle');
        menuBTN.focus();
    }

    function closeSearch() {
        searchBTN.removeClass('open');
        searchBTN.children('i').removeClass('fa-times-circle').addClass('fa-search');
        $('#search-bar').removeClass('shown').collapse('hide');
        searchBTN.focus();
    }

    // Menu
    $('#navigation .submenu-toggle').on('click', function(ev) {
        ev.preventDefault();
        var target = ev.currentTarget;
        var targetMenu = $(target).attr('data-target');
        var menu = $('#navigation li[data-menu="' + targetMenu + '"');
        menu.toggleClass('menu-open');
        $(target).toggleClass('menu-open').attr('aria-expanded', $(target).hasClass('menu-open'));
        menu.children('.sub-menu').toggle();
        console.log(menu);
    });

    menuBTN.on('click', function(ev) {
        ev.preventDefault();
        $(ev.currentTarget).children('i').toggleClass('fa-times-circle fa-bars');
        $(ev.currentTarget).toggleClass('open');
        navigation.toggleClass('show').removeAttr('aria-hidden');

        if (navigation.hasClass('show')) {
            menuBTN.attr('aria-expanded', true);
            /* .modal('hide') breaks and modal has to be manually removed.
            * Default modal method doesn't automatically re-add manually removed stuff.
            * Need to add modal + backdrop manually. Method option for backdrop is set false to prevent duplication on load. */
            navigation.modal({
                'backdrop': false,
                'show': true,
                'keyboard': false // breaks animation
            }).attr('tabindex', '-1').css('padding-right', '0');
            $('body').addClass('modal-open').append('<div class="modal-backdrop show"></div>').css('padding-right', '0');

            // Makes up for default scrollbar calculation
            if (hasScrollbar) {
                $('.modal-open').css('padding-right', '15px');
                //console.log('true');
            } else {
                $('.modal-open').css('padding-right', '0');
                //console.log('false');
            }
            navigation.focus(); // Linter complained when added above
        } else {
            closeMenu();
        }

        if($('#search-bar').hasClass('shown')) {
            closeSearch();
        }
    });

    $('#close-menu-button, #sr-close-menu-button').on('click', function(ev) {
        closeMenu(ev);
    });

    $(document).on('click', function(ev) {
        if (navigation.hasClass('show')) {
            var navClick = $('#navigation, .nav-btns');
            if (!navClick.is(ev.target) && navClick.has(ev.target).length === 0) {
                closeMenu(ev);
            }
        }
    });

    // Identify Parent items
    var submenuBTN = $('.submenu-toggle');
    submenuBTN.parents('li').addClass('parent-item');
    submenuBTN.siblings('a').addClass('parent-item-link').wrapInner('<span></span>');

    // Add Label for Submenu Toggle
    submenuBTN.each(function() {
        var parentTitle = $(this).siblings('.parent-item-link').children('span').text();
        $(this).attr('aria-label', "Expand / Collapse " + parentTitle);
    });

    // Search
    $('button.search-button').on('click', function(ev) {
        if (navigation.hasClass('show')) {
            closeMenu();
        }

        searchBTN.children('i').toggleClass('fa-times-circle fa-search');
        searchBTN.toggleClass('open');
        searchBar.toggleClass('shown');

        if (searchBar.hasClass('shown')) {
           setTimeout(function() {
               //wait for search to expand before focus
               $("#utm-search-bar").focus();
           },300);
        }
    });

    // Esc Key Functions
    $(document).keyup(function(ev) {
        if (ev.key === 'Escape') { // Esc key code

            if (navigation.hasClass('show')) {
                closeMenu(ev);
            }

            if ($('#utm-search-bar').is(':focus')) {
                // close search bar with esc key if input is focused
                closeSearch(ev);
            }
        }
    });

    // Header Offset for Mobile Nav Position

    function addMaxHeight() {
        var windowSize = $( window ).width();
        var navPanelHeight;
        var headerHeight;
        var calcMH;

        if (windowSize < 768) {
            headerHeight = $('#header').outerHeight() + 'px';
            navPanelHeight = '100vh - ' + headerHeight;
            calcMH = 'calc(' + navPanelHeight + ')';

        } else {
            headerHeight = 0;
            navPanelHeight = '100vh - '+ $('.nav-panel-title').outerHeight() +'px';
            calcMH = 'calc(' + navPanelHeight + ')';

        }
        navigation.css('top', headerHeight);
        navPanel.css('max-height', calcMH );
    }

    addMaxHeight();

    $(window).on('resize', addMaxHeight);

});

$jq3(function($) {
    // Sidebar
    var parentItem = $('.sidebar .main-menu .collapsed');
    parentItem.addClass('parent-item');
    parentItem.find('a').addClass('parent-item-link').wrapInner('<span></span>');
});

$jq3(function($) {

    if ($('.block-quicktabs').length > 0) {
        let tabList = $('ul.quicktabs-tabs');
        let tabItem = $('ul.quicktabs-tabs li');
        let tabItemA = $('ul.quicktabs-tabs li a');
        let tabPanel = $('.quicktabs_main .quicktabs-tabpage');

        $('.block-quicktabs').each(function(index) {
            let tabLabel = $(this).children('h2').text();

            $(this).find(tabList).addClass('nav nav-pills').attr({
                'aria-label': tabLabel,
                'role': 'tablist'
            });
        });

        $(tabItem).each(function() {
            let ariaControls = $(this).children('a').attr('id').replace('-tab-', '-tabpage-');

            $(this).addClass('nav-item');

            $(this).children('a').addClass('nav-link').removeClass('active').attr({
                //'aria-selected': 'true',
                'aria-controls': ariaControls,
                'role': 'tab',
            });

            if ($(this).is('.active')) {
                $(this).children('a').attr({
                    'aria-selected': 'true',
                });
            } else {
                $(this).children('a').attr({
                    'aria-selected': 'false',
                });
            }
        });

        $(tabItemA).on('click', function(event) {
            //console.log('clicked');
            $(this).parents('li').siblings().children('a').attr('aria-selected', 'false');
            $(this).attr('aria-selected', 'true');
        });

        $(tabPanel).each(function() {
            var ariaLabelBy = $(this).attr('id').replace('-tabpage-', '-tab-');

            $(this).attr({
                'role': 'tabpanel',
                'aria-labelledby': ariaLabelBy
            });
        });
    }
});

$jq3(function($) {
    let backTop = $('#back-to-top');
    let startTime = null;
    let startPos = null;
    let duration = 350; // .35s
    let getProgress = function(now) {
        let progress = (now - startTime) / duration;
        return Math.min(Math.max(progress, 0), 1); // [0 and 1]
    }
    let easeing = function (p) {
        if(p < .5) return 2*p*p;
        else {
            return -1 + (4-2*p) * p;
        }
        /*
        t,b,c,d
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
         */
    }

    function scrollToTop(scrollDuration) {
        let scrollInterval = function (ts) {
                if(!startTime) startTime = ts;
                if(!startPos) startPos = window.scrollY;

                if ( window.scrollY !== 0 ) {
                    window.scrollTo(0, startPos - startPos*easeing(getProgress(ts)));
                    window.requestAnimationFrame(scrollInterval);
                   // window.scrollTo(0, (startPos - ))
                }
                else {
                    //reset for the next time
                    startPos = null;
                    startTime = null;
                }

            };
            window.requestAnimationFrame(scrollInterval);
    }

    $(window).scroll(function() {
        if($(this).scrollTop() > 0) {
            backTop.addClass('is-on');
        } else {
            backTop.removeClass('is-on shift-left');
        }
    });

    backTop.click(function(e) {
        e.preventDefault();
        scrollToTop(350);
	});
});

$jq3(function ($) {
    $('.cal-widget').each(function() {
        $(this).find('.cal-day').each(function() {
            var day = this;
            $(this).find('.cal-day-contents').each(function()  {
                if ($.trim($(this).text()) == "") {
                    $(day).addClass('no-data');
                }
            });
        });
    });
});

$jq3(function ($) {
    if($('#hero-image-display').length) {
        let heroes = $('.hero-image');
        heroes.find('img').each(function (i, el) {
            let image = $(el).get(0);
            let loadTest = new Image();
            loadTest.onload = function (ev) {
                $(image).closest('.hero-image').addClass('hero-image-loaded');
            };
            if(image.currentSrc) {
                loadTest.src = image.currentSrc;
            } else {
                loadTest.src = image.src;
            }
        })
    }
});

$jq3(function ($) {
    if($('.news-image-header-image').length) {
        let headerImage = $('.news-image-header-image');
        headerImage.find('img').each(function (i, el) {
            let image = $(el).get(0);
            let loadTest = new Image();
            loadTest.onload = function (ev) {
                $(image).closest('.news-image-header-image').addClass('news-image-loaded');
            };
            if(image.currentSrc) {
                loadTest.src = image.currentSrc;
            } else {
                loadTest.src = image.src;
            }
        })
    }
});

$jq3(function($) {
    $('.people-list.layout-cols-3').each(function() {
        //var items = $(this).children().length;
        $this = $(this);
        $this.children().not('.people-sticky').each(function(a) {
            if ( a % 3 == 1) {
                $(this).addClass('mid');
            }
        });

        if ( $this.children('.people-card:last-child').hasClass('mid')) {
            $this.addClass('mid-end');
        }
    });

    if ( ! Modernizr.objectfit ) {
        $('.people-photo').each(function() {
            var imgSRC = $(this).find('img').prop('src');

            if (imgSRC) {
                $(this).css('backgroundImage', 'url(' + imgSRC + ')').addClass('ie-object-fit');
            }
        });
    }
});

$jq3(function($) {
   $('.nav-btns *[data-tooltip="tooltip"]').tooltip();
});

$jq3(function ($) {
   if(typeof ga === 'function') {
       $('#navi-button').on('click', function (ev) {
          ga('send', 'event', 'navi', 'click', 'Navi VA');
       });
   }
});;
/**
 * v5.0.0
 * Applies the :focus-visible polyfill at the given scope.
 * A scope in this case is either the top-level Document or a Shadow Root.
 *
 * @param {(Document|ShadowRoot)} scope
 * @see https://github.com/WICG/focus-visible
 */
function applyFocusVisiblePolyfill(scope) {
  var hadKeyboardEvent = true;
  var hadFocusVisibleRecently = false;
  var hadFocusVisibleRecentlyTimeout = null;

  var inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    'datetime-local': true
  };

  /**
   * Helper function for legacy browsers and iframes which sometimes focus
   * elements like document, body, and non-interactive SVG.
   * @param {Element} el
   */
  function isValidFocusTarget(el) {
    if (
      el &&
      el !== document &&
      el.nodeName !== 'HTML' &&
      el.nodeName !== 'BODY' &&
      'classList' in el &&
      'contains' in el.classList
    ) {
      return true;
    }
    return false;
  }

  /**
   * Computes whether the given element should automatically trigger the
   * `focus-visible` class being added, i.e. whether it should always match
   * `:focus-visible` when focused.
   * @param {Element} el
   * @return {boolean}
   */
  function focusTriggersKeyboardModality(el) {
    var type = el.type;
    var tagName = el.tagName;

    if (tagName == 'INPUT' && inputTypesWhitelist[type] && !el.readOnly) {
      return true;
    }

    if (tagName == 'TEXTAREA' && !el.readOnly) {
      return true;
    }

    if (el.isContentEditable) {
      return true;
    }

    return false;
  }

  /**
   * Add the `focus-visible` class to the given element if it was not added by
   * the author.
   * @param {Element} el
   */
  function addFocusVisibleClass(el) {
    if (el.classList.contains('focus-visible')) {
      return;
    }
    el.classList.add('focus-visible');
    el.setAttribute('data-focus-visible-added', '');
  }

  /**
   * Remove the `focus-visible` class from the given element if it was not
   * originally added by the author.
   * @param {Element} el
   */
  function removeFocusVisibleClass(el) {
    if (!el.hasAttribute('data-focus-visible-added')) {
      return;
    }
    el.classList.remove('focus-visible');
    el.removeAttribute('data-focus-visible-added');
  }

  /**
   * If the most recent user interaction was via the keyboard;
   * and the key press did not include a meta, alt/option, or control key;
   * then the modality is keyboard. Otherwise, the modality is not keyboard.
   * Apply `focus-visible` to any current active element and keep track
   * of our keyboard modality state with `hadKeyboardEvent`.
   * @param {KeyboardEvent} e
   */
  function onKeyDown(e) {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }

    if (isValidFocusTarget(scope.activeElement)) {
      addFocusVisibleClass(scope.activeElement);
    }

    hadKeyboardEvent = true;
  }

  /**
   * If at any point a user clicks with a pointing device, ensure that we change
   * the modality away from keyboard.
   * This avoids the situation where a user presses a key on an already focused
   * element, and then clicks on a different element, focusing it with a
   * pointing device, while we still think we're in keyboard modality.
   * @param {Event} e
   */
  function onPointerDown(e) {
    hadKeyboardEvent = false;
  }

  /**
   * On `focus`, add the `focus-visible` class to the target if:
   * - the target received focus as a result of keyboard navigation, or
   * - the event target is an element that will likely require interaction
   *   via the keyboard (e.g. a text box)
   * @param {Event} e
   */
  function onFocus(e) {
    // Prevent IE from focusing the document or HTML element.
    if (!isValidFocusTarget(e.target)) {
      return;
    }

    if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
      addFocusVisibleClass(e.target);
    }
  }

  /**
   * On `blur`, remove the `focus-visible` class from the target.
   * @param {Event} e
   */
  function onBlur(e) {
    if (!isValidFocusTarget(e.target)) {
      return;
    }

    if (
      e.target.classList.contains('focus-visible') ||
      e.target.hasAttribute('data-focus-visible-added')
    ) {
      // To detect a tab/window switch, we look for a blur event followed
      // rapidly by a visibility change.
      // If we don't see a visibility change within 100ms, it's probably a
      // regular focus change.
      hadFocusVisibleRecently = true;
      window.clearTimeout(hadFocusVisibleRecentlyTimeout);
      hadFocusVisibleRecentlyTimeout = window.setTimeout(function() {
        hadFocusVisibleRecently = false;
        window.clearTimeout(hadFocusVisibleRecentlyTimeout);
      }, 100);
      removeFocusVisibleClass(e.target);
    }
  }

  /**
   * If the user changes tabs, keep track of whether or not the previously
   * focused element had .focus-visible.
   * @param {Event} e
   */
  function onVisibilityChange(e) {
    if (document.visibilityState == 'hidden') {
      // If the tab becomes active again, the browser will handle calling focus
      // on the element (Safari actually calls it twice).
      // If this tab change caused a blur on an element with focus-visible,
      // re-apply the class when the user switches back to the tab.
      if (hadFocusVisibleRecently) {
        hadKeyboardEvent = true;
      }
      addInitialPointerMoveListeners();
    }
  }

  /**
   * Add a group of listeners to detect usage of any pointing devices.
   * These listeners will be added when the polyfill first loads, and anytime
   * the window is blurred, so that they are active when the window regains
   * focus.
   */
  function addInitialPointerMoveListeners() {
    document.addEventListener('mousemove', onInitialPointerMove);
    document.addEventListener('mousedown', onInitialPointerMove);
    document.addEventListener('mouseup', onInitialPointerMove);
    document.addEventListener('pointermove', onInitialPointerMove);
    document.addEventListener('pointerdown', onInitialPointerMove);
    document.addEventListener('pointerup', onInitialPointerMove);
    document.addEventListener('touchmove', onInitialPointerMove);
    document.addEventListener('touchstart', onInitialPointerMove);
    document.addEventListener('touchend', onInitialPointerMove);
  }

  function removeInitialPointerMoveListeners() {
    document.removeEventListener('mousemove', onInitialPointerMove);
    document.removeEventListener('mousedown', onInitialPointerMove);
    document.removeEventListener('mouseup', onInitialPointerMove);
    document.removeEventListener('pointermove', onInitialPointerMove);
    document.removeEventListener('pointerdown', onInitialPointerMove);
    document.removeEventListener('pointerup', onInitialPointerMove);
    document.removeEventListener('touchmove', onInitialPointerMove);
    document.removeEventListener('touchstart', onInitialPointerMove);
    document.removeEventListener('touchend', onInitialPointerMove);
  }

  /**
   * When the polfyill first loads, assume the user is in keyboard modality.
   * If any event is received from a pointing device (e.g. mouse, pointer,
   * touch), turn off keyboard modality.
   * This accounts for situations where focus enters the page from the URL bar.
   * @param {Event} e
   */
  function onInitialPointerMove(e) {
    // Work around a Safari quirk that fires a mousemove on <html> whenever the
    // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
    if (e.target.nodeName && e.target.nodeName.toLowerCase() === 'html') {
      return;
    }

    hadKeyboardEvent = false;
    removeInitialPointerMoveListeners();
  }

  // For some kinds of state, we are interested in changes at the global scope
  // only. For example, global pointer input, global key presses and global
  // visibility change should affect the state at every scope:
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, true);
  document.addEventListener('visibilitychange', onVisibilityChange, true);

  addInitialPointerMoveListeners();

  // For focus and blur, we specifically care about state changes in the local
  // scope. This is because focus / blur events that originate from within a
  // shadow root are not re-dispatched from the host element if it was already
  // the active element in its own scope:
  scope.addEventListener('focus', onFocus, true);
  scope.addEventListener('blur', onBlur, true);

  // We detect that a node is a ShadowRoot by ensuring that it is a
  // DocumentFragment and also has a host property. This check covers native
  // implementation and polyfill implementation transparently. If we only cared
  // about the native implementation, we could just check if the scope was
  // an instance of a ShadowRoot.
  if (scope.nodeType === Node.DOCUMENT_FRAGMENT_NODE && scope.host) {
    // Since a ShadowRoot is a special kind of DocumentFragment, it does not
    // have a root element to add a class to. So, we add this attribute to the
    // host element instead:
    scope.host.setAttribute('data-js-focus-visible', '');
  } else if (scope.nodeType === Node.DOCUMENT_NODE) {
    document.documentElement.classList.add('js-focus-visible');
  }
}

// Make the polyfill helper globally available. This can be used as a signal to
// interested libraries that wish to coordinate with the polyfill for e.g.,
// applying the polyfill to a shadow root:
window.applyFocusVisiblePolyfill = applyFocusVisiblePolyfill;

// Notify interested libraries of the polyfill's presence, in case the polyfill
// was loaded lazily:
var event;

try {
  event = new CustomEvent('focus-visible-polyfill-ready');
} catch (error) {
  // IE11 does not support using CustomEvent as a constructor directly:
  event = document.createEvent('CustomEvent');
  event.initCustomEvent('focus-visible-polyfill-ready', false, false, {});
}

window.dispatchEvent(event);

// Apply the polyfill to the global document, so that no JavaScript coordination
// is required to use the polyfill in the top-level document:
applyFocusVisiblePolyfill(document);
;
/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-objectfit-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,i,s,a;for(var l in C)if(C.hasOwnProperty(l)){if(e=[],n=C[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),h.push((o?"":"no-")+a.join("-"))}}function i(e){var n=_.className,t=Modernizr._config.classPrefix||"";if(w&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),w?_.className.baseVal=n:_.className=n)}function s(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function a(e,n){return!!~(""+e).indexOf(n)}function l(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):w?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function f(e,n){return function(){return e.apply(n,arguments)}}function u(e,n,t){var o;for(var i in e)if(e[i]in n)return t===!1?e[i]:(o=n[e[i]],r(o,"function")?f(o,t||n):o);return!1}function p(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function c(n,t,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,n,t);var i=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){var s=i.error?"error":"log";i[s].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&n.currentStyle&&n.currentStyle[r];return o}function d(){var e=n.body;return e||(e=l(w?"svg":"body"),e.fake=!0),e}function m(e,t,r,o){var i,s,a,f,u="modernizr",p=l("div"),c=d();if(parseInt(r,10))for(;r--;)a=l("div"),a.id=o?o[r]:u+(r+1),p.appendChild(a);return i=l("style"),i.type="text/css",i.id="s"+u,(c.fake?c:p).appendChild(i),c.appendChild(p),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),p.id=u,c.fake&&(c.style.background="",c.style.overflow="hidden",f=_.style.overflow,_.style.overflow="hidden",_.appendChild(c)),s=t(p,e),c.fake?(c.parentNode.removeChild(c),_.style.overflow=f,_.offsetHeight):p.parentNode.removeChild(p),!!s}function v(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(p(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+p(n[o])+":"+r+")");return i=i.join(" or "),m("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==c(e,null,"position")})}return t}function y(e,n,o,i){function f(){p&&(delete P.style,delete P.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var u=v(e,o);if(!r(u,"undefined"))return u}for(var p,c,d,m,y,g=["modernizr","tspan","samp"];!P.style&&g.length;)p=!0,P.modElem=l(g.shift()),P.style=P.modElem.style;for(d=e.length,c=0;d>c;c++)if(m=e[c],y=P.style[m],a(m,"-")&&(m=s(m)),P.style[m]!==t){if(i||r(o,"undefined"))return f(),"pfx"==n?m:!0;try{P.style[m]=o}catch(h){}if(P.style[m]!=y)return f(),"pfx"==n?m:!0}return f(),!1}function g(e,n,t,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+b.join(s+" ")+s).split(" ");return r(n,"string")||r(n,"undefined")?y(a,n,o,i):(a=(e+" "+j.join(s+" ")+s).split(" "),u(a,n,t))}var h=[],C=[],S={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){C.push({name:e,fn:n,options:t})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=S,Modernizr=new Modernizr;var _=n.documentElement,w="svg"===_.nodeName.toLowerCase(),x="Moz O ms Webkit",b=S._config.usePrefixes?x.split(" "):[];S._cssomPrefixes=b;var E=function(n){var r,o=prefixes.length,i=e.CSSRule;if("undefined"==typeof i)return t;if(!n)return!1;if(n=n.replace(/^@/,""),r=n.replace(/-/g,"_").toUpperCase()+"_RULE",r in i)return"@"+n;for(var s=0;o>s;s++){var a=prefixes[s],l=a.toUpperCase()+"_"+r;if(l in i)return"@-"+a.toLowerCase()+"-"+n}return!1};S.atRule=E;var j=S._config.usePrefixes?x.toLowerCase().split(" "):[];S._domPrefixes=j;var z={elem:l("modernizr")};Modernizr._q.push(function(){delete z.elem});var P={style:z.elem.style};Modernizr._q.unshift(function(){delete P.style}),S.testAllProps=g;var N=S.prefixed=function(e,n,t){return 0===e.indexOf("@")?E(e):(-1!=e.indexOf("-")&&(e=s(e)),n?g(e,n,t):g(e,"pfx"))};Modernizr.addTest("objectfit",!!N("objectFit"),{aliases:["object-fit"]}),o(),i(h),delete S.addTest,delete S.addAsyncTest;for(var T=0;T<Modernizr._q.length;T++)Modernizr._q[T]();e.Modernizr=Modernizr}(window,document);;
