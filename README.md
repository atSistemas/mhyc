# MhyC - Mobile Hybreed Core

The Mobile Hybreed Core library it's a function's suite designed to be used on mobile hybrid applications, simplifying the tasks that has to be performed on almost every hybird mobile app. Also includes methods to control the app's analytics through Google Analytics and control methods to implement the push notifications.

This library includes some useful functions to develop a mobile application. This functions are:

* init: Initialize the library parameters.
* start: Sets the environment to perform different actions over native device.
* checkNet: Checks if the device has network connection
* getLocation: Gets the device's location.
* getPlatform: Gets the device platform (Android, iOS, Windows...)
* millisecondsToTime: Converts a date on milliseconds to a "normal" date.
* detectDevice: Returns if the device it's a phone or a tablet.
* isLandscapedTablet: Detects if the device it's a landscape tablet.
* getPressEvent: Gets the type of press event, depending on de OS.
* isIOS: Checks if the device is iOS.
* isAndroid: Checks if the device is Android.
* UI
    * generateScroll: Sets a view scroll, using iScroll library if necessary.
    * createSpinner: Creates a spinner to be used through the application on loading times.
    * showSpinner: Shows the created spinner.
    * hideSpinner: Hides the created spinner.
    * addClearButton: Creates a X to show on forms, and clear it.
    * toggleInput: Adds or removes a CSS class.
* Analytics
    * setTrackingID: Sets the Google Analytics tracking ID.
    * trackView: Tracks a view.
    * trackEvent: Tracks an event.
    * addCustomDimension: Adds a custom metric.
* Push
    * setOnNotification: Receives a function that sets the behaviour when a push notification arrives.
    * setConfig: Sets the configuration parameters for push notifications.
    * init: Initialize the application push notifications settings, with the parameters set on the configuration method.

