(function () {
  'use strict';

  var serviceId = 'Utils';

	angular.module('app.services')
    .factory(serviceId,
      ['$ionicHistory', '$ionicLoading', '$timeout', '$ionicPopup', Utils]);

  function Utils($ionicHistory, $ionicLoading, $timeout, $ionicPopup) {
    var UtilsSrv = {
      debug: false,
      config: null,
      clearCachedPreviousView: clearCachedPreviousView,
      clearCachedView: clearCachedView,
      showLoading: showLoading,
      hideLoading: hideLoading,
      showAlert: showAlert,
      confirmAndRun: confirmAndRun,
      goBack: goBack,
      parseString: parseString,
      isUndefinedOrNull: isUndefinedOrNull,
      isEmpty: isEmpty,
      serializeObj: serializeObj,
      formValidation: formValidation
    };

    return UtilsSrv;

    function clearCachedPreviousView() {
      var backView = $ionicHistory.backView();
      return $ionicHistory.clearCache([backView ? backView.stateId:'']);
    }

    function clearCachedView(stateIds) {// stateIds should be array
      return $ionicHistory.clearCache(stateIds);
    }

    function showLoading() {
      $ionicLoading.show({
        // template: 'Loading...'
        template: '<ion-spinner class="spinner-positive"></ion-spinner>'
      });
  		$timeout(function () {
  			$ionicLoading.hide();
  		}, 5000);
    }

    function hideLoading() {
      $ionicLoading.hide();
    }

    function showAlert(caption, template) {
      console.log(caption);
      $ionicLoading.hide();
      return $ionicPopup.alert({
          title: caption,
          template: template
      });
		}

    function confirmAndRun(captionRes, textRes, onConfirm) {
      $ionicLoading.hide();
      var popup = $ionicPopup.confirm({
          title: captionRes,
          template: textRes,
          okText: "OK",
          cancelText: "Cancel"
      });
      popup.then(function (res) {
          if (res) {
              onConfirm();
          }
      });
		}

    function goBack() {
      $ionicHistory.goBack();
    }

    function parseString(object) {
      if(object.__type === 'Date'){
        return new Date(object.iso);
      }else{
        return object || '';
      }
    }

    function isUndefinedOrNull(obj) {
      return !angular.isDefined(obj) || obj===null;
    }

    function isEmpty(object) {
      return angular.equals({}, object);
    }

    function serializeObj(object) {
      var result = [];

      for (var property in object) {
        result.push(encodeURIComponent(property) + '=' + encodeURIComponent(object[property]));
      }

      return result.join("&");
    }
    function formValidation(allvalidation) {
    	var isvalid2 = true;
    	for (var i = 0; i < allvalidation.length; i++) {
    		if (allvalidation[i].field == "" || !allvalidation[i].field) {
    			allvalidation[i].validation = "ng-dirty";
    			isvalid2 = false;
    		} else {
    			allvalidation[i].validation = "";
    		}
    	}
    	return isvalid2;
    }
  }
})();
