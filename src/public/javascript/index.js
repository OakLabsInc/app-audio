
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
  $scope.setAlsaCard = function (card) {
    var url = "/setAlsaCard/" + card
    $http({
      method: 'GET',
      url: url
    }).then(function (success) {
        $log.info("Success: ", success)
      }, function(error) {
        $log.info("Error: ", error)
      });
  }
  $scope.initApp = function () {
    // init app here
    $http({
        method: 'GET',
        url: "/getAudioInfo"
      }).then(function (success) {
          $log.info("Success: ", success)
          $scope.mixers = success.data
        }, function(error) {
          $log.info("Error: ", error)
        });
    
    oak.ready()
  }

  $scope.initApp()


})

