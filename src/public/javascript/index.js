
window.oak.disableZoom()

window.reload = function () {
  window.oak.reload()
}

// window.load = function () {
//   window.oak.ready()
// }
 
const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
  const recorder = await recordAudio();
  const actionButton = document.getElementById('action');
  actionButton.disabled = true;
  recorder.start();
  await sleep(3000);
  const audio = await recorder.stop();
  audio.play();
  await sleep(3000);
  actionButton.disabled = false;
}

window.oak.disableZoom()

window.reload = function () {
  window.oak.reload()
}

var app = window.angular
  .module('audioApp', ['ngMaterial'])
  .constant('os', window.os)
  .constant('oak', window.oak)
  .constant('_', window._)

  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self'])
  })
app.controller('appController', function AppController ($http, $log, $scope, $rootScope, $timeout, $sce, $httpParamSerializerJQLike, $filter, _, oak) {
  $scope.mixers = []
  $scope.installProgress = ''
  $scope.selectedCard = null

  $scope.setAlsaCard = function (card) {
    $scope.selectedCard = {
      card: card,
      mixers: $scope.getMixers(card)
    }
    var url = "/setAlsaCard/" + card
    $http({
      method: 'GET',
      url: url
    }).then(function (success) {
        $log.info("setAlsaCard Success: ", success)
        
      }, function(error) {
        $log.info("setAlsaCard Error: ", error)
      });
  }
  $scope.setAlsaCardConfiguration = function(mixer) {
    var json = angular.toJson( mixer.setting )
    var url = "/setAlsaCardConfiguration/" + json
    $http({
      method: 'GET',
      url: url
    }).then(function (success) {
        $log.info("setAlsaCardConfiguration Success: ", success)
        
      }, function(error) {
        $log.info("setAlsaCardConfiguration Error: ", error)
      });
  }
  $scope.getMixers = function(card) {
    let mixers = []
    for(i in $scope.mixers) {
      var id = $scope.mixers[i].mixer_id
      if(id.indexOf(card) > -1) {
        let mixer = {
          name: id.split(":")[1],
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
        url: "/getAudioInfo"
      }).then(function (success) {
          $log.info("Success: ", success)
          let cardArray = []
          for(var mixer in success.data){
            cardArray.push(success.data[mixer].mixer_id.split(":")[0])
          }
          $log.info("cardArray: ",[ ...new Set(cardArray) ])
          $scope.cards = [ ...new Set(cardArray) ]
          $scope.mixers = success.data

          
        }, function(error) {
          $log.info("Error: ", error)
        });
    
    oak.ready()
  }

  oak.on('installProgress', function (data){
   
    $log.info(data.step)
    $timeout(function(){
      $scope.installProgress = data.step
    })
    if (data.step.indexOf('SWAPPED') > -1) {
      $timeout(function(){
        $scope.installProgress = ''
      },1000)
    }
  })

  $scope.initApp()


})

