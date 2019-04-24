angular.module('app.controllers')

  .controller('SettingsCtrl', function ($scope, $state, UserService, Utils, localStorageService, $ionicHistory, $location) {
    addanalytics('Settings Page');

    var authentication = UserService.authenticated();
    if (!Utils.isUndefinedOrNull(authentication)) {
      $scope.email = authentication.email;
      // var details = UserService.userDetails();
      console.log('Logged in as: '+JSON.stringify(authentication));
      // console.log('User Details: '+JSON.stringify(details));
  	} else {
  		console.log('Not logged in.');
      // Disable <- Back button
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      // Go to login tab
      $location.url('/access/login');
  	}

    $scope.pushNotificationChange = function() {
      console.log('Push Notification Change', $scope.pushNotification.checked);
      if ($scope.pushNotification.checked) {
        $scope.$parent.register();
      } else {
        $scope.$parent.unregister();
      }
    };

  	$scope.userPasswordReset = function() {
  		UserService.resetPassword().then(function(response) {
  			console.log('password reset succcess '+JSON.stringify(response));
  		}, function(err) {
  			console.log('password reset error '+JSON.stringify(err));
  		});
  	};

  	// $scope.userDetails = function() {
  	// 	console.log('Details', user.details);
  	// 	console.log('custom detail ',user.get('lastLogin'));
  	// };
  })

  .controller('ForgotPasswordCtrl', function ($scope, $ionicLoading, UserService, $location) {
  	// addanalytics("Forgot password");
  	// var forgotpasswordcallback = function (data, status) {
  	// 	console.log(data);
  	// 	$ionicLoading.hide();
  	// 	if (data == "true") {
  	// 		var myPopup = $ionicPopup.show({
  	// 			template: '<p class="text-center">Please check your email, an email has been send to your id.</p>',
  	// 			title: 'Email sent!',
  	// 			scope: $scope,
    //
  	// 		});
  	// 		$timeout(function () {
  	// 			myPopup.close(); //close the popup after 3 seconds for some reason
  	// 			$location.url("/access/login");
  	// 		}, 2000);
    //
  	// 	} else {
  	// 		var myPopup = $ionicPopup.show({
  	// 			template: '<p class="text-center">Not a valid email.</p>',
  	// 			title: 'Oops! Try again.',
  	// 			scope: $scope,
    //
  	// 		});
  	// 		$timeout(function () {
  	// 			myPopup.close(); //close the popup after 3 seconds for some reason
  	// 		}, 2000);
  	// 	}
  	// }
  	$scope.forgotpassword = function (email) {
  		UserService.forgotpassword(email, function (err) {
  			$location.url("/access/offline");
  		});
  	}
  })

  .controller('LoginCtrl', function ($scope, $state, UserService, $ionicHistory, $ionicLoading, Utils, $location) {
    addanalytics('Login Page');

    $scope.logindata = {};
    // $.jStorage.flush();
    // $scope.logindata.email = true;
    $scope.signin = {};
    $scope.signup = {};

  	//***** tabchange ****
  	$scope.tab = 'signin';
  	$scope.classa = 'active';
  	$scope.classb = '';

  	$scope.tabchange = function (tab, a) {
  		$scope.tab = tab;
  		if (a == 1) {
  			$scope.classa = "active";
  			$scope.classb = '';
  		} else {
  			$scope.classa = '';
  			$scope.classb = "active";
  		}
  	};
  	//****** End ******

    // var loginstatus = false;
    //
  	// function internetaccess(toState) {
  	// 	if (navigator) {
  	// 		if (navigator.onLine != true) {
  	// 			onoffline = false;
  	// 			$location.url("/access/offline");
  	// 		} else {
  	// 			onoffline = true;
  	// 		}
  	// 	}
  	// }
  	// $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
  	// 	internetaccess(toState);
  	// });
  	// window.addEventListener("offline", function (e) {
  	// 	internetaccess();
  	// })
  	// window.addEventListener("online", function (e) {
  	// 	internetaccess();
  	// })

    $scope.launches = function () {
      $location.url("/app/launches");
    }

    // Disabled for now as back end functionality does not support it.
    // $scope.forgotpass = function () {
    //   $location.url("/access/forgotpassword");
    // }

    $scope.signinsubmit = function (signin) {
  		// $ionicLoading.show();
  		$scope.allvalidation = [{
  			field: $scope.signin.email,
  			validation: ""
          }, {
  			field: $scope.signin.password,
  			validation: ""
          }];
  		var check = Utils.formValidation($scope.allvalidation);
  		if (check) {
        var details = {
          'email':signin.email,
          'pw':signin.password
        }
        UserService.login(details).then(function(response) {
          console.log('User Login Successfully!', response);
          // SET AUTH FROM RESPONSE //
          authentication = response;
          // GO TO LAUNCH LIST //
          $location.url("/app/launches");
        }, function(err) {
          console.log('User Login Failed: '+JSON.stringify(err));
          Utils.showAlert(err.msg, err.details);
        });
  		} else {
        Utils.showAlert("Form Incomplete", "All fields are required.");
  			// $ionicLoading.hide();
  		}
  	}

    $scope.signupsubmit = function (signup) {
      $ionicLoading.show();
      $scope.allvalidation = [{
        field: $scope.signup.email,
        validation: ""
          }, {
        // field: $scope.signup.name,
        // validation: ""
        //   }, {
        // field: $scope.signup.dob,
        // validation: ""
        //   }, {
        field: $scope.signup.password,
        validation: ""
          }, {
        field: $scope.signup.passwordconfirm,
        validaton: ""
          }];
      // Check all fields are valid and have an entry
      var check = Utils.formValidation($scope.allvalidation);
      if (check) {
        // Check password and password confirm match
        if($scope.signup.password != $scope.signup.passwordconfirm){
            Utils.showAlert("Form Incomplete", "Password and Confirm Password do not match.");
            return;
        }
        var details = {
          // 'id':username,
          'email':$scope.signup.email,
          'pw':$scope.signup.password
        }
        //this will work one time
        UserService.signup(details).then(function(newUser) {
          console.log('User Signup Success: '+JSON.stringify(newUser));
          //what's the user ob like now?
          authentication = UserService.authenticated();
          console.log('User Signup Logged In? ',authentication);
          // Go to login tab now
          $scope.tabchange('signin',1);
          // Show register success message
          Utils.showAlert("Signup Success", "Account successfully created. Please confirm your email address before you login.");
        }, function(err) {
          console.log('User Singup Failed: '+JSON.stringify(err));
          Utils.showAlert(err.msg, err.details);
        });
      } else {
        Utils.showAlert("Form Incomplete", "All fields are required.");
        $ionicLoading.hide();
      }
    }

    // signup success popup
    // $scope.showPopupsignupsuccess = function () {
    //   var myPopup = $ionicPopup.show({
    //     template: '<p class="text-center">Successfully registered, please confirm your email before attempting to login.</p>',
    //     title: 'Congrats!',
    //     scope: $scope,
    //   });
    //   $timeout(function () {
    //     myPopup.close(); //close the popup after 3 seconds
    //   }, 2000);
    // };
    // $scope.showPopupfailure = function () {
    //   var myPopup = $ionicPopup.show({
    //     template: '<p class="text-center">Something has gone wrong! Please try again.</p>',
    //     title: 'Oops!',
    //     scope: $scope,
    //
    //   });
    //   $timeout(function () {
    //     myPopup.close(); //close the popup after 3 seconds for some reason
    //   }, 2000);
    // };
  })
