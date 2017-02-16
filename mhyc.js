(function(factory) {
    
    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof exports !== 'undefined') {
        var Fastclick = require('fastclick'), $, Spinner = require('spin');
        try { $ = require('jquery'); } catch (e) {}
        factory(root, exports, $, Fastclick, Spinner);

    } else {
        root.MhyC = factory(root, {}, root.jQuery, root.Fastclick, root.Sipinner);
    }

})(function(root, MhyC, $, Fastclick, Spinner) {

    MhyC.version = '5.0.0';
    MhyC.enabled = true;
    MhyC.el = null;
    MhyC.online = false;
    MhyC.mobile = false;
    MhyC.platform = null;
    MhyC.location = null;

    MhyC.init = function (b) {

        MhyC.debug(b);
        MhyC.log('[MhyC] Init');
        MhyC.log('[MhyC] Version ' + MhyC.version);
        MhyC.log('[MhyC] PixelRatio: ' + window.devicePixelRatio + ' (' + window.screen.width + 'x' + window.screen.height + ')');

        $.support.cors = true;
        $.ajaxSetup({
            cache: true,
            timeout: 20000
        });
        
        // JQuery Configuration : Ajax Errors
        $(document).ajaxError(function (event, request, settings) {
            return console.log(request.status + ' ' + request.statusText + ' ' + request.responseText + '\n' + settings.url);
        });

        // ontouchstart: enable CSS active pseudo styles in iOS
        document.addEventListener('touchstart', (function () {
        }), false);

        new Fastclick(document.body);

        /**
         * prevent ugly selection of text and elements in your UI
         * prevent UI elements from displaying a context menu on long-tap
         */
        if (MhyC.platform === 'ios') {
            document.documentElement.style.webkitTouchCallout = 'none';
            document.documentElement.style.webkitUserSelect = 'none';
            document.documentElement.style.cursor = 'default';
        }

        /**
         * prevent ugly selection of text and elements in your UI
         * prevent UI elements from displaying a context menu on long-tap
         */
        if (MhyC.platform === 'android') {
            document.addEventListener('longpress', function() {
                return false;
            });
            document.addEventListener('longclick', function() {
                return false;
            });
            document.documentElement.style.cursor = 'default';
        }

    };

    MhyC.checkNet = function () {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

        MhyC.log('[MhyC] Connection type: ' + states[networkState]);

        MhyC.online = networkState != Connection.NONE && navigator.onLine;

    };

    MhyC.getLocation = function () {
        var success = function (p) {
            MhyC.location = p;
            MhyC.log(p.coords.latitude + ' ' + p.coords.longitude);
        };
        var locFail = function (err) {
            MhyC.log('ERROR(' + err.code + '): ' + err.message);
        };
        navigator.geolocation.getCurrentPosition(success, locFail);
    };

    MhyC.getPlatform = function () {
        var platforms = {
            android: /Android/,
            ios: /(iPad)|(iPhone)|(iPod)/,
            blackberry10: /(BB11)/,
            blackberry: /(PlayBook)|(BlackBerry)/,
            windows8: /MSAppHost/,
            windowsphone: /Windows Phone/,
        };
        for (var key in platforms) {
            if (platforms[key].exec(navigator.userAgent)) {
                MhyC.platform = key;
                MhyC.mobile = true;
                break;
            }
        }
    };

    MhyC.debug = function (b) {
        MhyC.debugEnabled = b;
        MhyC.el = $('#debugLog');
        return MhyC.log('[MhyC] Debugging: ' + b);
    };

    MhyC.log = function (text, variables) {
        if (MhyC.debugEnabled) {
            if (variables !== undefined) {
                console.log(text, variables);
            } else {
                console.log(text);
            }
        }
    };

    MhyC.truncateString = function (str, length) {
        var ellipsis, str1;
        str1 = void 0;
        if (str.length <= length) {
            return str;
        }
        ellipsis = '...';
        str1 = str.slice(0, length);
        return str1 + ellipsis;
    };

    MhyC.millisecondsToTime = function (milli) {

        function addZ(n) {
            return (n < 10 ? '0' : '') + n;
        }

        var minutes, seconds;
        seconds = Math.floor((milli / 1000) % 60);
        minutes = Math.floor((milli / (60 * 1000)) % 60);
        return addZ(minutes) + ':' + addZ(seconds);
    };

    MhyC.centerTarget = function (target) {
        var targetNode = document.getElementById(target);
        targetNode.style.marginTop = ((window.innerHeight - targetNode.style.height) / 2) + 'px';
        //console.log('[MhyC] Centertarget at ' + ((window.innerHeight - targetNode.style.height) / 2) + 'px');
        //$(target).css('marginTop', (($(target).parent().innerHeight() - $(target).position().top - $(target).height()) / 2) + 'px');
    };

    MhyC.detectDevice = function(){
        var w = window.screen.width,
            h = window.screen.height,
            diagonalSize = Math.sqrt(w*w+h*h);

        console.log('Diagonal Size: ' + diagonalSize);

        var maxDiagonal = 1280;

        if (diagonalSize >= maxDiagonal) {
            return 'tablet';
        } else {
            return 'smartphone';
        }

    };

    MhyC.isLandscapedTablet = function() {
        if(MhyC.isAndroid2()) {
            return false;
        } else {
            return matchMedia('only screen and (min-width: 768px) and ' +
            '(max-width: 4096px) and (orientation: landscape)').matches;
        }
    };

    MhyC.getPressEvent = function() {
        return MhyC.isIOS() ? 'tap' : 'click';
    };

    MhyC.isIOS = function() {
        return MhyC.mobile && _.isEqual(MhyC.platform, 'ios');
    };

    MhyC.isAndroid = function() {
        return MhyC.mobile && _.isEqual(MhyC.platform, 'android');
    };

    MhyC.start = function(debug) {
        console.log('MhyC Start!!');

        var deferred = $.Deferred();

        var onDeviceReady = function() {

            console.log('Device Ready!!');

            MhyC.init(debug);
            //googleAnalytics.init();

            if (MhyC.mobile === true) {
                navigator.splashscreen.hide();
                MhyC.checkNet();

                /**
                 * Uncomment to activate Push Service.
                 * Set-up MhyC-push.js with your server and API tokens
                 */
                //MhyC.Push.init();
            }

            /**
             * Google Analytics
             */
            // MhyC.Analytics.setTrackingID('UA-XXXXXXXX-X');

            MhyC.log('[MhyC Mobile] Init');

            deferred.resolve();

        };

        MhyC.getPlatform();

        console.log('MhyC.mobile:' + MhyC.mobile);

        if (MhyC.mobile === true) {
            document.addEventListener('online', MhyC.checkNet, false); // Cordova
            document.addEventListener('offline', MhyC.checkNet, false); // Cordova
            document.addEventListener('deviceready', onDeviceReady, false); // This
        }
        else {
            // Polyfill for navigator.notification features to work in browser when debugging
            navigator.notification = {
                alert: function (message) {
                    return alert(message);
                }
            };
            onDeviceReady(true);
        }

        return deferred.promise();
    };

    MhyC.UI = {


        defaultUIOptions: {
            bounce: true,
            mouseWheel: true,
            probeType: 1,
            click: true,
            tap: true
        },

        $spinner: $('#spinner'),

        generateScroll: function (selector, options) {
            require('iscroll');
            var scroll = null;

            var scrolloptions = this.collect(this.defaultUIOptions, options),
                force = false;

            if(!_.isNull(options)){
                force = options.hasOwnProperty('force');
            }

            if (MhyC.mobile && MhyC.platform !== 'ios' && force === false) {
                $(selector).css('overflow', 'scroll');
            } else {
                $(selector).css('overflow', 'hidden');
                /*if (_.isNull(options)) {
                 scroll = new IScroll(selector, this.defaultUIOptions);
                 } else {
                 scroll = new IScroll(selector, options);
                 }*/
                scroll = new IScroll(selector, scrolloptions);
            }

            return scroll;
        },

        collect: function(){
            var ret = {},
                len = arguments.length,
                arg,
                i = 0,
                p;

            for (i = 0; i < len; i++) {
                arg = arguments[i];
                if (typeof arg !== 'object') {
                    continue;
                }
                for (p in arg) {
                    if (arg.hasOwnProperty(p)) {
                        ret[p] = arg[p];
                    }
                }
            }
            return ret;
        },

        createSpinner: function (target) {
            var opts = {
                lines: 13,
                length: 9,
                width: 3,
                radius: 12,
                corners: 1.0,
                rotate: 0,
                trail: 60,
                speed: 1.0,
                direction: 1,
                shadow: true,
                hwaccel: true,
                color: '#fff'
            };


            MhyC.UI.spinnerTarget = document.getElementById(target);
            MhyC.UI.spinner = new Spinner(opts).spin(MhyC.UI.spinnerTarget);
        },

        showSpinner: function () {
            MhyC.UI.spinner.spin(MhyC.UI.spinnerTarget);
        },

        hideSpinner: function () {
            MhyC.UI.spinner.stop();
        },

        addClearButton: function(selector){
            require('add-clear');

            /**
             * Available options:
             *
             * Option	    Default	    Type
             * closeSymbol	✖	        string
             * top	        1	        number
             * right	    4	        number
             * returnFocus	true	    boolean
             * showOnLoad	false	    boolean
             * hideOnBlur	false	    boolean
             * onClear	    null	    function
             */

            $(selector).addClear({
                returnFocus: true,
                showOnLoad: true,
                hideOnBlur: false
            });
        },

        toggleInput: function(v){
            return v?'addClass':'removeClass';
        }

    };

    /**
     * Ensure that you have installed the next cordova plugin in order to work correctly
     *
     *      https://github.com/danwilson/google-analytics-plugin.git
     */

    MhyC.Analytics = {

        UA: null,

        setTrackingID: function (id) {
            if (MhyC.mobile && MhyC.online) {
                this.UA = id;
                analytics.startTrackerWithId(id);
                MhyC.log('[MhyC Analytics] Add tracking ID: ' + id);
            } else {
                MhyC.log('[MhyC Analytics] Warning: No mobile environment detected. Cannot setup tracking ID.');
            }
        },

        trackView: function (viewTitle) {
            if (this.UA === null) {
                MhyC.log('[MhyC Analytics] Warning: No application id found. Set it up first.');
            } else if (MhyC.mobile && MhyC.online) {
                analytics.trackView(viewTitle);
                MhyC.log('[MhyC Analytics] View Tracked: ' + viewTitle);
            }
        },

        trackEvent: function (category, action, label, value) {
            if (this.UA === null) {
                MhyC.log('[MhyC Analytics] Warning: No application id found. Set it up first.');
            } else if (MhyC.mobile && MhyC.online) {
                analytics.trackEvent(category, action, label, value);
                MhyC.log('[MhyC Analytics] Event Tracked: ' + category + '-' + action + '-' + label + '-' + value);
            }
        },

        addCustomDimension: function (key, value, success, error) {
            if (MhyC.mobile && MhyC.online) {
                analytics.addCustomDimension(key, value, success, error);
                MhyC.log('[MhyC Analytics] Add custom dimension: ' + key + ' with value: ' + value);
            } else {
                MhyC.log('[MhyC Analytics] Warning: No mobile environment detected. Cannot add custom dimension.');
            }
        }
    };

    /**
     * Ensure that you have installed the next cordova plugin in order to work correctly
     *
     *      org.jboss.aerogear.cordova.push
     */

    MhyC.Push = {

        successHandler: function (message) {
            MhyC.log('[MhyC Push Service] Registration Success: ' + message);
        },

        errorHandler: function (message) {
            MhyC.log('[MhyC Push Service] Registration Failed: ' + message);

        },

        conf: {
            senderID: '',
            pushServerURL: '',
            variantID: '',
            variantSecret: ''
        },

        onNotification: null,

        setConfig: function (config) {
            this.conf = config;
        },

        setOnNotification: function (e) {
            this.onNotification = e;
        },

        init: function () {

            switch (MhyC.platform){
                case 'ios':
                    this.register();
                    break;
                case 'android':
                    this.register();
                    break;
                default :
                    MhyC.log('[MhyC Push Service] WARNING: No configuration found for platform ' + MhyC.platform);
            }
        },

        register: function (){
            push.register(
                this.successHandler,
                this.errorHandler,
                {
                    badge: 'true',
                    sound: 'true',
                    alert: 'true',
                    ecb: this.onNotification,
                    pushConfig: this.conf
                });
        }
    };

    return MhyC;
});
