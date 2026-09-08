!function($) {
    "use strict";
    $.fn.fitVids = function(options) {
        var settings = {
            customSelector: null,
            ignore: null
        };
        if (!document.getElementById("fit-vids-style")) {
            var head = document.head || document.getElementsByTagName("head")[0], div = document.createElement("div");
            div.innerHTML = '<p>x</p><style id="fit-vids-style">.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>', 
            head.appendChild(div.childNodes[1]);
        }
        return options && $.extend(settings, options), this.each(function() {
            var selectors = [ 'iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', "object", "embed" ];
            settings.customSelector && selectors.push(settings.customSelector);
            var ignoreList = ".fitvidsignore";
            settings.ignore && (ignoreList = ignoreList + ", " + settings.ignore);
            var $allVideos = $(this).find(selectors.join(","));
            $allVideos = $allVideos.not("object object"), $allVideos = $allVideos.not(ignoreList), 
            $allVideos.each(function() {
                var $this = $(this);
                if (!($this.parents(ignoreList).length > 0 || "embed" === this.tagName.toLowerCase() && $this.parent("object").length || $this.parent(".fluid-width-video-wrapper").length)) {
                    $this.css("height") || $this.css("width") || !isNaN($this.attr("height")) && !isNaN($this.attr("width")) || ($this.attr("height", 9), 
                    $this.attr("width", 16));
                    var height = "object" === this.tagName.toLowerCase() || $this.attr("height") && !isNaN(parseInt($this.attr("height"), 10)) ? parseInt($this.attr("height"), 10) : $this.height(), width = isNaN(parseInt($this.attr("width"), 10)) ? $this.width() : parseInt($this.attr("width"), 10), aspectRatio = height / width;
                    if (!$this.attr("name")) {
                        var videoName = "fitvid" + $.fn.fitVids._count;
                        $this.attr("name", videoName), $.fn.fitVids._count++;
                    }
                    $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * aspectRatio + "%"), 
                    $this.removeAttr("height").removeAttr("width");
                }
            });
        });
    }, $.fn.fitVids._count = 0;
}(window.jQuery || window.Zepto), function(factory) {
    "function" == typeof define && define.amd ? define([ "jquery" ], factory) : factory("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto);
}(function($) {
    var mfp, _prevStatus, _document, _prevContentType, _wrapClasses, _currPopupType, MagnificPopup = function() {}, _isJQ = !!window.jQuery, _window = $(window), _mfpOn = function(name, f) {
        mfp.ev.on("mfp" + name + ".mfp", f);
    }, _getEl = function(className, appendTo, html, raw) {
        var el = document.createElement("div");
        return el.className = "mfp-" + className, html && (el.innerHTML = html), raw ? appendTo && appendTo.appendChild(el) : (el = $(el), 
        appendTo && el.appendTo(appendTo)), el;
    }, _mfpTrigger = function(e, data) {
        mfp.ev.triggerHandler("mfp" + e, data), mfp.st.callbacks && (e = e.charAt(0).toLowerCase() + e.slice(1), 
        mfp.st.callbacks[e] && mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [ data ]));
    }, _getCloseBtn = function(type) {
        return type === _currPopupType && mfp.currTemplate.closeBtn || (mfp.currTemplate.closeBtn = $(mfp.st.closeMarkup.replace("%title%", mfp.st.tClose)), 
        _currPopupType = type), mfp.currTemplate.closeBtn;
    }, _checkInstance = function() {
        $.magnificPopup.instance || (mfp = new MagnificPopup(), mfp.init(), $.magnificPopup.instance = mfp);
    }, supportsTransitions = function() {
        var s = document.createElement("p").style, v = [ "ms", "O", "Moz", "Webkit" ];
        if (void 0 !== s.transition) return !0;
        for (;v.length; ) if (v.pop() + "Transition" in s) return !0;
        return !1;
    };
    MagnificPopup.prototype = {
        constructor: MagnificPopup,
        init: function() {
            var appVersion = navigator.appVersion;
            mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener, mfp.isAndroid = /android/gi.test(appVersion), 
            mfp.isIOS = /iphone|ipad|ipod/gi.test(appVersion), mfp.supportsTransition = supportsTransitions(), 
            mfp.probablyMobile = mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), 
            _document = $(document), mfp.popupsCache = {};
        },
        open: function(data) {
            var i;
            if (!1 === data.isObj) {
                mfp.items = data.items.toArray(), mfp.index = 0;
                var item, items = data.items;
                for (i = 0; i < items.length; i++) if (item = items[i], item.parsed && (item = item.el[0]), 
                item === data.el[0]) {
                    mfp.index = i;
                    break;
                }
            } else mfp.items = $.isArray(data.items) ? data.items : [ data.items ], mfp.index = data.index || 0;
            if (mfp.isOpen) return void mfp.updateItemHTML();
            mfp.types = [], _wrapClasses = "", data.mainEl && data.mainEl.length ? mfp.ev = data.mainEl.eq(0) : mfp.ev = _document, 
            data.key ? (mfp.popupsCache[data.key] || (mfp.popupsCache[data.key] = {}), mfp.currTemplate = mfp.popupsCache[data.key]) : mfp.currTemplate = {}, 
            mfp.st = $.extend(!0, {}, $.magnificPopup.defaults, data), mfp.fixedContentPos = "auto" === mfp.st.fixedContentPos ? !mfp.probablyMobile : mfp.st.fixedContentPos, 
            mfp.st.modal && (mfp.st.closeOnContentClick = !1, mfp.st.closeOnBgClick = !1, mfp.st.showCloseBtn = !1, 
            mfp.st.enableEscapeKey = !1), mfp.bgOverlay || (mfp.bgOverlay = _getEl("bg").on("click.mfp", function() {
                mfp.close();
            }), mfp.wrap = _getEl("wrap").attr("tabindex", -1).on("click.mfp", function(e) {
                mfp._checkIfClose(e.target) && mfp.close();
            }), mfp.container = _getEl("container", mfp.wrap)), mfp.contentContainer = _getEl("content"), 
            mfp.st.preloader && (mfp.preloader = _getEl("preloader", mfp.container, mfp.st.tLoading));
            var modules = $.magnificPopup.modules;
            for (i = 0; i < modules.length; i++) {
                var n = modules[i];
                n = n.charAt(0).toUpperCase() + n.slice(1), mfp["init" + n].call(mfp);
            }
            _mfpTrigger("BeforeOpen"), mfp.st.showCloseBtn && (mfp.st.closeBtnInside ? (_mfpOn("MarkupParse", function(e, template, values, item) {
                values.close_replaceWith = _getCloseBtn(item.type);
            }), _wrapClasses += " mfp-close-btn-in") : mfp.wrap.append(_getCloseBtn())), mfp.st.alignTop && (_wrapClasses += " mfp-align-top"), 
            mfp.fixedContentPos ? mfp.wrap.css({
                overflow: mfp.st.overflowY,
                overflowX: "hidden",
                overflowY: mfp.st.overflowY
            }) : mfp.wrap.css({
                top: _window.scrollTop(),
                position: "absolute"
            }), (!1 === mfp.st.fixedBgPos || "auto" === mfp.st.fixedBgPos && !mfp.fixedContentPos) && mfp.bgOverlay.css({
                height: _document.height(),
                position: "absolute"
            }), mfp.st.enableEscapeKey && _document.on("keyup.mfp", function(e) {
                27 === e.keyCode && mfp.close();
            }), _window.on("resize.mfp", function() {
                mfp.updateSize();
            }), mfp.st.closeOnContentClick || (_wrapClasses += " mfp-auto-cursor"), _wrapClasses && mfp.wrap.addClass(_wrapClasses);
            var windowHeight = mfp.wH = _window.height(), windowStyles = {};
            if (mfp.fixedContentPos && mfp._hasScrollBar(windowHeight)) {
                var s = mfp._getScrollbarSize();
                s && (windowStyles.marginRight = s);
            }
            mfp.fixedContentPos && (mfp.isIE7 ? $("body, html").css("overflow", "hidden") : windowStyles.overflow = "hidden");
            var classesToadd = mfp.st.mainClass;
            return mfp.isIE7 && (classesToadd += " mfp-ie7"), classesToadd && mfp._addClassToMFP(classesToadd), 
            mfp.updateItemHTML(), _mfpTrigger("BuildControls"), $("html").css(windowStyles), 
            mfp.bgOverlay.add(mfp.wrap).prependTo(mfp.st.prependTo || $(document.body)), mfp._lastFocusedEl = document.activeElement, 
            setTimeout(function() {
                mfp.content ? (mfp._addClassToMFP("mfp-ready"), mfp._setFocus()) : mfp.bgOverlay.addClass("mfp-ready"), 
                _document.on("focusin.mfp", mfp._onFocusIn);
            }, 16), mfp.isOpen = !0, mfp.updateSize(windowHeight), _mfpTrigger("Open"), data;
        },
        close: function() {
            mfp.isOpen && (_mfpTrigger("BeforeClose"), mfp.isOpen = !1, mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition ? (mfp._addClassToMFP("mfp-removing"), 
            setTimeout(function() {
                mfp._close();
            }, mfp.st.removalDelay)) : mfp._close());
        },
        _close: function() {
            _mfpTrigger("Close");
            var classesToRemove = "mfp-removing mfp-ready ";
            if (mfp.bgOverlay.detach(), mfp.wrap.detach(), mfp.container.empty(), mfp.st.mainClass && (classesToRemove += mfp.st.mainClass + " "), 
            mfp._removeClassFromMFP(classesToRemove), mfp.fixedContentPos) {
                var windowStyles = {
                    marginRight: ""
                };
                mfp.isIE7 ? $("body, html").css("overflow", "") : windowStyles.overflow = "", $("html").css(windowStyles);
            }
            _document.off("keyup.mfp focusin.mfp"), mfp.ev.off(".mfp"), mfp.wrap.attr("class", "mfp-wrap").removeAttr("style"), 
            mfp.bgOverlay.attr("class", "mfp-bg"), mfp.container.attr("class", "mfp-container"), 
            !mfp.st.showCloseBtn || mfp.st.closeBtnInside && !0 !== mfp.currTemplate[mfp.currItem.type] || mfp.currTemplate.closeBtn && mfp.currTemplate.closeBtn.detach(), 
            mfp.st.autoFocusLast && mfp._lastFocusedEl && $(mfp._lastFocusedEl).focus(), mfp.currItem = null, 
            mfp.content = null, mfp.currTemplate = null, mfp.prevHeight = 0, _mfpTrigger("AfterClose");
        },
        updateSize: function(winHeight) {
            if (mfp.isIOS) {
                var zoomLevel = document.documentElement.clientWidth / window.innerWidth, height = window.innerHeight * zoomLevel;
                mfp.wrap.css("height", height), mfp.wH = height;
            } else mfp.wH = winHeight || _window.height();
            mfp.fixedContentPos || mfp.wrap.css("height", mfp.wH), _mfpTrigger("Resize");
        },
        updateItemHTML: function() {
            var item = mfp.items[mfp.index];
            mfp.contentContainer.detach(), mfp.content && mfp.content.detach(), item.parsed || (item = mfp.parseEl(mfp.index));
            var type = item.type;
            if (_mfpTrigger("BeforeChange", [ mfp.currItem ? mfp.currItem.type : "", type ]), 
            mfp.currItem = item, !mfp.currTemplate[type]) {
                var markup = !!mfp.st[type] && mfp.st[type].markup;
                _mfpTrigger("FirstMarkupParse", markup), mfp.currTemplate[type] = !markup || $(markup);
            }
            _prevContentType && _prevContentType !== item.type && mfp.container.removeClass("mfp-" + _prevContentType + "-holder");
            var newContent = mfp["get" + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
            mfp.appendContent(newContent, type), item.preloaded = !0, _mfpTrigger("Change", item), 
            _prevContentType = item.type, mfp.container.prepend(mfp.contentContainer), _mfpTrigger("AfterChange");
        },
        appendContent: function(newContent, type) {
            mfp.content = newContent, newContent ? mfp.st.showCloseBtn && mfp.st.closeBtnInside && !0 === mfp.currTemplate[type] ? mfp.content.find(".mfp-close").length || mfp.content.append(_getCloseBtn()) : mfp.content = newContent : mfp.content = "", 
            _mfpTrigger("BeforeAppend"), mfp.container.addClass("mfp-" + type + "-holder"), 
            mfp.contentContainer.append(mfp.content);
        },
        parseEl: function(index) {
            var type, item = mfp.items[index];
            if (item.tagName ? item = {
                el: $(item)
            } : (type = item.type, item = {
                data: item,
                src: item.src
            }), item.el) {
                for (var types = mfp.types, i = 0; i < types.length; i++) if (item.el.hasClass("mfp-" + types[i])) {
                    type = types[i];
                    break;
                }
                item.src = item.el.attr("data-mfp-src"), item.src || (item.src = item.el.attr("href"));
            }
            return item.type = type || mfp.st.type || "inline", item.index = index, item.parsed = !0, 
            mfp.items[index] = item, _mfpTrigger("ElementParse", item), mfp.items[index];
        },
        addGroup: function(el, options) {
            var eHandler = function(e) {
                e.mfpEl = this, mfp._openClick(e, el, options);
            };
            options || (options = {});
            var eName = "click.magnificPopup";
            options.mainEl = el, options.items ? (options.isObj = !0, el.off(eName).on(eName, eHandler)) : (options.isObj = !1, 
            options.delegate ? el.off(eName).on(eName, options.delegate, eHandler) : (options.items = el, 
            el.off(eName).on(eName, eHandler)));
        },
        _openClick: function(e, el, options) {
            if ((void 0 !== options.midClick ? options.midClick : $.magnificPopup.defaults.midClick) || !(2 === e.which || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)) {
                var disableOn = void 0 !== options.disableOn ? options.disableOn : $.magnificPopup.defaults.disableOn;
                if (disableOn) if ($.isFunction(disableOn)) {
                    if (!disableOn.call(mfp)) return !0;
                } else if (_window.width() < disableOn) return !0;
                e.type && (e.preventDefault(), mfp.isOpen && e.stopPropagation()), options.el = $(e.mfpEl), 
                options.delegate && (options.items = el.find(options.delegate)), mfp.open(options);
            }
        },
        updateStatus: function(status, text) {
            if (mfp.preloader) {
                _prevStatus !== status && mfp.container.removeClass("mfp-s-" + _prevStatus), text || "loading" !== status || (text = mfp.st.tLoading);
                var data = {
                    status: status,
                    text: text
                };
                _mfpTrigger("UpdateStatus", data), status = data.status, text = data.text, mfp.preloader.html(text), 
                mfp.preloader.find("a").on("click", function(e) {
                    e.stopImmediatePropagation();
                }), mfp.container.addClass("mfp-s-" + status), _prevStatus = status;
            }
        },
        _checkIfClose: function(target) {
            if (!$(target).hasClass("mfp-prevent-close")) {
                var closeOnContent = mfp.st.closeOnContentClick, closeOnBg = mfp.st.closeOnBgClick;
                if (closeOnContent && closeOnBg) return !0;
                if (!mfp.content || $(target).hasClass("mfp-close") || mfp.preloader && target === mfp.preloader[0]) return !0;
                if (target === mfp.content[0] || $.contains(mfp.content[0], target)) {
                    if (closeOnContent) return !0;
                } else if (closeOnBg && $.contains(document, target)) return !0;
                return !1;
            }
        },
        _addClassToMFP: function(cName) {
            mfp.bgOverlay.addClass(cName), mfp.wrap.addClass(cName);
        },
        _removeClassFromMFP: function(cName) {
            this.bgOverlay.removeClass(cName), mfp.wrap.removeClass(cName);
        },
        _hasScrollBar: function(winHeight) {
            return (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height());
        },
        _setFocus: function() {
            (mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
        },
        _onFocusIn: function(e) {
            if (e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target)) return mfp._setFocus(), 
            !1;
        },
        _parseMarkup: function(template, values, item) {
            var arr;
            item.data && (values = $.extend(item.data, values)), _mfpTrigger("MarkupParse", [ template, values, item ]), 
            $.each(values, function(key, value) {
                if (void 0 === value || !1 === value) return !0;
                if (arr = key.split("_"), arr.length > 1) {
                    var el = template.find(".mfp-" + arr[0]);
                    if (el.length > 0) {
                        var attr = arr[1];
                        "replaceWith" === attr ? el[0] !== value[0] && el.replaceWith(value) : "img" === attr ? el.is("img") ? el.attr("src", value) : el.replaceWith($("<img>").attr("src", value).attr("class", el.attr("class"))) : el.attr(arr[1], value);
                    }
                } else template.find(".mfp-" + key).html(value);
            });
        },
        _getScrollbarSize: function() {
            if (void 0 === mfp.scrollbarSize) {
                var scrollDiv = document.createElement("div");
                scrollDiv.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", 
                document.body.appendChild(scrollDiv), mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth, 
                document.body.removeChild(scrollDiv);
            }
            return mfp.scrollbarSize;
        }
    }, $.magnificPopup = {
        instance: null,
        proto: MagnificPopup.prototype,
        modules: [],
        open: function(options, index) {
            return _checkInstance(), options = options ? $.extend(!0, {}, options) : {}, options.isObj = !0, 
            options.index = index || 0, this.instance.open(options);
        },
        close: function() {
            return $.magnificPopup.instance && $.magnificPopup.instance.close();
        },
        registerModule: function(name, module) {
            module.options && ($.magnificPopup.defaults[name] = module.options), $.extend(this.proto, module.proto), 
            this.modules.push(name);
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading...",
            autoFocusLast: !0
        }
    }, $.fn.magnificPopup = function(options) {
        _checkInstance();
        var jqEl = $(this);
        if ("string" == typeof options) if ("open" === options) {
            var items, itemOpts = _isJQ ? jqEl.data("magnificPopup") : jqEl[0].magnificPopup, index = parseInt(arguments[1], 10) || 0;
            itemOpts.items ? items = itemOpts.items[index] : (items = jqEl, itemOpts.delegate && (items = items.find(itemOpts.delegate)), 
            items = items.eq(index)), mfp._openClick({
                mfpEl: items
            }, jqEl, itemOpts);
        } else mfp.isOpen && mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1)); else options = $.extend(!0, {}, options), 
        _isJQ ? jqEl.data("magnificPopup", options) : jqEl[0].magnificPopup = options, mfp.addGroup(jqEl, options);
        return jqEl;
    };
    var _hiddenClass, _inlinePlaceholder, _lastInlineElement, _putInlineElementsBack = function() {
        _lastInlineElement && (_inlinePlaceholder.after(_lastInlineElement.addClass(_hiddenClass)).detach(), 
        _lastInlineElement = null);
    };
    $.magnificPopup.registerModule("inline", {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function() {
                mfp.types.push("inline"), _mfpOn("Close.inline", function() {
                    _putInlineElementsBack();
                });
            },
            getInline: function(item, template) {
                if (_putInlineElementsBack(), item.src) {
                    var inlineSt = mfp.st.inline, el = $(item.src);
                    if (el.length) {
                        var parent = el[0].parentNode;
                        parent && parent.tagName && (_inlinePlaceholder || (_hiddenClass = inlineSt.hiddenClass, 
                        _inlinePlaceholder = _getEl(_hiddenClass), _hiddenClass = "mfp-" + _hiddenClass), 
                        _lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass)), 
                        mfp.updateStatus("ready");
                    } else mfp.updateStatus("error", inlineSt.tNotFound), el = $("<div>");
                    return item.inlineElement = el, el;
                }
                return mfp.updateStatus("ready"), mfp._parseMarkup(template, {}, item), template;
            }
        }
    });
    var _ajaxCur, _removeAjaxCursor = function() {
        _ajaxCur && $(document.body).removeClass(_ajaxCur);
    }, _destroyAjaxRequest = function() {
        _removeAjaxCursor(), mfp.req && mfp.req.abort();
    };
    $.magnificPopup.registerModule("ajax", {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function() {
                mfp.types.push("ajax"), _ajaxCur = mfp.st.ajax.cursor, _mfpOn("Close.ajax", _destroyAjaxRequest), 
                _mfpOn("BeforeChange.ajax", _destroyAjaxRequest);
            },
            getAjax: function(item) {
                _ajaxCur && $(document.body).addClass(_ajaxCur), mfp.updateStatus("loading");
                var opts = $.extend({
                    url: item.src,
                    success: function(data, textStatus, jqXHR) {
                        var temp = {
                            data: data,
                            xhr: jqXHR
                        };
                        _mfpTrigger("ParseAjax", temp), mfp.appendContent($(temp.data), "ajax"), item.finished = !0, 
                        _removeAjaxCursor(), mfp._setFocus(), setTimeout(function() {
                            mfp.wrap.addClass("mfp-ready");
                        }, 16), mfp.updateStatus("ready"), _mfpTrigger("AjaxContentAdded");
                    },
                    error: function() {
                        _removeAjaxCursor(), item.finished = item.loadError = !0, mfp.updateStatus("error", mfp.st.ajax.tError.replace("%url%", item.src));
                    }
                }, mfp.st.ajax.settings);
                return mfp.req = $.ajax(opts), "";
            }
        }
    });
    var _imgInterval, _getTitle = function(item) {
        if (item.data && void 0 !== item.data.title) return item.data.title;
        var src = mfp.st.image.titleSrc;
        if (src) {
            if ($.isFunction(src)) return src.call(mfp, item);
            if (item.el) return item.el.attr(src) || "";
        }
        return "";
    };
    $.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function() {
                var imgSt = mfp.st.image, ns = ".image";
                mfp.types.push("image"), _mfpOn("Open" + ns, function() {
                    "image" === mfp.currItem.type && imgSt.cursor && $(document.body).addClass(imgSt.cursor);
                }), _mfpOn("Close" + ns, function() {
                    imgSt.cursor && $(document.body).removeClass(imgSt.cursor), _window.off("resize.mfp");
                }), _mfpOn("Resize" + ns, mfp.resizeImage), mfp.isLowIE && _mfpOn("AfterChange", mfp.resizeImage);
            },
            resizeImage: function() {
                var item = mfp.currItem;
                if (item && item.img && mfp.st.image.verticalFit) {
                    var decr = 0;
                    mfp.isLowIE && (decr = parseInt(item.img.css("padding-top"), 10) + parseInt(item.img.css("padding-bottom"), 10)), 
                    item.img.css("max-height", mfp.wH - decr);
                }
            },
            _onImageHasSize: function(item) {
                item.img && (item.hasSize = !0, _imgInterval && clearInterval(_imgInterval), item.isCheckingImgSize = !1, 
                _mfpTrigger("ImageHasSize", item), item.imgHidden && (mfp.content && mfp.content.removeClass("mfp-loading"), 
                item.imgHidden = !1));
            },
            findImageSize: function(item) {
                var counter = 0, img = item.img[0], mfpSetInterval = function(delay) {
                    _imgInterval && clearInterval(_imgInterval), _imgInterval = setInterval(function() {
                        if (img.naturalWidth > 0) return void mfp._onImageHasSize(item);
                        counter > 200 && clearInterval(_imgInterval), counter++, 3 === counter ? mfpSetInterval(10) : 40 === counter ? mfpSetInterval(50) : 100 === counter && mfpSetInterval(500);
                    }, delay);
                };
                mfpSetInterval(1);
            },
            getImage: function(item, template) {
                var guard = 0, onLoadComplete = function() {
                    item && (item.img[0].complete ? (item.img.off(".mfploader"), item === mfp.currItem && (mfp._onImageHasSize(item), 
                    mfp.updateStatus("ready")), item.hasSize = !0, item.loaded = !0, _mfpTrigger("ImageLoadComplete")) : (guard++, 
                    guard < 200 ? setTimeout(onLoadComplete, 100) : onLoadError()));
                }, onLoadError = function() {
                    item && (item.img.off(".mfploader"), item === mfp.currItem && (mfp._onImageHasSize(item), 
                    mfp.updateStatus("error", imgSt.tError.replace("%url%", item.src))), item.hasSize = !0, 
                    item.loaded = !0, item.loadError = !0);
                }, imgSt = mfp.st.image, el = template.find(".mfp-img");
                if (el.length) {
                    var img = document.createElement("img");
                    img.className = "mfp-img", item.el && item.el.find("img").length && (img.alt = item.el.find("img").attr("alt")), 
                    item.img = $(img).on("load.mfploader", onLoadComplete).on("error.mfploader", onLoadError), 
                    img.src = item.src, el.is("img") && (item.img = item.img.clone()), img = item.img[0], 
                    img.naturalWidth > 0 ? item.hasSize = !0 : img.width || (item.hasSize = !1);
                }
                return mfp._parseMarkup(template, {
                    title: _getTitle(item),
                    img_replaceWith: item.img
                }, item), mfp.resizeImage(), item.hasSize ? (_imgInterval && clearInterval(_imgInterval), 
                item.loadError ? (template.addClass("mfp-loading"), mfp.updateStatus("error", imgSt.tError.replace("%url%", item.src))) : (template.removeClass("mfp-loading"), 
                mfp.updateStatus("ready")), template) : (mfp.updateStatus("loading"), item.loading = !0, 
                item.hasSize || (item.imgHidden = !0, template.addClass("mfp-loading"), mfp.findImageSize(item)), 
                template);
            }
        }
    });
    var hasMozTransform, getHasMozTransform = function() {
        return void 0 === hasMozTransform && (hasMozTransform = void 0 !== document.createElement("p").style.MozTransform), 
        hasMozTransform;
    };
    $.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function(element) {
                return element.is("img") ? element : element.find("img");
            }
        },
        proto: {
            initZoom: function() {
                var image, zoomSt = mfp.st.zoom, ns = ".zoom";
                if (zoomSt.enabled && mfp.supportsTransition) {
                    var openTimeout, animatedImg, duration = zoomSt.duration, getElToAnimate = function(image) {
                        var newImg = image.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"), transition = "all " + zoomSt.duration / 1e3 + "s " + zoomSt.easing, cssObj = {
                            position: "fixed",
                            zIndex: 9999,
                            left: 0,
                            top: 0,
                            "-webkit-backface-visibility": "hidden"
                        }, t = "transition";
                        return cssObj["-webkit-" + t] = cssObj["-moz-" + t] = cssObj["-o-" + t] = cssObj[t] = transition, 
                        newImg.css(cssObj), newImg;
                    }, showMainContent = function() {
                        mfp.content.css("visibility", "visible");
                    };
                    _mfpOn("BuildControls" + ns, function() {
                        if (mfp._allowZoom()) {
                            if (clearTimeout(openTimeout), mfp.content.css("visibility", "hidden"), !(image = mfp._getItemToZoom())) return void showMainContent();
                            animatedImg = getElToAnimate(image), animatedImg.css(mfp._getOffset()), mfp.wrap.append(animatedImg), 
                            openTimeout = setTimeout(function() {
                                animatedImg.css(mfp._getOffset(!0)), openTimeout = setTimeout(function() {
                                    showMainContent(), setTimeout(function() {
                                        animatedImg.remove(), image = animatedImg = null, _mfpTrigger("ZoomAnimationEnded");
                                    }, 16);
                                }, duration);
                            }, 16);
                        }
                    }), _mfpOn("BeforeClose" + ns, function() {
                        if (mfp._allowZoom()) {
                            if (clearTimeout(openTimeout), mfp.st.removalDelay = duration, !image) {
                                if (!(image = mfp._getItemToZoom())) return;
                                animatedImg = getElToAnimate(image);
                            }
                            animatedImg.css(mfp._getOffset(!0)), mfp.wrap.append(animatedImg), mfp.content.css("visibility", "hidden"), 
                            setTimeout(function() {
                                animatedImg.css(mfp._getOffset());
                            }, 16);
                        }
                    }), _mfpOn("Close" + ns, function() {
                        mfp._allowZoom() && (showMainContent(), animatedImg && animatedImg.remove(), image = null);
                    });
                }
            },
            _allowZoom: function() {
                return "image" === mfp.currItem.type;
            },
            _getItemToZoom: function() {
                return !!mfp.currItem.hasSize && mfp.currItem.img;
            },
            _getOffset: function(isLarge) {
                var el;
                el = isLarge ? mfp.currItem.img : mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
                var offset = el.offset(), paddingTop = parseInt(el.css("padding-top"), 10), paddingBottom = parseInt(el.css("padding-bottom"), 10);
                offset.top -= $(window).scrollTop() - paddingTop;
                var obj = {
                    width: el.width(),
                    height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
                };
                return getHasMozTransform() ? obj["-moz-transform"] = obj.transform = "translate(" + offset.left + "px," + offset.top + "px)" : (obj.left = offset.left, 
                obj.top = offset.top), obj;
            }
        }
    });
    var _fixIframeBugs = function(isShowing) {
        if (mfp.currTemplate.iframe) {
            var el = mfp.currTemplate.iframe.find("iframe");
            el.length && (isShowing || (el[0].src = "//about:blank"), mfp.isIE8 && el.css("display", isShowing ? "block" : "none"));
        }
    };
    $.magnificPopup.registerModule("iframe", {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {
                    index: "youtube.com",
                    id: "v=",
                    src: "//www.youtube.com/embed/%id%?autoplay=1"
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed"
                }
            }
        },
        proto: {
            initIframe: function() {
                mfp.types.push("iframe"), _mfpOn("BeforeChange", function(e, prevType, newType) {
                    prevType !== newType && ("iframe" === prevType ? _fixIframeBugs() : "iframe" === newType && _fixIframeBugs(!0));
                }), _mfpOn("Close.iframe", function() {
                    _fixIframeBugs();
                });
            },
            getIframe: function(item, template) {
                var embedSrc = item.src, iframeSt = mfp.st.iframe;
                $.each(iframeSt.patterns, function() {
                    if (embedSrc.indexOf(this.index) > -1) return this.id && (embedSrc = "string" == typeof this.id ? embedSrc.substr(embedSrc.lastIndexOf(this.id) + this.id.length, embedSrc.length) : this.id.call(this, embedSrc)), 
                    embedSrc = this.src.replace("%id%", embedSrc), !1;
                });
                var dataObj = {};
                return iframeSt.srcAction && (dataObj[iframeSt.srcAction] = embedSrc), mfp._parseMarkup(template, dataObj, item), 
                mfp.updateStatus("ready"), template;
            }
        }
    });
    var _getLoopedId = function(index) {
        var numSlides = mfp.items.length;
        return index > numSlides - 1 ? index - numSlides : index < 0 ? numSlides + index : index;
    }, _replaceCurrTotal = function(text, curr, total) {
        return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
    };
    $.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [ 0, 2 ],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        },
        proto: {
            initGallery: function() {
                var gSt = mfp.st.gallery, ns = ".mfp-gallery";
                if (mfp.direction = !0, !gSt || !gSt.enabled) return !1;
                _wrapClasses += " mfp-gallery", _mfpOn("Open" + ns, function() {
                    gSt.navigateByImgClick && mfp.wrap.on("click" + ns, ".mfp-img", function() {
                        if (mfp.items.length > 1) return mfp.next(), !1;
                    }), _document.on("keydown" + ns, function(e) {
                        37 === e.keyCode ? mfp.prev() : 39 === e.keyCode && mfp.next();
                    });
                }), _mfpOn("UpdateStatus" + ns, function(e, data) {
                    data.text && (data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length));
                }), _mfpOn("MarkupParse" + ns, function(e, element, values, item) {
                    var l = mfp.items.length;
                    values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : "";
                }), _mfpOn("BuildControls" + ns, function() {
                    if (mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
                        var markup = gSt.arrowMarkup, arrowLeft = mfp.arrowLeft = $(markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, "left")).addClass("mfp-prevent-close"), arrowRight = mfp.arrowRight = $(markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, "right")).addClass("mfp-prevent-close");
                        arrowLeft.click(function() {
                            mfp.prev();
                        }), arrowRight.click(function() {
                            mfp.next();
                        }), mfp.container.append(arrowLeft.add(arrowRight));
                    }
                }), _mfpOn("Change" + ns, function() {
                    mfp._preloadTimeout && clearTimeout(mfp._preloadTimeout), mfp._preloadTimeout = setTimeout(function() {
                        mfp.preloadNearbyImages(), mfp._preloadTimeout = null;
                    }, 16);
                }), _mfpOn("Close" + ns, function() {
                    _document.off(ns), mfp.wrap.off("click" + ns), mfp.arrowRight = mfp.arrowLeft = null;
                });
            },
            next: function() {
                mfp.direction = !0, mfp.index = _getLoopedId(mfp.index + 1), mfp.updateItemHTML();
            },
            prev: function() {
                mfp.direction = !1, mfp.index = _getLoopedId(mfp.index - 1), mfp.updateItemHTML();
            },
            goTo: function(newIndex) {
                mfp.direction = newIndex >= mfp.index, mfp.index = newIndex, mfp.updateItemHTML();
            },
            preloadNearbyImages: function() {
                var i, p = mfp.st.gallery.preload, preloadBefore = Math.min(p[0], mfp.items.length), preloadAfter = Math.min(p[1], mfp.items.length);
                for (i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) mfp._preloadItem(mfp.index + i);
                for (i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) mfp._preloadItem(mfp.index - i);
            },
            _preloadItem: function(index) {
                if (index = _getLoopedId(index), !mfp.items[index].preloaded) {
                    var item = mfp.items[index];
                    item.parsed || (item = mfp.parseEl(index)), _mfpTrigger("LazyLoad", item), "image" === item.type && (item.img = $('<img class="mfp-img" />').on("load.mfploader", function() {
                        item.hasSize = !0;
                    }).on("error.mfploader", function() {
                        item.hasSize = !0, item.loadError = !0, _mfpTrigger("LazyLoadError", item);
                    }).attr("src", item.src)), item.preloaded = !0;
                }
            }
        }
    });
    $.magnificPopup.registerModule("retina", {
        options: {
            replaceSrc: function(item) {
                return item.src.replace(/\.\w+$/, function(m) {
                    return "@2x" + m;
                });
            },
            ratio: 1
        },
        proto: {
            initRetina: function() {
                if (window.devicePixelRatio > 1) {
                    var st = mfp.st.retina, ratio = st.ratio;
                    ratio = isNaN(ratio) ? ratio() : ratio, ratio > 1 && (_mfpOn("ImageHasSize.retina", function(e, item) {
                        item.img.css({
                            "max-width": item.img[0].naturalWidth / ratio,
                            width: "100%"
                        });
                    }), _mfpOn("ElementParse.retina", function(e, item) {
                        item.src = st.replaceSrc(item, ratio);
                    }));
                }
            }
        }
    }), _checkInstance();
}), function(a) {
    "use strict";
    "function" == typeof define && define.amd ? define([ "jquery" ], a) : "undefined" != typeof exports ? module.exports = a(require("jquery")) : a(jQuery);
}(function(a) {
    "use strict";
    var b = window.Slick || {};
    b = function() {
        function c(c, d) {
            var f, e = this;
            e.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: a(c),
                appendDots: a(c),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(b, c) {
                    return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c + 1);
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            }, e.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            }, a.extend(e, e.initials), e.activeBreakpoint = null, e.animType = null, e.animProp = null, 
            e.breakpoints = [], e.breakpointSettings = [], e.cssTransitions = !1, e.focussed = !1, 
            e.interrupted = !1, e.hidden = "hidden", e.paused = !0, e.positionProp = null, e.respondTo = null, 
            e.rowCount = 1, e.shouldClick = !0, e.$slider = a(c), e.$slidesCache = null, e.transformType = null, 
            e.transitionType = null, e.visibilityChange = "visibilitychange", e.windowWidth = 0, 
            e.windowTimer = null, f = a(c).data("slick") || {}, e.options = a.extend({}, e.defaults, d, f), 
            e.currentSlide = e.options.initialSlide, e.originalSettings = e.options, void 0 !== document.mozHidden ? (e.hidden = "mozHidden", 
            e.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (e.hidden = "webkitHidden", 
            e.visibilityChange = "webkitvisibilitychange"), e.autoPlay = a.proxy(e.autoPlay, e), 
            e.autoPlayClear = a.proxy(e.autoPlayClear, e), e.autoPlayIterator = a.proxy(e.autoPlayIterator, e), 
            e.changeSlide = a.proxy(e.changeSlide, e), e.clickHandler = a.proxy(e.clickHandler, e), 
            e.selectHandler = a.proxy(e.selectHandler, e), e.setPosition = a.proxy(e.setPosition, e), 
            e.swipeHandler = a.proxy(e.swipeHandler, e), e.dragHandler = a.proxy(e.dragHandler, e), 
            e.keyHandler = a.proxy(e.keyHandler, e), e.instanceUid = b++, e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, 
            e.registerBreakpoints(), e.init(!0);
        }
        var b = 0;
        return c;
    }(), b.prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        });
    }, b.prototype.addSlide = b.prototype.slickAdd = function(b, c, d) {
        var e = this;
        if ("boolean" == typeof c) d = c, c = null; else if (0 > c || c >= e.slideCount) return !1;
        e.unload(), "number" == typeof c ? 0 === c && 0 === e.$slides.length ? a(b).appendTo(e.$slideTrack) : d ? a(b).insertBefore(e.$slides.eq(c)) : a(b).insertAfter(e.$slides.eq(c)) : !0 === d ? a(b).prependTo(e.$slideTrack) : a(b).appendTo(e.$slideTrack), 
        e.$slides = e.$slideTrack.children(this.options.slide), e.$slideTrack.children(this.options.slide).detach(), 
        e.$slideTrack.append(e.$slides), e.$slides.each(function(b, c) {
            a(c).attr("data-slick-index", b);
        }), e.$slidesCache = e.$slides, e.reinit();
    }, b.prototype.animateHeight = function() {
        var a = this;
        if (1 === a.options.slidesToShow && !0 === a.options.adaptiveHeight && !1 === a.options.vertical) {
            var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
            a.$list.animate({
                height: b
            }, a.options.speed);
        }
    }, b.prototype.animateSlide = function(b, c) {
        var d = {}, e = this;
        e.animateHeight(), !0 === e.options.rtl && !1 === e.options.vertical && (b = -b), 
        !1 === e.transformsEnabled ? !1 === e.options.vertical ? e.$slideTrack.animate({
            left: b
        }, e.options.speed, e.options.easing, c) : e.$slideTrack.animate({
            top: b
        }, e.options.speed, e.options.easing, c) : !1 === e.cssTransitions ? (!0 === e.options.rtl && (e.currentLeft = -e.currentLeft), 
        a({
            animStart: e.currentLeft
        }).animate({
            animStart: b
        }, {
            duration: e.options.speed,
            easing: e.options.easing,
            step: function(a) {
                a = Math.ceil(a), !1 === e.options.vertical ? (d[e.animType] = "translate(" + a + "px, 0px)", 
                e.$slideTrack.css(d)) : (d[e.animType] = "translate(0px," + a + "px)", e.$slideTrack.css(d));
            },
            complete: function() {
                c && c.call();
            }
        })) : (e.applyTransition(), b = Math.ceil(b), !1 === e.options.vertical ? d[e.animType] = "translate3d(" + b + "px, 0px, 0px)" : d[e.animType] = "translate3d(0px," + b + "px, 0px)", 
        e.$slideTrack.css(d), c && setTimeout(function() {
            e.disableTransition(), c.call();
        }, e.options.speed));
    }, b.prototype.getNavTarget = function() {
        var b = this, c = b.options.asNavFor;
        return c && null !== c && (c = a(c).not(b.$slider)), c;
    }, b.prototype.asNavFor = function(b) {
        var c = this, d = c.getNavTarget();
        null !== d && "object" == typeof d && d.each(function() {
            var c = a(this).slick("getSlick");
            c.unslicked || c.slideHandler(b, !0);
        });
    }, b.prototype.applyTransition = function(a) {
        var b = this, c = {};
        !1 === b.options.fade ? c[b.transitionType] = b.transformType + " " + b.options.speed + "ms " + b.options.cssEase : c[b.transitionType] = "opacity " + b.options.speed + "ms " + b.options.cssEase, 
        !1 === b.options.fade ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c);
    }, b.prototype.autoPlay = function() {
        var a = this;
        a.autoPlayClear(), a.slideCount > a.options.slidesToShow && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed));
    }, b.prototype.autoPlayClear = function() {
        var a = this;
        a.autoPlayTimer && clearInterval(a.autoPlayTimer);
    }, b.prototype.autoPlayIterator = function() {
        var a = this, b = a.currentSlide + a.options.slidesToScroll;
        a.paused || a.interrupted || a.focussed || (!1 === a.options.infinite && (1 === a.direction && a.currentSlide + 1 === a.slideCount - 1 ? a.direction = 0 : 0 === a.direction && (b = a.currentSlide - a.options.slidesToScroll, 
        a.currentSlide - 1 == 0 && (a.direction = 1))), a.slideHandler(b));
    }, b.prototype.buildArrows = function() {
        var b = this;
        !0 === b.options.arrows && (b.$prevArrow = a(b.options.prevArrow).addClass("slick-arrow"), 
        b.$nextArrow = a(b.options.nextArrow).addClass("slick-arrow"), b.slideCount > b.options.slidesToShow ? (b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), 
        b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.prependTo(b.options.appendArrows), 
        b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows), 
        !0 !== b.options.infinite && b.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }));
    }, b.prototype.buildDots = function() {
        var c, d, b = this;
        if (!0 === b.options.dots && b.slideCount > b.options.slidesToShow) {
            for (b.$slider.addClass("slick-dotted"), d = a("<ul />").addClass(b.options.dotsClass), 
            c = 0; c <= b.getDotCount(); c += 1) d.append(a("<li />").append(b.options.customPaging.call(this, b, c)));
            b.$dots = d.appendTo(b.options.appendDots), b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false");
        }
    }, b.prototype.buildOut = function() {
        var b = this;
        b.$slides = b.$slider.children(b.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), 
        b.slideCount = b.$slides.length, b.$slides.each(function(b, c) {
            a(c).attr("data-slick-index", b).data("originalStyling", a(c).attr("style") || "");
        }), b.$slider.addClass("slick-slider"), b.$slideTrack = 0 === b.slideCount ? a('<div class="slick-track"/>').appendTo(b.$slider) : b.$slides.wrapAll('<div class="slick-track"/>').parent(), 
        b.$list = b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), 
        b.$slideTrack.css("opacity", 0), (!0 === b.options.centerMode || !0 === b.options.swipeToSlide) && (b.options.slidesToScroll = 1), 
        a("img[data-lazy]", b.$slider).not("[src]").addClass("slick-loading"), b.setupInfinite(), 
        b.buildArrows(), b.buildDots(), b.updateDots(), b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0), 
        !0 === b.options.draggable && b.$list.addClass("draggable");
    }, b.prototype.buildRows = function() {
        var b, c, d, e, f, g, h, a = this;
        if (e = document.createDocumentFragment(), g = a.$slider.children(), a.options.rows > 1) {
            for (h = a.options.slidesPerRow * a.options.rows, f = Math.ceil(g.length / h), b = 0; f > b; b++) {
                var i = document.createElement("div");
                for (c = 0; c < a.options.rows; c++) {
                    var j = document.createElement("div");
                    for (d = 0; d < a.options.slidesPerRow; d++) {
                        var k = b * h + (c * a.options.slidesPerRow + d);
                        g.get(k) && j.appendChild(g.get(k));
                    }
                    i.appendChild(j);
                }
                e.appendChild(i);
            }
            a.$slider.empty().append(e), a.$slider.children().children().children().css({
                width: 100 / a.options.slidesPerRow + "%",
                display: "inline-block"
            });
        }
    }, b.prototype.checkResponsive = function(b, c) {
        var e, f, g, d = this, h = !1, i = d.$slider.width(), j = window.innerWidth || a(window).width();
        if ("window" === d.respondTo ? g = j : "slider" === d.respondTo ? g = i : "min" === d.respondTo && (g = Math.min(j, i)), 
        d.options.responsive && d.options.responsive.length && null !== d.options.responsive) {
            f = null;
            for (e in d.breakpoints) d.breakpoints.hasOwnProperty(e) && (!1 === d.originalSettings.mobileFirst ? g < d.breakpoints[e] && (f = d.breakpoints[e]) : g > d.breakpoints[e] && (f = d.breakpoints[e]));
            null !== f ? null !== d.activeBreakpoint ? (f !== d.activeBreakpoint || c) && (d.activeBreakpoint = f, 
            "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), 
            !0 === b && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : (d.activeBreakpoint = f, 
            "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), 
            !0 === b && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : null !== d.activeBreakpoint && (d.activeBreakpoint = null, 
            d.options = d.originalSettings, !0 === b && (d.currentSlide = d.options.initialSlide), 
            d.refresh(b), h = f), b || !1 === h || d.$slider.trigger("breakpoint", [ d, h ]);
        }
    }, b.prototype.changeSlide = function(b, c) {
        var f, g, h, d = this, e = a(b.currentTarget);
        switch (e.is("a") && b.preventDefault(), e.is("li") || (e = e.closest("li")), h = d.slideCount % d.options.slidesToScroll != 0, 
        f = h ? 0 : (d.slideCount - d.currentSlide) % d.options.slidesToScroll, b.data.message) {
          case "previous":
            g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c);
            break;

          case "next":
            g = 0 === f ? d.options.slidesToScroll : f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c);
            break;

          case "index":
            var i = 0 === b.data.index ? 0 : b.data.index || e.index() * d.options.slidesToScroll;
            d.slideHandler(d.checkNavigable(i), !1, c), e.children().trigger("focus");
            break;

          default:
            return;
        }
    }, b.prototype.checkNavigable = function(a) {
        var c, d;
        if (c = this.getNavigableIndexes(), d = 0, a > c[c.length - 1]) a = c[c.length - 1]; else for (var e in c) {
            if (a < c[e]) {
                a = d;
                break;
            }
            d = c[e];
        }
        return a;
    }, b.prototype.cleanUpEvents = function() {
        var b = this;
        b.options.dots && null !== b.$dots && a("li", b.$dots).off("click.slick", b.changeSlide).off("mouseenter.slick", a.proxy(b.interrupt, b, !0)).off("mouseleave.slick", a.proxy(b.interrupt, b, !1)), 
        b.$slider.off("focus.slick blur.slick"), !0 === b.options.arrows && b.slideCount > b.options.slidesToShow && (b.$prevArrow && b.$prevArrow.off("click.slick", b.changeSlide), 
        b.$nextArrow && b.$nextArrow.off("click.slick", b.changeSlide)), b.$list.off("touchstart.slick mousedown.slick", b.swipeHandler), 
        b.$list.off("touchmove.slick mousemove.slick", b.swipeHandler), b.$list.off("touchend.slick mouseup.slick", b.swipeHandler), 
        b.$list.off("touchcancel.slick mouseleave.slick", b.swipeHandler), b.$list.off("click.slick", b.clickHandler), 
        a(document).off(b.visibilityChange, b.visibility), b.cleanUpSlideEvents(), !0 === b.options.accessibility && b.$list.off("keydown.slick", b.keyHandler), 
        !0 === b.options.focusOnSelect && a(b.$slideTrack).children().off("click.slick", b.selectHandler), 
        a(window).off("orientationchange.slick.slick-" + b.instanceUid, b.orientationChange), 
        a(window).off("resize.slick.slick-" + b.instanceUid, b.resize), a("[draggable!=true]", b.$slideTrack).off("dragstart", b.preventDefault), 
        a(window).off("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).off("ready.slick.slick-" + b.instanceUid, b.setPosition);
    }, b.prototype.cleanUpSlideEvents = function() {
        var b = this;
        b.$list.off("mouseenter.slick", a.proxy(b.interrupt, b, !0)), b.$list.off("mouseleave.slick", a.proxy(b.interrupt, b, !1));
    }, b.prototype.cleanUpRows = function() {
        var b, a = this;
        a.options.rows > 1 && (b = a.$slides.children().children(), b.removeAttr("style"), 
        a.$slider.empty().append(b));
    }, b.prototype.clickHandler = function(a) {
        !1 === this.shouldClick && (a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault());
    }, b.prototype.destroy = function(b) {
        var c = this;
        c.autoPlayClear(), c.touchObject = {}, c.cleanUpEvents(), a(".slick-cloned", c.$slider).detach(), 
        c.$dots && c.$dots.remove(), c.$prevArrow && c.$prevArrow.length && (c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), 
        c.htmlExpr.test(c.options.prevArrow) && c.$prevArrow.remove()), c.$nextArrow && c.$nextArrow.length && (c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), 
        c.htmlExpr.test(c.options.nextArrow) && c.$nextArrow.remove()), c.$slides && (c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            a(this).attr("style", a(this).data("originalStyling"));
        }), c.$slideTrack.children(this.options.slide).detach(), c.$slideTrack.detach(), 
        c.$list.detach(), c.$slider.append(c.$slides)), c.cleanUpRows(), c.$slider.removeClass("slick-slider"), 
        c.$slider.removeClass("slick-initialized"), c.$slider.removeClass("slick-dotted"), 
        c.unslicked = !0, b || c.$slider.trigger("destroy", [ c ]);
    }, b.prototype.disableTransition = function(a) {
        var b = this, c = {};
        c[b.transitionType] = "", !1 === b.options.fade ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c);
    }, b.prototype.fadeSlide = function(a, b) {
        var c = this;
        !1 === c.cssTransitions ? (c.$slides.eq(a).css({
            zIndex: c.options.zIndex
        }), c.$slides.eq(a).animate({
            opacity: 1
        }, c.options.speed, c.options.easing, b)) : (c.applyTransition(a), c.$slides.eq(a).css({
            opacity: 1,
            zIndex: c.options.zIndex
        }), b && setTimeout(function() {
            c.disableTransition(a), b.call();
        }, c.options.speed));
    }, b.prototype.fadeSlideOut = function(a) {
        var b = this;
        !1 === b.cssTransitions ? b.$slides.eq(a).animate({
            opacity: 0,
            zIndex: b.options.zIndex - 2
        }, b.options.speed, b.options.easing) : (b.applyTransition(a), b.$slides.eq(a).css({
            opacity: 0,
            zIndex: b.options.zIndex - 2
        }));
    }, b.prototype.filterSlides = b.prototype.slickFilter = function(a) {
        var b = this;
        null !== a && (b.$slidesCache = b.$slides, b.unload(), b.$slideTrack.children(this.options.slide).detach(), 
        b.$slidesCache.filter(a).appendTo(b.$slideTrack), b.reinit());
    }, b.prototype.focusHandler = function() {
        var b = this;
        b.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*:not(.slick-arrow)", function(c) {
            c.stopImmediatePropagation();
            var d = a(this);
            setTimeout(function() {
                b.options.pauseOnFocus && (b.focussed = d.is(":focus"), b.autoPlay());
            }, 0);
        });
    }, b.prototype.getCurrent = b.prototype.slickCurrentSlide = function() {
        return this.currentSlide;
    }, b.prototype.getDotCount = function() {
        var a = this, b = 0, c = 0, d = 0;
        if (!0 === a.options.infinite) for (;b < a.slideCount; ) ++d, b = c + a.options.slidesToScroll, 
        c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow; else if (!0 === a.options.centerMode) d = a.slideCount; else if (a.options.asNavFor) for (;b < a.slideCount; ) ++d, 
        b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow; else d = 1 + Math.ceil((a.slideCount - a.options.slidesToShow) / a.options.slidesToScroll);
        return d - 1;
    }, b.prototype.getLeft = function(a) {
        var c, d, f, b = this, e = 0;
        return b.slideOffset = 0, d = b.$slides.first().outerHeight(!0), !0 === b.options.infinite ? (b.slideCount > b.options.slidesToShow && (b.slideOffset = b.slideWidth * b.options.slidesToShow * -1, 
        e = d * b.options.slidesToShow * -1), b.slideCount % b.options.slidesToScroll != 0 && a + b.options.slidesToScroll > b.slideCount && b.slideCount > b.options.slidesToShow && (a > b.slideCount ? (b.slideOffset = (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth * -1, 
        e = (b.options.slidesToShow - (a - b.slideCount)) * d * -1) : (b.slideOffset = b.slideCount % b.options.slidesToScroll * b.slideWidth * -1, 
        e = b.slideCount % b.options.slidesToScroll * d * -1))) : a + b.options.slidesToShow > b.slideCount && (b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth, 
        e = (a + b.options.slidesToShow - b.slideCount) * d), b.slideCount <= b.options.slidesToShow && (b.slideOffset = 0, 
        e = 0), !0 === b.options.centerMode && !0 === b.options.infinite ? b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth : !0 === b.options.centerMode && (b.slideOffset = 0, 
        b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2)), c = !1 === b.options.vertical ? a * b.slideWidth * -1 + b.slideOffset : a * d * -1 + e, 
        !0 === b.options.variableWidth && (f = b.slideCount <= b.options.slidesToShow || !1 === b.options.infinite ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow), 
        c = !0 === b.options.rtl ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, 
        !0 === b.options.centerMode && (f = b.slideCount <= b.options.slidesToShow || !1 === b.options.infinite ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow + 1), 
        c = !0 === b.options.rtl ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, 
        c += (b.$list.width() - f.outerWidth()) / 2)), c;
    }, b.prototype.getOption = b.prototype.slickGetOption = function(a) {
        return this.options[a];
    }, b.prototype.getNavigableIndexes = function() {
        var e, a = this, b = 0, c = 0, d = [];
        for (!1 === a.options.infinite ? e = a.slideCount : (b = -1 * a.options.slidesToScroll, 
        c = -1 * a.options.slidesToScroll, e = 2 * a.slideCount); e > b; ) d.push(b), b = c + a.options.slidesToScroll, 
        c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
        return d;
    }, b.prototype.getSlick = function() {
        return this;
    }, b.prototype.getSlideCount = function() {
        var d, e, b = this;
        return e = !0 === b.options.centerMode ? b.slideWidth * Math.floor(b.options.slidesToShow / 2) : 0, 
        !0 === b.options.swipeToSlide ? (b.$slideTrack.find(".slick-slide").each(function(c, f) {
            return f.offsetLeft - e + a(f).outerWidth() / 2 > -1 * b.swipeLeft ? (d = f, !1) : void 0;
        }), Math.abs(a(d).attr("data-slick-index") - b.currentSlide) || 1) : b.options.slidesToScroll;
    }, b.prototype.goTo = b.prototype.slickGoTo = function(a, b) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(a)
            }
        }, b);
    }, b.prototype.init = function(b) {
        var c = this;
        a(c.$slider).hasClass("slick-initialized") || (a(c.$slider).addClass("slick-initialized"), 
        c.buildRows(), c.buildOut(), c.setProps(), c.startLoad(), c.loadSlider(), c.initializeEvents(), 
        c.updateArrows(), c.updateDots(), c.checkResponsive(!0), c.focusHandler()), b && c.$slider.trigger("init", [ c ]), 
        !0 === c.options.accessibility && c.initADA(), c.options.autoplay && (c.paused = !1, 
        c.autoPlay());
    }, b.prototype.initADA = function() {
        var b = this;
        b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }), b.$slideTrack.attr("role", "listbox"), b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c) {
            a(this).attr({
                role: "option",
                "aria-describedby": "slick-slide" + b.instanceUid + c
            });
        }), null !== b.$dots && b.$dots.attr("role", "tablist").find("li").each(function(c) {
            a(this).attr({
                role: "presentation",
                "aria-selected": "false",
                "aria-controls": "navigation" + b.instanceUid + c,
                id: "slick-slide" + b.instanceUid + c
            });
        }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), 
        b.activateADA();
    }, b.prototype.initArrowEvents = function() {
        var a = this;
        !0 === a.options.arrows && a.slideCount > a.options.slidesToShow && (a.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, a.changeSlide), a.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, a.changeSlide));
    }, b.prototype.initDotEvents = function() {
        var b = this;
        !0 === b.options.dots && b.slideCount > b.options.slidesToShow && a("li", b.$dots).on("click.slick", {
            message: "index"
        }, b.changeSlide), !0 === b.options.dots && !0 === b.options.pauseOnDotsHover && a("li", b.$dots).on("mouseenter.slick", a.proxy(b.interrupt, b, !0)).on("mouseleave.slick", a.proxy(b.interrupt, b, !1));
    }, b.prototype.initSlideEvents = function() {
        var b = this;
        b.options.pauseOnHover && (b.$list.on("mouseenter.slick", a.proxy(b.interrupt, b, !0)), 
        b.$list.on("mouseleave.slick", a.proxy(b.interrupt, b, !1)));
    }, b.prototype.initializeEvents = function() {
        var b = this;
        b.initArrowEvents(), b.initDotEvents(), b.initSlideEvents(), b.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, b.swipeHandler), b.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, b.swipeHandler), b.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, b.swipeHandler), b.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, b.swipeHandler), b.$list.on("click.slick", b.clickHandler), a(document).on(b.visibilityChange, a.proxy(b.visibility, b)), 
        !0 === b.options.accessibility && b.$list.on("keydown.slick", b.keyHandler), !0 === b.options.focusOnSelect && a(b.$slideTrack).children().on("click.slick", b.selectHandler), 
        a(window).on("orientationchange.slick.slick-" + b.instanceUid, a.proxy(b.orientationChange, b)), 
        a(window).on("resize.slick.slick-" + b.instanceUid, a.proxy(b.resize, b)), a("[draggable!=true]", b.$slideTrack).on("dragstart", b.preventDefault), 
        a(window).on("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).on("ready.slick.slick-" + b.instanceUid, b.setPosition);
    }, b.prototype.initUI = function() {
        var a = this;
        !0 === a.options.arrows && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(), 
        a.$nextArrow.show()), !0 === a.options.dots && a.slideCount > a.options.slidesToShow && a.$dots.show();
    }, b.prototype.keyHandler = function(a) {
        var b = this;
        a.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === a.keyCode && !0 === b.options.accessibility ? b.changeSlide({
            data: {
                message: !0 === b.options.rtl ? "next" : "previous"
            }
        }) : 39 === a.keyCode && !0 === b.options.accessibility && b.changeSlide({
            data: {
                message: !0 === b.options.rtl ? "previous" : "next"
            }
        }));
    }, b.prototype.lazyLoad = function() {
        function g(c) {
            a("img[data-lazy]", c).each(function() {
                var c = a(this), d = a(this).attr("data-lazy"), e = document.createElement("img");
                e.onload = function() {
                    c.animate({
                        opacity: 0
                    }, 100, function() {
                        c.attr("src", d).animate({
                            opacity: 1
                        }, 200, function() {
                            c.removeAttr("data-lazy").removeClass("slick-loading");
                        }), b.$slider.trigger("lazyLoaded", [ b, c, d ]);
                    });
                }, e.onerror = function() {
                    c.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), 
                    b.$slider.trigger("lazyLoadError", [ b, c, d ]);
                }, e.src = d;
            });
        }
        var c, d, e, f, b = this;
        !0 === b.options.centerMode ? !0 === b.options.infinite ? (e = b.currentSlide + (b.options.slidesToShow / 2 + 1), 
        f = e + b.options.slidesToShow + 2) : (e = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1)), 
        f = b.options.slidesToShow / 2 + 1 + 2 + b.currentSlide) : (e = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide, 
        f = Math.ceil(e + b.options.slidesToShow), !0 === b.options.fade && (e > 0 && e--, 
        f <= b.slideCount && f++)), c = b.$slider.find(".slick-slide").slice(e, f), g(c), 
        b.slideCount <= b.options.slidesToShow ? (d = b.$slider.find(".slick-slide"), g(d)) : b.currentSlide >= b.slideCount - b.options.slidesToShow ? (d = b.$slider.find(".slick-cloned").slice(0, b.options.slidesToShow), 
        g(d)) : 0 === b.currentSlide && (d = b.$slider.find(".slick-cloned").slice(-1 * b.options.slidesToShow), 
        g(d));
    }, b.prototype.loadSlider = function() {
        var a = this;
        a.setPosition(), a.$slideTrack.css({
            opacity: 1
        }), a.$slider.removeClass("slick-loading"), a.initUI(), "progressive" === a.options.lazyLoad && a.progressiveLazyLoad();
    }, b.prototype.next = b.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        });
    }, b.prototype.orientationChange = function() {
        var a = this;
        a.checkResponsive(), a.setPosition();
    }, b.prototype.pause = b.prototype.slickPause = function() {
        var a = this;
        a.autoPlayClear(), a.paused = !0;
    }, b.prototype.play = b.prototype.slickPlay = function() {
        var a = this;
        a.autoPlay(), a.options.autoplay = !0, a.paused = !1, a.focussed = !1, a.interrupted = !1;
    }, b.prototype.postSlide = function(a) {
        var b = this;
        b.unslicked || (b.$slider.trigger("afterChange", [ b, a ]), b.animating = !1, b.setPosition(), 
        b.swipeLeft = null, b.options.autoplay && b.autoPlay(), !0 === b.options.accessibility && b.initADA());
    }, b.prototype.prev = b.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        });
    }, b.prototype.preventDefault = function(a) {
        a.preventDefault();
    }, b.prototype.progressiveLazyLoad = function(b) {
        b = b || 1;
        var e, f, g, c = this, d = a("img[data-lazy]", c.$slider);
        d.length ? (e = d.first(), f = e.attr("data-lazy"), g = document.createElement("img"), 
        g.onload = function() {
            e.attr("src", f).removeAttr("data-lazy").removeClass("slick-loading"), !0 === c.options.adaptiveHeight && c.setPosition(), 
            c.$slider.trigger("lazyLoaded", [ c, e, f ]), c.progressiveLazyLoad();
        }, g.onerror = function() {
            3 > b ? setTimeout(function() {
                c.progressiveLazyLoad(b + 1);
            }, 500) : (e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), 
            c.$slider.trigger("lazyLoadError", [ c, e, f ]), c.progressiveLazyLoad());
        }, g.src = f) : c.$slider.trigger("allImagesLoaded", [ c ]);
    }, b.prototype.refresh = function(b) {
        var d, e, c = this;
        e = c.slideCount - c.options.slidesToShow, !c.options.infinite && c.currentSlide > e && (c.currentSlide = e), 
        c.slideCount <= c.options.slidesToShow && (c.currentSlide = 0), d = c.currentSlide, 
        c.destroy(!0), a.extend(c, c.initials, {
            currentSlide: d
        }), c.init(), b || c.changeSlide({
            data: {
                message: "index",
                index: d
            }
        }, !1);
    }, b.prototype.registerBreakpoints = function() {
        var c, d, e, b = this, f = b.options.responsive || null;
        if ("array" === a.type(f) && f.length) {
            b.respondTo = b.options.respondTo || "window";
            for (c in f) if (e = b.breakpoints.length - 1, d = f[c].breakpoint, f.hasOwnProperty(c)) {
                for (;e >= 0; ) b.breakpoints[e] && b.breakpoints[e] === d && b.breakpoints.splice(e, 1), 
                e--;
                b.breakpoints.push(d), b.breakpointSettings[d] = f[c].settings;
            }
            b.breakpoints.sort(function(a, c) {
                return b.options.mobileFirst ? a - c : c - a;
            });
        }
    }, b.prototype.reinit = function() {
        var b = this;
        b.$slides = b.$slideTrack.children(b.options.slide).addClass("slick-slide"), b.slideCount = b.$slides.length, 
        b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll), 
        b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0), b.registerBreakpoints(), 
        b.setProps(), b.setupInfinite(), b.buildArrows(), b.updateArrows(), b.initArrowEvents(), 
        b.buildDots(), b.updateDots(), b.initDotEvents(), b.cleanUpSlideEvents(), b.initSlideEvents(), 
        b.checkResponsive(!1, !0), !0 === b.options.focusOnSelect && a(b.$slideTrack).children().on("click.slick", b.selectHandler), 
        b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0), b.setPosition(), 
        b.focusHandler(), b.paused = !b.options.autoplay, b.autoPlay(), b.$slider.trigger("reInit", [ b ]);
    }, b.prototype.resize = function() {
        var b = this;
        a(window).width() !== b.windowWidth && (clearTimeout(b.windowDelay), b.windowDelay = window.setTimeout(function() {
            b.windowWidth = a(window).width(), b.checkResponsive(), b.unslicked || b.setPosition();
        }, 50));
    }, b.prototype.removeSlide = b.prototype.slickRemove = function(a, b, c) {
        var d = this;
        return "boolean" == typeof a ? (b = a, a = !0 === b ? 0 : d.slideCount - 1) : a = !0 === b ? --a : a, 
        !(d.slideCount < 1 || 0 > a || a > d.slideCount - 1) && (d.unload(), !0 === c ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(), 
        d.$slides = d.$slideTrack.children(this.options.slide), d.$slideTrack.children(this.options.slide).detach(), 
        d.$slideTrack.append(d.$slides), d.$slidesCache = d.$slides, void d.reinit());
    }, b.prototype.setCSS = function(a) {
        var d, e, b = this, c = {};
        !0 === b.options.rtl && (a = -a), d = "left" == b.positionProp ? Math.ceil(a) + "px" : "0px", 
        e = "top" == b.positionProp ? Math.ceil(a) + "px" : "0px", c[b.positionProp] = a, 
        !1 === b.transformsEnabled ? b.$slideTrack.css(c) : (c = {}, !1 === b.cssTransitions ? (c[b.animType] = "translate(" + d + ", " + e + ")", 
        b.$slideTrack.css(c)) : (c[b.animType] = "translate3d(" + d + ", " + e + ", 0px)", 
        b.$slideTrack.css(c)));
    }, b.prototype.setDimensions = function() {
        var a = this;
        !1 === a.options.vertical ? !0 === a.options.centerMode && a.$list.css({
            padding: "0px " + a.options.centerPadding
        }) : (a.$list.height(a.$slides.first().outerHeight(!0) * a.options.slidesToShow), 
        !0 === a.options.centerMode && a.$list.css({
            padding: a.options.centerPadding + " 0px"
        })), a.listWidth = a.$list.width(), a.listHeight = a.$list.height(), !1 === a.options.vertical && !1 === a.options.variableWidth ? (a.slideWidth = Math.ceil(a.listWidth / a.options.slidesToShow), 
        a.$slideTrack.width(Math.ceil(a.slideWidth * a.$slideTrack.children(".slick-slide").length))) : !0 === a.options.variableWidth ? a.$slideTrack.width(5e3 * a.slideCount) : (a.slideWidth = Math.ceil(a.listWidth), 
        a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0) * a.$slideTrack.children(".slick-slide").length)));
        var b = a.$slides.first().outerWidth(!0) - a.$slides.first().width();
        !1 === a.options.variableWidth && a.$slideTrack.children(".slick-slide").width(a.slideWidth - b);
    }, b.prototype.setFade = function() {
        var c, b = this;
        b.$slides.each(function(d, e) {
            c = b.slideWidth * d * -1, !0 === b.options.rtl ? a(e).css({
                position: "relative",
                right: c,
                top: 0,
                zIndex: b.options.zIndex - 2,
                opacity: 0
            }) : a(e).css({
                position: "relative",
                left: c,
                top: 0,
                zIndex: b.options.zIndex - 2,
                opacity: 0
            });
        }), b.$slides.eq(b.currentSlide).css({
            zIndex: b.options.zIndex - 1,
            opacity: 1
        });
    }, b.prototype.setHeight = function() {
        var a = this;
        if (1 === a.options.slidesToShow && !0 === a.options.adaptiveHeight && !1 === a.options.vertical) {
            var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
            a.$list.css("height", b);
        }
    }, b.prototype.setOption = b.prototype.slickSetOption = function() {
        var c, d, e, f, h, b = this, g = !1;
        if ("object" === a.type(arguments[0]) ? (e = arguments[0], g = arguments[1], h = "multiple") : "string" === a.type(arguments[0]) && (e = arguments[0], 
        f = arguments[1], g = arguments[2], "responsive" === arguments[0] && "array" === a.type(arguments[1]) ? h = "responsive" : void 0 !== arguments[1] && (h = "single")), 
        "single" === h) b.options[e] = f; else if ("multiple" === h) a.each(e, function(a, c) {
            b.options[a] = c;
        }); else if ("responsive" === h) for (d in f) if ("array" !== a.type(b.options.responsive)) b.options.responsive = [ f[d] ]; else {
            for (c = b.options.responsive.length - 1; c >= 0; ) b.options.responsive[c].breakpoint === f[d].breakpoint && b.options.responsive.splice(c, 1), 
            c--;
            b.options.responsive.push(f[d]);
        }
        g && (b.unload(), b.reinit());
    }, b.prototype.setPosition = function() {
        var a = this;
        a.setDimensions(), a.setHeight(), !1 === a.options.fade ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(), 
        a.$slider.trigger("setPosition", [ a ]);
    }, b.prototype.setProps = function() {
        var a = this, b = document.body.style;
        a.positionProp = !0 === a.options.vertical ? "top" : "left", "top" === a.positionProp ? a.$slider.addClass("slick-vertical") : a.$slider.removeClass("slick-vertical"), 
        (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) && !0 === a.options.useCSS && (a.cssTransitions = !0), 
        a.options.fade && ("number" == typeof a.options.zIndex ? a.options.zIndex < 3 && (a.options.zIndex = 3) : a.options.zIndex = a.defaults.zIndex), 
        void 0 !== b.OTransform && (a.animType = "OTransform", a.transformType = "-o-transform", 
        a.transitionType = "OTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), 
        void 0 !== b.MozTransform && (a.animType = "MozTransform", a.transformType = "-moz-transform", 
        a.transitionType = "MozTransition", void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)), 
        void 0 !== b.webkitTransform && (a.animType = "webkitTransform", a.transformType = "-webkit-transform", 
        a.transitionType = "webkitTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), 
        void 0 !== b.msTransform && (a.animType = "msTransform", a.transformType = "-ms-transform", 
        a.transitionType = "msTransition", void 0 === b.msTransform && (a.animType = !1)), 
        void 0 !== b.transform && !1 !== a.animType && (a.animType = "transform", a.transformType = "transform", 
        a.transitionType = "transition"), a.transformsEnabled = a.options.useTransform && null !== a.animType && !1 !== a.animType;
    }, b.prototype.setSlideClasses = function(a) {
        var c, d, e, f, b = this;
        d = b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), 
        b.$slides.eq(a).addClass("slick-current"), !0 === b.options.centerMode ? (c = Math.floor(b.options.slidesToShow / 2), 
        !0 === b.options.infinite && (a >= c && a <= b.slideCount - 1 - c ? b.$slides.slice(a - c, a + c + 1).addClass("slick-active").attr("aria-hidden", "false") : (e = b.options.slidesToShow + a, 
        d.slice(e - c + 1, e + c + 2).addClass("slick-active").attr("aria-hidden", "false")), 
        0 === a ? d.eq(d.length - 1 - b.options.slidesToShow).addClass("slick-center") : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass("slick-center")), 
        b.$slides.eq(a).addClass("slick-center")) : a >= 0 && a <= b.slideCount - b.options.slidesToShow ? b.$slides.slice(a, a + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : d.length <= b.options.slidesToShow ? d.addClass("slick-active").attr("aria-hidden", "false") : (f = b.slideCount % b.options.slidesToShow, 
        e = !0 === b.options.infinite ? b.options.slidesToShow + a : a, b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow ? d.slice(e - (b.options.slidesToShow - f), e + f).addClass("slick-active").attr("aria-hidden", "false") : d.slice(e, e + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), 
        "ondemand" === b.options.lazyLoad && b.lazyLoad();
    }, b.prototype.setupInfinite = function() {
        var c, d, e, b = this;
        if (!0 === b.options.fade && (b.options.centerMode = !1), !0 === b.options.infinite && !1 === b.options.fade && (d = null, 
        b.slideCount > b.options.slidesToShow)) {
            for (e = !0 === b.options.centerMode ? b.options.slidesToShow + 1 : b.options.slidesToShow, 
            c = b.slideCount; c > b.slideCount - e; c -= 1) d = c - 1, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d - b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");
            for (c = 0; e > c; c += 1) d = c, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d + b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");
            b.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                a(this).attr("id", "");
            });
        }
    }, b.prototype.interrupt = function(a) {
        var b = this;
        a || b.autoPlay(), b.interrupted = a;
    }, b.prototype.selectHandler = function(b) {
        var c = this, d = a(b.target).is(".slick-slide") ? a(b.target) : a(b.target).parents(".slick-slide"), e = parseInt(d.attr("data-slick-index"));
        return e || (e = 0), c.slideCount <= c.options.slidesToShow ? (c.setSlideClasses(e), 
        void c.asNavFor(e)) : void c.slideHandler(e);
    }, b.prototype.slideHandler = function(a, b, c) {
        var d, e, f, g, j, h = null, i = this;
        return b = b || !1, !0 === i.animating && !0 === i.options.waitForAnimate || !0 === i.options.fade && i.currentSlide === a || i.slideCount <= i.options.slidesToShow ? void 0 : (!1 === b && i.asNavFor(a), 
        d = a, h = i.getLeft(d), g = i.getLeft(i.currentSlide), i.currentLeft = null === i.swipeLeft ? g : i.swipeLeft, 
        !1 === i.options.infinite && !1 === i.options.centerMode && (0 > a || a > i.getDotCount() * i.options.slidesToScroll) ? void (!1 === i.options.fade && (d = i.currentSlide, 
        !0 !== c ? i.animateSlide(g, function() {
            i.postSlide(d);
        }) : i.postSlide(d))) : !1 === i.options.infinite && !0 === i.options.centerMode && (0 > a || a > i.slideCount - i.options.slidesToScroll) ? void (!1 === i.options.fade && (d = i.currentSlide, 
        !0 !== c ? i.animateSlide(g, function() {
            i.postSlide(d);
        }) : i.postSlide(d))) : (i.options.autoplay && clearInterval(i.autoPlayTimer), e = 0 > d ? i.slideCount % i.options.slidesToScroll != 0 ? i.slideCount - i.slideCount % i.options.slidesToScroll : i.slideCount + d : d >= i.slideCount ? i.slideCount % i.options.slidesToScroll != 0 ? 0 : d - i.slideCount : d, 
        i.animating = !0, i.$slider.trigger("beforeChange", [ i, i.currentSlide, e ]), f = i.currentSlide, 
        i.currentSlide = e, i.setSlideClasses(i.currentSlide), i.options.asNavFor && (j = i.getNavTarget(), 
        j = j.slick("getSlick"), j.slideCount <= j.options.slidesToShow && j.setSlideClasses(i.currentSlide)), 
        i.updateDots(), i.updateArrows(), !0 === i.options.fade ? (!0 !== c ? (i.fadeSlideOut(f), 
        i.fadeSlide(e, function() {
            i.postSlide(e);
        })) : i.postSlide(e), void i.animateHeight()) : void (!0 !== c ? i.animateSlide(h, function() {
            i.postSlide(e);
        }) : i.postSlide(e))));
    }, b.prototype.startLoad = function() {
        var a = this;
        !0 === a.options.arrows && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(), 
        a.$nextArrow.hide()), !0 === a.options.dots && a.slideCount > a.options.slidesToShow && a.$dots.hide(), 
        a.$slider.addClass("slick-loading");
    }, b.prototype.swipeDirection = function() {
        var a, b, c, d, e = this;
        return a = e.touchObject.startX - e.touchObject.curX, b = e.touchObject.startY - e.touchObject.curY, 
        c = Math.atan2(b, a), d = Math.round(180 * c / Math.PI), 0 > d && (d = 360 - Math.abs(d)), 
        45 >= d && d >= 0 ? !1 === e.options.rtl ? "left" : "right" : 360 >= d && d >= 315 ? !1 === e.options.rtl ? "left" : "right" : d >= 135 && 225 >= d ? !1 === e.options.rtl ? "right" : "left" : !0 === e.options.verticalSwiping ? d >= 35 && 135 >= d ? "down" : "up" : "vertical";
    }, b.prototype.swipeEnd = function(a) {
        var c, d, b = this;
        if (b.dragging = !1, b.interrupted = !1, b.shouldClick = !(b.touchObject.swipeLength > 10), 
        void 0 === b.touchObject.curX) return !1;
        if (!0 === b.touchObject.edgeHit && b.$slider.trigger("edge", [ b, b.swipeDirection() ]), 
        b.touchObject.swipeLength >= b.touchObject.minSwipe) {
            switch (d = b.swipeDirection()) {
              case "left":
              case "down":
                c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide + b.getSlideCount()) : b.currentSlide + b.getSlideCount(), 
                b.currentDirection = 0;
                break;

              case "right":
              case "up":
                c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide - b.getSlideCount()) : b.currentSlide - b.getSlideCount(), 
                b.currentDirection = 1;
            }
            "vertical" != d && (b.slideHandler(c), b.touchObject = {}, b.$slider.trigger("swipe", [ b, d ]));
        } else b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide), 
        b.touchObject = {});
    }, b.prototype.swipeHandler = function(a) {
        var b = this;
        if (!(!1 === b.options.swipe || "ontouchend" in document && !1 === b.options.swipe || !1 === b.options.draggable && -1 !== a.type.indexOf("mouse"))) switch (b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1, 
        b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold, !0 === b.options.verticalSwiping && (b.touchObject.minSwipe = b.listHeight / b.options.touchThreshold), 
        a.data.action) {
          case "start":
            b.swipeStart(a);
            break;

          case "move":
            b.swipeMove(a);
            break;

          case "end":
            b.swipeEnd(a);
        }
    }, b.prototype.swipeMove = function(a) {
        var d, e, f, g, h, b = this;
        return h = void 0 !== a.originalEvent ? a.originalEvent.touches : null, !(!b.dragging || h && 1 !== h.length) && (d = b.getLeft(b.currentSlide), 
        b.touchObject.curX = void 0 !== h ? h[0].pageX : a.clientX, b.touchObject.curY = void 0 !== h ? h[0].pageY : a.clientY, 
        b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2))), 
        !0 === b.options.verticalSwiping && (b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curY - b.touchObject.startY, 2)))), 
        e = b.swipeDirection(), "vertical" !== e ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(), 
        g = (!1 === b.options.rtl ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ? 1 : -1), 
        !0 === b.options.verticalSwiping && (g = b.touchObject.curY > b.touchObject.startY ? 1 : -1), 
        f = b.touchObject.swipeLength, b.touchObject.edgeHit = !1, !1 === b.options.infinite && (0 === b.currentSlide && "right" === e || b.currentSlide >= b.getDotCount() && "left" === e) && (f = b.touchObject.swipeLength * b.options.edgeFriction, 
        b.touchObject.edgeHit = !0), !1 === b.options.vertical ? b.swipeLeft = d + f * g : b.swipeLeft = d + f * (b.$list.height() / b.listWidth) * g, 
        !0 === b.options.verticalSwiping && (b.swipeLeft = d + f * g), !0 !== b.options.fade && !1 !== b.options.touchMove && (!0 === b.animating ? (b.swipeLeft = null, 
        !1) : void b.setCSS(b.swipeLeft))) : void 0);
    }, b.prototype.swipeStart = function(a) {
        var c, b = this;
        return b.interrupted = !0, 1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow ? (b.touchObject = {}, 
        !1) : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]), 
        b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX, 
        b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY, 
        void (b.dragging = !0));
    }, b.prototype.unfilterSlides = b.prototype.slickUnfilter = function() {
        var a = this;
        null !== a.$slidesCache && (a.unload(), a.$slideTrack.children(this.options.slide).detach(), 
        a.$slidesCache.appendTo(a.$slideTrack), a.reinit());
    }, b.prototype.unload = function() {
        var b = this;
        a(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.remove(), 
        b.$nextArrow && b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.remove(), b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
    }, b.prototype.unslick = function(a) {
        var b = this;
        b.$slider.trigger("unslick", [ b, a ]), b.destroy();
    }, b.prototype.updateArrows = function() {
        var a = this;
        Math.floor(a.options.slidesToShow / 2), !0 === a.options.arrows && a.slideCount > a.options.slidesToShow && !a.options.infinite && (a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 
        a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === a.currentSlide ? (a.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
        a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - a.options.slidesToShow && !1 === a.options.centerMode ? (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
        a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - 1 && !0 === a.options.centerMode && (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
        a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
    }, b.prototype.updateDots = function() {
        var a = this;
        null !== a.$dots && (a.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), 
        a.$dots.find("li").eq(Math.floor(a.currentSlide / a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"));
    }, b.prototype.visibility = function() {
        var a = this;
        a.options.autoplay && (document[a.hidden] ? a.interrupted = !0 : a.interrupted = !1);
    }, a.fn.slick = function() {
        var f, g, a = this, c = arguments[0], d = Array.prototype.slice.call(arguments, 1), e = a.length;
        for (f = 0; e > f; f++) if ("object" == typeof c || void 0 === c ? a[f].slick = new b(a[f], c) : g = a[f].slick[c].apply(a[f].slick, d), 
        void 0 !== g) return g;
        return a;
    };
}), function($) {
    "use strict";
    ({
        cache: {
            $body: $("body"),
            $document: $(document),
            $window: $(window)
        },
        init: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            $(function() {
                self.cache.$target = $(".job_listings"), self.cache.$body = $("body"), self.cache.$html = $("html"), 
                $("div.job_listings ul.job_listings").addClass("loading"), self.initHeader(), self.initFilters(), 
                self.initSearch(), self.submitButton(), self.initTimePickers(), self.initTabbedListings(), 
                self.initBusinessHours(), self.initApply(), self.previewListing(), self.filterTags();
            }), this.cache.$window.on("resize", function() {
                self.initHeader();
            });
        },
        initHeader: function() {
            var $body = this.cache.$body, $window = this.cache.$window, isFixedHeader = $body.hasClass("fixed-header"), isTransparentHeader = $body.hasClass("site-header--transparent"), siteHeaderHeight = ($(".site-header"), 
            $(".site-header").outerHeight());
            if ($window.outerWidth() <= 992) return void $body.css("padding-top", 0);
            isFixedHeader && !isTransparentHeader && $body.css("padding-top", siteHeaderHeight);
        },
        initSearch: function() {
            $(".search-overlay-toggle[data-toggle]").click(function(e) {
                e.preventDefault(), $($(this).data("toggle")).toggleClass("active");
            }), $(".listify_widget_search_listings form.job_filters").removeClass("job_filters").addClass("job_search_form").prop("action", listifySettings.archiveurl), 
            $("button.update_results").on("click", function() {
                $("div.job_listings ul.job_listings").addClass("loading"), $(this).parent("form").submit();
            }), $("form.job_search_form input").keypress(function(event) {
                13 == event.which && (event.preventDefault(), $("form.job_search_form").submit());
            }), $("form.job_search_form").on("submit", function(e) {
                var info = $(this).serialize();
                window.location.href = listifySettings.archiveurl + "?" + info;
            });
        },
        initFilters: function() {
            var filters = [ $("ul.job_types"), $(".filter_by_tag") ];
            $.each(filters, function(i, el) {
                el.outerHeight() > 140 && el.addClass("too-tall");
            }), $(".home").find(".job_types") && !$(".home .job_types").is(":visible") && $('.home input[name="filter_job_type[]"]').remove();
        },
        submitButton: function() {
            $(".update_results").on("click", function(e) {
                e.preventDefault(), $("div.job_listings").trigger("update_results", [ 1, !1 ]);
            });
        },
        initTimePickers: function() {
            $(".timepicker").timepicker({
                timeFormat: listifySettings.l10n.timeFormat,
                noneOption: {
                    label: listifySettings.l10n.closed,
                    value: listifySettings.l10n.closed
                }
            });
        },
        initTabbedListings: function() {
            var $tabWrapper = $(".tabbed-listings-tabs-wrapper"), $buttonsWrapper = $(".tabbed-listings-tabs");
            $tabWrapper.find("> div").hide().filter(":first-child").show(), $buttonsWrapper.find("li:first-child a").addClass("active"), 
            $buttonsWrapper.on("click", "li:not(:last-child) a", function(e) {
                e.preventDefault(), $buttonsWrapper.find("li a").removeClass("active"), $(this).addClass("active");
                var activeTab = $(this).attr("href");
                $(this).parents(".listify_widget_tabbed_listings").find(".listings-tab").hide().filter(activeTab).show();
            });
        },
        initBusinessHours: function() {
            $(".fieldset-job_hours label").click(function(e) {
                e.preventDefault(), $(this).parent().toggleClass("open").end().next().toggle();
            });
        },
        initApply: function() {
            $(".job_application.application").addClass("popup");
        },
        previewListing: function() {
            $(".job_listing_preview").length && ($("#main").addClass("preview-listing"), $(".job_listing_preview.single_job_listing").removeClass("single_job_listing").addClass("single-job_listing"));
        },
        filterTags: function() {
            $(".filter_by_tag").contents().filter(function() {
                return 3 === this.nodeType;
            }).each(function() {
                this.nodeValue = $.trim(this.nodeValue);
            }).wrap('<span class="filter-label"></span>');
        }
    }).init();
}(jQuery), function($) {
    "use strict";
    var listifyFacetWP = {
        cache: {
            $document: $(document),
            $window: $(window),
            $body: $("body")
        },
        init: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            $(function() {
                self.sorting(), self.moreFilters();
            });
        },
        sorting: function() {
            this.cache.$document.on("facetwp-loaded facetwp-refresh", function() {
                $(".facetwp-sort-select").wrap('<span class="select"></span>');
            });
        },
        moreFilters: function() {
            this.cache.$document.on("click", ".js-toggle-more-filters", function() {
                var hideText = $(this).data("label-hide"), showText = $(this).data("label-show"), $button = $(this), $filters = $(".more-filters__filters");
                $filters.slideToggle("fast", function() {
                    $button.text($filters.is(":visible") ? hideText : showText);
                });
            });
        }
    };
    listifyFacetWP.init(), listifyFacetWP.cache.$document.on("facetwp-loaded", function() {
        listifyFacetWP.cache.$body.hasClass("job-manager-archive") && $("html, body").animate({
            scrollTop: 0
        }, 500);
    });
}(jQuery), function($) {
    "use strict";
    ({
        cache: {
            $document: $(document),
            $window: $(window)
        },
        init: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            $(function() {
                self.initRatings(), self.initPackageSelection();
            });
        },
        initRatings: function() {
            $(".comment-form-rating").on("hover click", ".stars span a", function() {
                $(this).siblings().removeClass("hover").end().prevAll().addClass("hover");
            });
        },
        initPackageSelection: function() {
            var selectedPackage = $("#listify_selected_package");
            if (0 != selectedPackage.length && !$(".job-manager-error").length) {
                var value = selectedPackage.val();
                $(".job_listing_packages").find("#package-" + value).attr("checked", "checked"), 
                $("#job_package_selection").submit();
            }
        }
    }).init();
}(jQuery), function() {
    jQuery(function($) {
        return $(".share-email").click(function(e) {
            return $.magnificPopup.close();
        });
    });
}.call(this), function($) {
    "use strict";
    ({
        cache: {
            $document: $(document),
            $window: $(window),
            $body: $("body"),
            firefox: navigator.userAgent.toLowerCase().indexOf("firefox") > -1
        },
        init: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            $(function() {
                self.initMenu(), self.initPopups(), self.initVideos(), self.initTables(), self.initForms(), 
                self.initSelects(), self.cache.$document.on("facetwp-loaded facetwp-refresh update_results", function() {
                    self.initSelects();
                });
            });
        },
        initMenu: function() {
            $(".navigation-bar-toggle, .js-toggle-area-trigger").click(function(e) {
                e.preventDefault(), $(this).toggleClass("active").next().toggleClass("active");
            }), $(".current-account-avatar").click(function(e) {
                e.preventDefault();
                var url = $(this).data("href");
                window.location = url;
            }), listifySettings.isMobile && $("#categories-mega-menu").click(function(e) {
                e.preventDefault(), $(this).find(".category-list").toggleClass("category-list--open").toggle($(".category-list").hasClass("category-list--open"));
            });
        },
        initPopups: function() {
            var self = this;
            self.cache.$document.on("click", ".popup-trigger-ajax", function(e) {
                e.preventDefault();
                var className = $(this).attr("class");
                className = className.replace("popup-trigger-ajax", ""), className = className.replace("button", ""), 
                self.triggerPopup({
                    items: {
                        src: $(this).attr("href"),
                        type: "ajax"
                    },
                    ajax: {
                        tError: listifySettings.l10n.magnific.tError
                    },
                    callbacks: {
                        parseAjax: function(mfpResponse) {
                            mfpResponse.data = '<div class="popup ' + className + '"><h2 class="popup-title">' + $(mfpResponse.data).find(".page-title").text() + "</h2>" + $(mfpResponse.data).find("#main").html();
                        },
                        ajaxContentAdded: function() {
                            $("body").trigger("popup-trigger-ajax"), self.initForms(), self.initRecaptcha();
                        }
                    }
                });
            }), self.cache.$document.on("click", ".popup-trigger", function(e) {
                e.preventDefault();
                var source = $(this).data("mfp-src");
                void 0 === source && (source = $(this).attr("href")), self.triggerPopup({
                    items: {
                        src: source
                    },
                    callbacks: {
                        open: function() {
                            self.cache.$document.trigger("listifyInlinePopupOpen"), self.initForms();
                        }
                    }
                });
            }), listifySettings.loginPopupLink.length > 0 && self.cache.$document.on("click", listifySettings.loginPopupLink.join(), function(e) {
                e.preventDefault(), self.triggerPopup({
                    items: {
                        src: "#listify-login-popup",
                        type: "inline"
                    },
                    tClose: listifySettings.l10n.magnific.tClose,
                    tLoading: listifySettings.l10n.magnific.tLoading,
                    fixedContentPos: !1,
                    fixedBgPos: !0,
                    overflowY: "scroll"
                });
            });
        },
        initRecaptcha: function() {
            $(".g-recaptcha").each(function(index, element) {
                if ($(this).is(":empty")) {
                    var site_key = $(this).attr("data-sitekey"), theme = $(this).attr("data-theme"), element = $(this).get(0);
                    grecaptcha.render(element, {
                        sitekey: site_key,
                        theme: theme
                    });
                }
            });
        },
        triggerPopup: function(args) {
            return $.magnificPopup.close(), $.magnificPopup.open($.extend(args, {
                tClose: listifySettings.l10n.magnific.tClose,
                tLoading: listifySettings.l10n.magnific.tLoading,
                type: "inline",
                fixedContentPos: !1,
                fixedBgPos: !0,
                overflowY: "scroll"
            }));
        },
        initSelects: function() {
            var avoid = [ ".feedFormField", ".job-manager-category-dropdown[multiple]", ".job-manager-multiselect", ".job-manager-chosen-select", ".intl-tel-mobile-select", ".state_select", ".country_select", ".fieldset-job_region #job_region", ".facetwp-type-fselect select", "#pm-recipient", ".business-hour-timezone" ];
            $("select").each(function() {
                if (!$(this).parent().hasClass("select") && !$(this).is(avoid.join(","))) {
                    var existingClass = null;
                    if ($(this).attr("class")) var existingClass = $(this).attr("class").split(" ")[0];
                    $(this).wrap('<span class="select ' + existingClass + '-wrapper"></span>');
                }
            });
            var $mobileMegaMenu = $("#job_listing_tax_mobile select");
            $mobileMegaMenu.change(function(e) {
                e.preventDefault(), window.location.href = $mobileMegaMenu.find("option:selected").val();
            });
        },
        initVideos: function() {
            $(".site-content").fitVids();
        },
        initTables: function() {},
        initForms: function() {
            this.cache.$document.on("submit", ".popup form.login, .popup form.register", function(e) {
                var form = $(this), error = !1, base = $(this).serialize(), button = $(this).find("input[type=submit]"), data = base + "&" + button.attr("name") + "=" + button.val();
                $.ajax({
                    url: listifySettings.homeurl,
                    data: data,
                    type: "POST",
                    cache: !1,
                    async: !1
                }).done(function(response) {
                    form.find($(".woocommerce-error")).remove();
                    var $response = $("#ajax-response"), html = $.parseHTML(response);
                    $response.append(html), error = $response.find($(".woocommerce-error")), error.length > 0 && (form.prepend(error.clone()), 
                    $response.html(""), e.preventDefault());
                });
            });
        }
    }).init();
}(jQuery), function($) {
    $('a[href="#wc-bookings-booking-form"]').on("click", function(event) {
        var target = $(this.getAttribute("href"));
        target.length && (event.preventDefault(), $("html, body").stop().animate({
            scrollTop: target.offset().top - 250
        }, 1e3));
    }), $('a[href="#respond"]').on("click", function(event) {
        var target = $(this.getAttribute("href"));
        target.length && (event.preventDefault(), $("html, body").stop().animate({
            scrollTop: target.offset().top - 150
        }, 1e3));
    });
}(jQuery);