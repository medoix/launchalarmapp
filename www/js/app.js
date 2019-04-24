var googleanalyticsid = 'UA-81669759-2';

function addanalytics(screen) {
	if (window.analytics) {
		window.analytics.startTrackerWithId(googleanalyticsid);
		if (screen) {
			window.analytics.trackView(screen);
			window.analytics.trackEvent("Page Load", screen, screen, 1);
		} else {
			window.analytics.setUserId(user.id);
			window.analytics.trackEvent("User ID Tracking", "User ID Tracking", "Userid", user.id);
		}
	}
}

angular.module('app', [
	'ionic',
	'app.controllers',
	'app.services',
	'LocalStorageModule',
	'angularMoment',
	'ngCordova',
	'jett.ionic.filter.bar'
	])

	.run(function ($rootScope, $state) {
		ionic.Platform.ready(function () {
			// Google Analytics Setup
			$rootScope.$on('$stateChangeSuccess', function () {
        if(typeof analytics !== undefined) {
          window.analytics.startTrackerWithId("UA-81669759-2");
          // window.analytics.trackView($state.current.name);
        } else {
          console.log("Google Analytics Unavailable");
        }
      });

			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}

			// Set app statusbar color setting
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				// these will not work in ionic view but will work once compiled
				StatusBar.styleLightContent();
			}

			// Send to login page if user is not logged in and not on the login page
			// $rootScope.$on('$stateChangeStart', function (event, toState) {
			// 	if (!UserService.current() && toState.name !== 'login') {
			// 		$state.go('login');
			// 	}
			// });
		});
	})

	.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider, localStorageServiceProvider) {
		$ionicConfigProvider.navBar.alignTitle("center");
		localStorageServiceProvider.setPrefix('launchalarm');

		//You can override the config such as the following

		/*
		$ionicFilterBarConfigProvider.theme('calm');
		$ionicFilterBarConfigProvider.clear('ion-close');
		$ionicFilterBarConfigProvider.search('ion-search');
		$ionicFilterBarConfigProvider.backdrop(false);
		$ionicFilterBarConfigProvider.transition('vertical');
		$ionicFilterBarConfigProvider.placeholder('Filter');
		*/

		$stateProvider
			.state('app', {
				url: '/app',
				abstract: true,
				cache: false,
				templateUrl: 'templates/menu.html',
				controller: 'AppCtrl'
			})
			.state('app.about', {
				url: '/about',
				views: {
					'menuContent': {
						templateUrl: 'templates/about.html',
						controller: 'AboutCtrl'
					}
				}
			})
			.state('app.launches', {
				url: '/launches',
				views: {
					'menuContent': {
						templateUrl: 'templates/launches/launches.html',
						controller: 'LaunchesCtrl'
					}
				}
			})
			.state('app.details', {
				url: '/launches/:id',
				views: {
					'menuContent': {
						templateUrl: 'templates/launches/details.html',
						controller: 'DetailsCtrl'
					}
				}
			})
			.state('app.pad', {
				url: '/pad/:id',
				views: {
					'menuContent': {
						templateUrl: 'templates/launches/pad.html',
						controller: 'PadCtrl'
					}
				}
			})
			.state('app.mission', {
				url: '/mission/:id',
				views: {
					'menuContent': {
						templateUrl: 'templates/launches/mission.html',
						controller: 'MissionCtrl'
					}
				}
			})
			.state('app.rocket', {
				url: '/rocket/:id',
				views: {
					'menuContent': {
						templateUrl: 'templates/launches/rocket.html',
						controller: 'RocketCtrl'
					}
				}
			})
			.state('app.settings', {
				url: '/settings',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/users/settings.html',
						controller: 'SettingsCtrl'
					}
				}
			})
			.state('access', {
				url: '/access',
				abstract: true,
				templateUrl: 'templates/access.html',
				controller: 'AccessCtrl'
			})
			.state('access.login', {
				url: '/login',
				views: {
					'content': {
						templateUrl: 'templates/users/login.html',
						controller: 'LoginCtrl'
					}
				}
			})
			.state('access.forgotpassword', {
				url: '/forgotpassword',
				views: {
					'content': {
						templateUrl: 'templates/users/forgotpassword.html',
						controller: 'ForgotPasswordCtrl'
					}
				}
			})
			.state('access.password-reset', {
				url: '/password-reset',
				views: {
					'content': {
						templateUrl: 'templates/users/password-reset.html',
						controller: 'SettingsCtrl'
					}
				}
			})
			.state('access.offline', {
				url: '/offline',
				views: {
					'content': {
						templateUrl: 'templates/offline.html',
						controller: "OfflineCtrl"
					}
				}
			});
			// if none of the above states are matched, use this as the fallback
			$urlRouterProvider.otherwise('/app/launches');
	});
