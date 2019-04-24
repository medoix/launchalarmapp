angular.module('app.services', [])

  // Race condition found when trying to use $ionicPlatform.ready in app.js and calling register to display id in AppCtrl.
  // Implementing it here as a factory with promises to ensure register function is called before trying to display the id.
  .factory(("ionPlatform"), function( $q ){
      var ready = $q.defer();

      ionic.Platform.ready(function( device ){
          ready.resolve( device );
      });

      return {
          ready: ready.promise
      }
  })

  .directive('cachedimage', function() {
      return {
          restrict: 'E',
          scope: {
              class: '@',
              image: '@',
              transclude: '@',
          },
          link: function($scope, $element, $attr) {
              var inside = angular.element($element.children()[0]);

              $scope.$watch('image', function(newValue, oldValue) {
                  if (newValue) {
                      if (ImgCache.ready) {
                          // Check if image is cached
                          ImgCache.isCached($scope.image, function(path, success) {
                              if (success) {
                                  // Remove spinner
                                  removeLoadingIndicator();

                                  inside.css('background-image', 'url("' + $scope.image + '")');

                                  ImgCache.useCachedBackground(inside);
                              } else {
                                  download();
                              }
                          });
                      } else {
                          download();
                      }
                  }
              });

              function download() {
                  // Add loading indicator
                  if (!$scope.transclude)
                      inside.html('<i class="icon icon-md ion-ios7-reloading"></i>');

                  if (ImgCache.ready) {
                      inside.css('background-image', 'url("' + $scope.image + '")');
                      ImgCache.cacheBackground(inside, function() {
                          // Use cached image
                          removeLoadingIndicator();
                          ImgCache.useCachedBackground(inside);
                      }, function() {
                          console.error('Could not download image (ImgCache).');
                          removeLoadingIndicator();
                      });
                  } else {
                      var img = new Image();
                      img.src = $scope.image;

                      img.onload = function() {
                          removeLoadingIndicator();
                          inside.css('background-image', 'url("' + $scope.image + '")');
                      };

                      img.onerror = function() {
                          console.error('Could not download image.');
                          removeLoadingIndicator();
                      };
                  }
              }

              function removeLoadingIndicator() {
                  if (!$scope.transclude)
                      inside.html('');
              }
          },
          transclude: true,
          template: '<div class="" ng-transclude></div>',
      };
  })

  .directive('imgloadingsec', function ($compile, $parse, $ionicLoading) {
  	return {
  		restrict: 'EA',
  		replace: false,
  		link: function ($scope, element, attrs) {
  			var $element = $(element);
  			if (!attrs.noloading) {
          $ionicLoading.show();
  				// $element.after("<img src='img/loading.gif' class='loading' />");
  				// var $loading = $element.next(".loading");
  				$element.load(function () {
            $ionicLoading.hide();
  					// $loading.remove();
  					$(this).addClass("doneLoading");
  				});
  			} else {
          $ionicLoading.hide();
  				$($element).addClass("doneLoading");
  			}
  		}
  	};
  });
