
window.oak.disableZoom()

window.reload = function () {
  window.oak.reload()
}

// window.load = function () {
//   window.oak.ready()
// }



window.oak.disableZoom()

window.reload = function () {
  window.oak.reload()
}

var app = window.angular
  .module('audioApp', ['ngMaterial'])
  .constant('os', window.os)
  .constant('oak', window.oak)
  .constant('_', window.lodash)

  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self'])
  })
app.controller('appController', function AppController ($http, $window, $log, $scope, $rootScope, $timeout, $sce, $httpParamSerializerJQLike, $filter, _, oak) {

  // ##################################### ripples begin #####################################
  $scope.untapped = true
  $scope.cursor = {
    x: 0, y: 0
  }
  $scope.showCursor = false
  $scope.cursorTimeout = 10000
  var cursorPromises = []
  var timer

  // main window touches. this will log all tapped items, and also add the UI ripple of the tapped area
  $scope.ripples = []

  $scope.mouseMoved = function ({ pageX: x, pageY: y }) {
    // dont show cursor if the settings has `false` or 0 as the cursorTimeout
    if ($scope.cursorTimeout) {
      resetCursorTimer()
      $scope.cursor = { x, y }
    }
  }
  var clearCursorPromises = function () {
    cursorPromises.forEach(function (timeout) {
      $timeout.cancel(timeout)
    })
    cursorPromises = []
  }
  var resetCursorTimer = function () {
    clearCursorPromises()
    $scope.showCursor = true
    timer = $timeout(function () {
      $scope.showCursor = false
    }, $scope.cursorTimeout)
    cursorPromises.push(timer)
  }

  $scope.$on('$destroy', function () {
    clearCursorPromises()
  })

  $scope.tapped = function ({ pageX, pageY }) {
    let id = $window.uuid.v4()
    $scope.showCursor = false
    $scope.ripples.push({
      x: pageX, y: pageY, id
    })
    $timeout(function () {
      _.remove($scope.ripples, { id })
    }, 500)

    if ($scope.untapped) {
      $scope.untapped = false
    }
  }
  // ##################################### ripples end #####################################



  $scope.mixers = []
  $scope.installProgress = ''
  $scope.selectedCard = null

  $scope.setAlsaCard = function (card) {
    $scope.selectedCard = {
      card: card,
      mixers: $scope.getMixers(card)
    }
    if (card.toLowerCase() !== 'no card selected') {
      var url = '/setAlsaCard/' + card
      $http({
        method: 'GET',
        url: url
      }).then(function (success) {
        $log.info('setAlsaCard Success: ', success)
      }, function (error) {
        $log.info('setAlsaCard Error: ', error)
      })
    }
  }
  $scope.setAlsaCardConfiguration = function (mixer) {
    var json = angular.toJson(mixer.setting)
    var url = '/setAlsaCardConfiguration/' + json
    $http({
      method: 'GET',
      url: url
    }).then(function (success) {
      $log.info('setAlsaCardConfiguration Success: ', success)
    }, function (error) {
      $log.info('setAlsaCardConfiguration Error: ', error)
    })
  }
  $scope.getMixers = function (card) {
    let mixers = []
    for (var i in $scope.mixers) {
      var id = $scope.mixers[i].mixer_id
      if (id.indexOf(card) > -1) {
        let mixer = {
          name: id.split(':')[1],
          setting: $scope.mixers[i]
        }
        mixers.push(mixer)
      }
    }
    return mixers
  }

  $scope.initApp = function () {
    // init app here
    $http({
      method: 'GET',
      url: '/getAudioInfo'
    }).then(function (success) {
      $log.info('Success: ', success)
      let cardArray = []
      for (var mixer in success.data) {
        cardArray.push(success.data[mixer].mixer_id.split(':')[0])
      }
      $log.info('cardArray: ', [ ...new Set(cardArray) ])
      $scope.cards = [ ...new Set(cardArray) ]
      $scope.mixers = success.data
      $http({
        method: 'GET',
        url: '/getAlsaCardFromEnvironment'
      }).then( function(success){
        let card = success.data
        if (card.toLowerCase() !== 'no card selected') {
          $scope.selectedCard = {
            card: card,
            mixers: $scope.getMixers(card)
          }
        }
        
      }, function(error) {
        $log.info('Error: ', error)
      })
    }, function (error) {
      $log.info('Error: ', error)
    })

    oak.ready()
  }

  oak.on('installProgress', function (data) {
    $log.info(data.step)
    $timeout(function () {
      $scope.installProgress = data.step
    })
    if (data.step.indexOf('SWAPPED') > -1) {
      $timeout(function () {
        $scope.installProgress = ''
      }, 1000)
    }
  })

  $scope.initApp()
})
