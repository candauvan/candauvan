angular.module('CDV', ['ngMaterial','mainCtrl','searchService'])
.config(($mdIconProvider, $mdThemingProvider) => {
    // Register the user `avatar` icons
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('red');
  });
