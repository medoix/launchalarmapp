angular.module('app.controllers', [
  'ionic'
])

.controller('AppCtrl', function($scope, ionPlatform, $ionicPlatform, Utils, $cordovaDialogs, UserService, localStorageService, $location, $ionicHistory, $window, $cordovaSplashscreen, moment, $ionicListDelegate, $ionicFilterBar) {
  addanalytics("App Page");
  var push;

  // TEST SETTINGS
  // localStorageService.set('pushToken', '123456789');
  // localStorageService.set("pushNotification", true);
  // $scope.pushNotification = { checked: true };

  ionPlatform.ready.then(function(device) {
    logStorage();
    // Setup Push if enabled
    pushInit(function(){
      setBadge(0);
    });

    // Check if user is authenticated
    if (UserService.authenticated() !== null) {
      $scope.authenticated = true;
    }
    // Check if logged in and set email & userdetails if so.
    var authentication = UserService.authenticated();
    if (!Utils.isUndefinedOrNull(authentication)) {
      // Set user email in scope variable
      $scope.email = authentication.email;
      // Set previous notifications in scope variable
      $scope.notifications = localStorageService.get('pushNotifications');
      // Enable push notifications if the user is logged in but has not registered a push token.
      if(!localStorageService.get('pushToken')){
        console.log('You are logged in and here is no pushToken stored so assuming first time logging in and enabling Push Notifications');
        // TURN ON PUSH NOTIFICATIONS HERE //
        $scope.register();
      }
      var userDetails = UserService.userDetails().then(function(data) {
        console.log('Got latest user details...');
        localStorageService.set('userDetails', data);
        $scope.userdetails = data;
      }, function(err) {
          console.log(err.detail+' '+err.msg);
      });
    }

    // On APP resume (open)
    $ionicPlatform.on('resume', function(){
      // Set previous notifications in scope variable
      $scope.notifications = localStorageService.get('pushNotifications');
      // Setup Push if enabled
      pushInit(function(){
        setBadge(0);
      });
    });

    // Splash screen is set to 20seconds timeout, we hide it now as app logic has finished.
    $cordovaSplashscreen.hide();
  });

  function logStorage(){
    console.log('Push Enabled: '+localStorageService.get('pushNotification'));
    console.log('Push Token: '+localStorageService.get('pushToken'));
    console.log('Authentication: '+JSON.stringify(localStorageService.get('authentication')));
    console.log('User Details: '+JSON.stringify(localStorageService.get('userDetails')));
  }

  function pushInit(success) {
    // Check if pushNotifications is enabled and setup for it
    if (localStorageService.get('pushNotification')) {
      // Set push On
      console.log('Push Notifications: ON');
      $scope.pushNotification = { checked: true };

      push = PushNotification.init({
        android: {
          "senderID": "409161521500", // REPLACE THIS WITH YOURS FROM GCM CONSOLE
          "icon": "img/launchalarm.png" // Icon to use for notifications needs to be stored localy
        },
        ios: {
          alert: "true",
          badge: "true",
          sound: "true"
        }
      });

      if(success){
        success();
      }

      push.on('registration', function(data) {
        // Reset badge count to 0
        setBadge(0);
        var currentToken = localStorageService.get('pushToken');
        var newToken = data.registrationId;
        if(currentToken && newToken != currentToken){
          localStorageService.set("pushToken", data.registrationId);
          $scope.regId = newToken;
          if (ionic.Platform.isIOS()) {
            removeDeviceToken("ios", currentToken);
            storeDeviceToken("ios", newToken);
          }
          if (ionic.Platform.isAndroid()) {
            removeDeviceToken("android", currentToken);
            storeDeviceToken("android", newToken);
          }
        } else {
          localStorageService.set("pushToken", newToken);
          $scope.regId = newToken;
          if (ionic.Platform.isIOS()) {
            storeDeviceToken("ios", newToken);
          }
          if (ionic.Platform.isAndroid()) {
            storeDeviceToken("android", newToken);
          }
        }
      });

      push.on('notification', function(data) {
        // console.log(data.message);
        // console.log(data.title);
        // console.log(data.count);
        // console.log(data.sound);
        // console.log(data.image);
        // console.log(data.additionalData);
        // Utils.showAlert('Foreground: '+data.additionalData.foreground);
        // Utils.showAlert('Coldstart: '+data.additionalData.coldstart);
        var date = new Date();
        var noticeDate = moment(date).format("MMM DD HH:MM");
        var notification = {
          date: noticeDate,
          msg: data.message,
        };

        saveNotification(notification);

        if (ionic.Platform.isAndroid()) {
          handleAndroid(data);
        } else if (ionic.Platform.isIOS()) {
          handleIOS(data);
        };

        // Set badge count if in background and count number set
        if(!data.additionalData.foreground){
          if(data.count){
            setBadge(data.count);
          }
        };
        push.finish(function() {
          console.log("processing of push data is finished");
        });
      });

      push.on('error', function(e) {
        console.log(e.message);
      });
    } else {
      $scope.pushNotification = { checked: false };
    }
  };

  function setBadge(num){
    // Clear badge count
    push.setApplicationIconBadgeNumber(function() {
      console.log('success');
    }, function() {
      console.log('error');
    }, num);
  };

  function saveNotification(data)
  {
      var a = [];
      // Parse the serialized data back into an aray of objects
      if(!localStorageService.get('pushNotifications')){
        a = [];
      } else {
        a = JSON.parse(localStorageService.get('pushNotifications'));
      }
      // Push the new data (whether it be an object or anything else) onto the array
      a.push(data);
      // Alert the array value
      console.log('Saving Notification: '+JSON.stringify(a));  // Should be something like [Object array]
      // Re-serialize the array back into a string and store it in localStorage
      localStorageService.set('pushNotifications', JSON.stringify(a));
      $scope.notifications = localStorageService.get('pushNotifications');
  }

  // Register
  $scope.register = function() {
    console.log('Register running...');

    if (!localStorageService.get('pushToken')) {
      localStorageService.set('pushNotification', true);
      pushInit();
    } else {
      $scope.regId = localStorageService.get('pushToken');
      if (ionic.Platform.isIOS()) {
        storeDeviceToken("ios", $scope.regId);
      }
      if (ionic.Platform.isAndroid()) {
        storeDeviceToken("android", $scope.regId);
      }
    }
  }

  $scope.unregister = function(success) {
		console.log("Unregister Running...");
    // removeDeviceToken(type, $scope.regId);
    var type = '';
    if (ionic.Platform.isAndroid()) {
      type = 'android';
    } else if (ionic.Platform.isIOS()) {
      type = 'ios';
    }
    removeDeviceToken(type, $scope.regId);
    if(success){
      success();
    }

		// push.unregister(function() {
    //   var type = '';
    //   if (ionic.Platform.isAndroid()) {
    //     type = 'android';
    //   } else if (ionic.Platform.isIOS()) {
    //     type = 'ios';
    //   }
    //   removeDeviceToken(type, $scope.regId);
    //   if(success){
    //     success();
    //   }
		// }, function(err) {
		// 	console.log("Unregister error " + err)
		// 	Utils.showAlert('Push unregistration failed: ' + err.msg);
		// 	$scope.pushNotification = { checked: true };
		// });
  }

  $scope.userLogout = function() {
    console.log('Logging Out...');
    // Unregister on logout only if pushNotification is true otherwise already unregistered.
    if(localStorageService.get('pushNotification')){
      $scope.unregister(function(){
        UserService.logout();
        $scope.authenticated = false;
      });
    } else {
      UserService.logout();
      $scope.authenticated = false;
    }
    // Disable <- Back button
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    // Go to launches after logout
    $location.url('/app/launches');
  };

  // Android Notification Received Handler
  function handleAndroid(notification) {
    if (data.additionalData.foreground) {
      // DO LOGIC CHECKS WHEN IN FOREGROUND ///
      if(data.message && data.additionalData.messageFrom){
        $cordovaDialogs.alert(data.message, data.additionalData.messageFrom);
      } else {
        $cordovaDialogs.alert(data.message, "Push Notification Received");
      }
    }
    // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
    // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
    // the data in this situation.

    // DO LOGIC CHECKS WHEN IN BACKGROUND ///
    // Receved when app was completeley closed
    else if(data.additionalData.coldstart){
        $cordovaDialogs.alert(data.message, data.additionalData.messageFrom);
    }
    else if(data.additionalData.foreground){
    	// Received when in background but app was allready running
    	$cordovaDialogs.alert(data.message, data.additionalData.messageFrom);
    }
  }

  /// DO LOGIC HERE TO BASED ON OTHER DATA SET IN PUSH LIKE STREAM LINK ETC ///

  // IOS Notification Received Handler
  function handleIOS(data){
    if (data.additionalData.foreground) {
      // Play custom audio if a sound specified.
      // if(data.sound){
      //   var mediaSrc = $cordovaMedia.newMedia(data.sound);
      //   mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
      // }

      // DO LOGIC CHECKS WHEN IN FOREGROUND ///
      if(data.message && data.additionalData.messageFrom){
      	$cordovaDialogs.alert(data.message, data.additionalData.messageFrom);
      } else {
				$cordovaDialogs.alert(data.message, "Push Notification Received");
			}
    }
    // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
    // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
    // the data in this situation.

    // DO LOGIC CHECKS WHEN IN BACKGROUND ///
    // Receved when app was completeley closed
    else if(data.additionalData.coldstart){
        $cordovaDialogs.alert(data.message, data.additionalData.messageFrom);
    }
    else if(data.additionalData.foreground){
    	// Received when in background but app was allready running
    	$cordovaDialogs.alert(data.message, data.additionalData.messageFrom);
    }
  }

  // Stores the device token in a db
  function storeDeviceToken(type, id) {
    console.log('Storing Device Token...');
    var user = {
      type: type,
      deviceId: id,
    };

    UserService.registerDevice(Utils.serializeObj(user)).then(function(data) {
      localStorageService.set("pushNotification", true);
      $scope.pushNotification = { checked: true };
    }, function(err) {
      console.log(err.detail+' '+err.msg);
      if (err.msg && err.msg === "Device ID already registered") {
        localStorageService.set("pushNotification", true);
        $scope.pushNotification = { checked: true };
      } else {
        $scope.pushNotification = { checked: false };
        localStorageService.remove('pushNotification');
        Utils.showAlert('Failed to register device token ' + err.detail + ' - ' + err.msg);
      }
    });
  }

  // Removes the device token from the db
  function removeDeviceToken(type, id) {
    console.log('Removing Device Token...');
    var user = {
      type: type,
      deviceId: id,
    };
    UserService.removeDevice(Utils.serializeObj(user)).then(function() {
      localStorageService.remove("pushNotification");
      $scope.pushNotification = { checked: false };
    }, function(err) {
      if (err.msg && err.msg === "Device ID not currently registered") {
        localStorageService.remove("pushNotification");
        $scope.pushNotification = { checked: false };
      } else {
        $scope.pushNotification = { checked: true };
        localStorageService.set('pushNotification', true);
        Utils.showAlert('Failed to unregister device token ' + err.detail + ' - ' + err.msg);
      }
    });
  }

  $scope.imageSize = function(url, size) {
    var n = url.lastIndexOf("_");
    var beforeUnderscore = url.substring(0, n);
    var afterUnderscore = url.substring(n + 1);
    var suffix = afterUnderscore.split('.')[1];

    return beforeUnderscore + "_" + size + "." + suffix;
  }

  $scope.imageMap = function(latlong, zoom) {
    // var n = latlong.lastIndexOf("x");
    // var before = latlong.substring(0, n);
    // beforeX = before.replace(/\d+\.\d+/g, function(match) {
    //   return Number(match).toFixed(4);
    // });
    // console.log('Converting: ' + before + ' To: ' + beforeX);
    // // beforeX = +(Math.round(beforeX + "e+" + 4)  + "e-" + 4)
    // var after = latlong.substring(n+1);
    // afterX = after.replace(/\d+\.\d+/g, function(match) {
    // 	return Number(match).toFixed(4);
    // });
    // console.log('Converting: ' + after + ' To: ' + afterX);
    // afterX = +(Math.round(afterX + "e+" + 4)  + "e-" + 4)
    return "https://maps.googleapis.com/maps/api/staticmap?center=" + latlong + "&zoom=" + zoom + "&size=400x550&maptype=hybrid";
  }

  $scope.share = function(item) {
    // Close option buttons in list view
    $ionicListDelegate.closeOptionButtons();

    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
      message: 'Launch Alarm: ' + item.name + ' will be preparing for takeoff on ' + item.net, // not supported on some apps (Facebook, Instagram)
      url: item.vidURLs[0],
      chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    }

    var onSuccess = function(result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    }

    var onError = function(msg) {
      console.log("Sharing failed with message: " + msg);
      Utils.showAlert("Sharing failed with message: " + msg);
    }

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
  }

  $scope.linkExternal = function(url) {
    console.log(url);
    // Close option buttons in list view
    $ionicListDelegate.closeOptionButtons();
    // if ($event.currentTarget && $event.currentTarget.attributes['data-external'])
    window.open(url, '_system', 'location=yes');
  }

  var filterBarInstance;
  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.items,
      update: function (filteredItems, filterText) {
        $scope.items = filteredItems;
        if (filterText) {
          console.log(filterText);
        }
      }
    });
  };
})

.controller('AboutCtrl', function($scope) {
  addanalytics("About Page");
})

.controller('AccessCtrl', function($scope) {
  addanalytics("Access Page");
})

.controller('OfflineCtrl', function($scope, $ionicLoading) {
  addanalytics("Offline Page");
  $ionicLoading.hide();
});
