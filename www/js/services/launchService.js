(function () {
	function _LaunchService($q, launchconfig, $http, utils) {

		function getOne(id) {
			var deferred = $q.defer();
			utils.showLoading();

			$http.get(launchconfig.server + '/launch/' + id)
				.success(function (data) {
					utils.hideLoading();
					if (data.error || !data.launches) {
						deferred.reject(data.error);
					}

					deferred.resolve(data.launches);
					// deferred.resolve(data);
				})
				.error(function () {
					utils.hideLoading();
					deferred.reject('error');
				});
			return deferred.promise;
		}

		function getPad(id) {
			var deferred = $q.defer();
			utils.showLoading();

			$http.get(launchconfig.server + '/pad/' + id)
				.success(function (data) {
					utils.hideLoading();
					if (data.error || !data.pads) {
						deferred.reject(data.error);
					}

					deferred.resolve(data.pads);
					// deferred.resolve(data);
				})
				.error(function () {
					utils.hideLoading();
					deferred.reject('error');
				});
			return deferred.promise;
		}

		function getMission(id) {
			var deferred = $q.defer();
			utils.showLoading();

			$http.get(launchconfig.server + '/mission/' + id)
				.success(function (data) {
					utils.hideLoading();
					if (data.error || !data.missions) {
						deferred.reject(data.error);
					}

					deferred.resolve(data.missions);
					// deferred.resolve(data);
				})
				.error(function () {
					utils.hideLoading();
					deferred.reject('error');
				});
			return deferred.promise;
		}

		function getRocket(id) {
			var deferred = $q.defer();
			utils.showLoading();

			$http.get(launchconfig.server + '/rocket/' + id)
				.success(function (data) {
					utils.hideLoading();
					if (data.error || !data.rockets) {
						deferred.reject(data.error);
					}

					deferred.resolve(data.rockets);
					// deferred.resolve(data);
				})
				.error(function () {
					utils.hideLoading();
					deferred.reject('error');
				});
			return deferred.promise;
		}

		function getAll() {
			var deferred = $q.defer();
			// utils.showLoading();

			$http.get(launchconfig.server + '/launch/next/20')
				.success(function (data) {
					// utils.hideLoading();
					console.log(data);
					if (data.error || !data.launches) {
						deferred.reject(data.error);
					}

					deferred.resolve(data.launches);
				})
				.error(function () {
					// utils.hideLoading();
					deferred.reject('error');
				});
			return deferred.promise;
		}

		return {
			one: getOne,
			pad: getPad,
			mission: getMission,
			rocket: getRocket,
			all: getAll
		};
	}

	function _LaunchConfigService() {
		return {
			// server: 'http://push-news.herokuapp.com',
			server: 'https://launchlibrary.net/1.2'
		};
	}

	_LaunchService.$inject = ['$q', 'LaunchConfig', '$http', 'Utils'];

	angular.module('app.services')
		.factory('LaunchService', _LaunchService)
		.service('LaunchConfig', _LaunchConfigService);
})();
