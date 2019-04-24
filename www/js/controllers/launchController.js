angular.module('app.controllers')

  .controller('LaunchesCtrl', ['$scope', '$location', 'LaunchService', 'Utils', function ($scope, $location, LaunchService, Utils) {
    addanalytics('Launches Page');

    Utils.showLoading();
    LaunchService.all().then(function (launches) {
      Utils.hideLoading();
      $scope.launches = launches;
    }, function (err) {
    		$location.url("/access/offline");
    // ,function(err) {
    //   utils.showAlert(err.err,err.msg);
    //   console.log(err);
    });

    $scope.refresh = function () {
      addanalytics('Refreshing List');
      LaunchService.all().then(function (launches) {
        $scope.launches = launches;
        $scope.$broadcast('scroll.refreshComplete');
      }, function (err) {
      		$location.url("/access/offline");
      });
    };

  }])

  .controller('DetailsCtrl', function ($scope, $state, LaunchService, $ionicModal, $ionicListDelegate) {
    addanalytics('Details Page');
    $scope.modaldata = {};
    var loadModal = function (type) {
      return $ionicModal.fromTemplateUrl('templates/launches/modal-'+type+'.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
    };
    $scope.showModal = function (type, data) {
      // console.log('Modal Data: ' + data);
      if(!data){
        console.log('No data passed to modal so stopping.');
        return;
      }
      loadModal(type).then(function () {
        addanalytics(type + ' Modal');
        $scope.modal.show();
      });
      $scope.modaldata = data;
      // console.log('$scope Data: ' + $scope.modaldata);
    };

    $scope.closeModal = function () {
      $scope.modal.remove()
        .then(function () {
  				$scope.modal = null;
  			});
    };

    // Close option buttons in list view
    $ionicListDelegate.closeOptionButtons();
    var id = $state.params.id;
    // $scope.showModal('loading', './img/login-bg.jpg');
    LaunchService.one(id).then(function (launches) {
      $scope.launches = launches;
      console.log(launches);
      // $scope.closeModal();
    }, function (err) {
        $location.url("/access/offline");
        utils.showAlert(err.err,err.msg);
    });
  })

  .controller('PadCtrl', function ($scope, $state, LaunchService) {
    addanalytics('Pad Page');
    var id = $state.params.id;
    LaunchService.pad(id).then(function (pads) {
      $scope.pads = pads;
      console.log(pads);
    }, function (err) {
        $location.url("/access/offline");
    });
  })

  .controller('MissionCtrl', function ($scope, $state, LaunchService) {
    addanalytics('Mission Page');
    var id = $state.params.id;
    LaunchService.mission(id).then(function (missions) {
      $scope.missions = missions;
      console.log(missions);
    }, function (err) {
        $location.url("/access/offline");
    });
  })

  .controller('RocketCtrl', function ($scope, $state, LaunchService) {
    addanalytics('Rocket Page');
    var id = $state.params.id;
    LaunchService.rocket(id).then(function (rockets) {
      $scope.rockets = rockets;
      console.log(rockets);
    }, function (err) {
        $location.url("/access/offline");
    });
  })
