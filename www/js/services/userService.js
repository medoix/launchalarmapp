(function () {
	function _UserService($q, userconfig, $http, localStorageService, utils) {

		var authentication;

		function loginUser(post) {
			var deferred = $q.defer();
			utils.showLoading();

			$http.post(userconfig.server + '/v1/account/login', post)
				.success(function (data) {
					utils.hideLoading();
					localStorageService.set('authentication', data);
					deferred.resolve(data);
				})
				.error(function (err) {
					utils.hideLoading();
					deferred.reject(err);
					utils.showAlert(err.err,err.msg);
				});
			return deferred.promise;
		}

		function logoutUser() {
			localStorageService.remove('authentication');
			localStorageService.remove('userDetails');
			authentication = null;
		}

		function signupUser(post) {
			var deferred = $q.defer();
			utils.showLoading();

			$http.post(userconfig.server + '/v1/account/signup', post)
			.success(function (response) {
				utils.hideLoading();
				authentication = response;
				deferred.resolve(response);
			})
			.error(function (err) {
				utils.hideLoading();
				deferred.reject(err);
				utils.showAlert(err.err,err.msg);
			});
			return deferred.promise;
		}

		function forgotpassword(email, callback, err) {
			var deferred = $q.defer();
			utils.showLoading();

			$http.get(userconfig.server + '/v1/account/forgotPassword', email)
      .success(function (response) {
				utils.hideLoading();
				authentication = response;
				deferred.resolve(response);
			})
			.error(function (err) {
				utils.hideLoading();
				deferred.reject(err);
				utils.showAlert(err.err,err.msg);
			});
			return deferred.promise;
    }

		function isAuthenticated() {
			if(localStorageService.get('authentication')){
				authentication = localStorageService.get('authentication');
			} else {
				authentication = null;
			}
			return authentication;
		}

		function userDetails() {
			var deferred = $q.defer();

			$http({
				url: userconfig.server + '/v1/account/user',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'authentication': localStorageService.get('authentication').jwt
				}
			})
			.success(function (data, status) {
				deferred.resolve(data, status);
			})
			.error(function (data, status) {
				deferred.reject(data, status);
			});
			return deferred.promise;
		}

		function registerDevice(putData) {
			var deferred = $q.defer();

			$http({
        url: userconfig.server + '/v1/device/deviceCreate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
					'authentication': localStorageService.get('authentication').jwt
        },
        data: putData
      })
      .success(function (data, status) {
				deferred.resolve(data, status);
      })
      .error(function (data, status) {
				deferred.reject(data, status);
      });

			return deferred.promise;
		}

		function removeDevice(putData) {
			var deferred = $q.defer();

			$http({
        url: userconfig.server + '/v1/device/deviceRemove',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
					'authentication': localStorageService.get('authentication').jwt
        },
				data: putData
      })
      .success(function (data) {
				deferred.resolve(data);
      })
      .error(function (data) {
				deferred.reject(data);
      });

			return deferred.promise;
		}

		return {
			login: loginUser,
			logout: logoutUser,
			forgotpassword: forgotpassword,
			authenticated: isAuthenticated,
			signup: signupUser,
			userDetails: userDetails,
			registerDevice: registerDevice,
			removeDevice: removeDevice
		};
	}

	function _UserConfigService() {
		return {
			server: 'https://launchalarm.com',
		};
	}

	_UserService.$inject = ['$q', 'UserConfig', '$http', 'localStorageService', 'Utils'];

	angular.module('app.services')
		.factory('UserService', _UserService)
		.service('UserConfig', _UserConfigService);
})();
