angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {

    $scope.parse = function () {

      var text = "";
      var endCharFound = false;

      var endIndex = String($scope.model.value).indexOf("+");
      if (endIndex > -1) {
        text = String($scope.model.value).substring(0, endIndex + 1);
        endCharFound = true;
      } else {
        endIndex = String($scope.model.value).indexOf("-");
        if (endIndex > -1) {
          text = String($scope.model.value).substring(0, endIndex + 1);
          endCharFound = true;
        } else {
          console.log("No se puede procesar la cédula");
        }
      }

      //if only 1 char blood type
      var bloodTypeIndex = text.length - 2;
      var bloodTypeChars = 2;
      //if 2 chars blood type
      if (isNaN(text.substr(bloodTypeIndex - 1, 1))) {
        bloodTypeIndex = bloodTypeIndex - 1;
        bloodTypeChars = 2;
      }

      //Blood Type
      console.log("Blood Type:" + text.substr(bloodTypeIndex, bloodTypeChars));
      $scope.bloodType = text.substr(bloodTypeIndex, bloodTypeChars);
      $scope.birthDate = text.substr(bloodTypeIndex - 14, 8);
      $scope.gender = text.substr(bloodTypeIndex - 15, 1);

      //Find The Name
      var nameIndex = bloodTypeIndex - 17;
      console.log("Chars");
      while (isNaN(text.substr(nameIndex, 1)) || text.charCodeAt(nameIndex) == 32) {
        console.log(text.charCodeAt(nameIndex));
        nameIndex--;
      }
      nameIndex++;

      console.log("Gender index: " + (bloodTypeIndex - 15));
      console.log("Name index: " + (nameIndex) + " " + text.charCodeAt(nameIndex));

      $scope.name = text.substr(nameIndex, bloodTypeIndex - 17 - nameIndex);

      var idIndex = nameIndex - 10;
      var indexChars = 10;
      //Check left zeros
      if (text.substr(idIndex, 1) == 0) {
        idIndex++;
        indexChars--;
        if (text.substr(idIndex, 1) == 0) {
          idIndex++;
          indexChars--;
        }
      }

      $scope.id = text.substr(idIndex, indexChars);

      if (endCharFound) {
        console.log($scope.model.value);
        console.log(endIndex);
        console.log(text);
      }
    }

    $scope.scan = function () {

      cordova.plugins.barcodeScanner.scan(
        function (result) {

          $scope.model.value = result.text;

          $scope.parse();

          $scope.$apply();
        },
        function (error) {
          alert("Scanning failed: " + error);
        },
        {
          "preferFrontCamera": false, // iOS and Android
          "showFlipCameraButton": true, // iOS and Android
          "prompt": "Place a barcode inside the scan area", // supported on Android only
          "formats": "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
        }
      );
    }

    $scope.initialize = function () {
      $scope.model = { value: '020857701123A         01955657144       097950020071262838BEDOYA                 LONDOÑO                MAURICIO                                      0M19820908001001O+ 2' };
    }

    $scope.initialize();
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };


  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
