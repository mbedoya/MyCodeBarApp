angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {

    $scope.parseText = function (sourceText, fx) {

      //Texto legible donde se encuentra la información de la persona
      var text;
      var endCharFound = false;

      //Buscar los últimos caracteres del texto legible, signo positivo o negativo del tipo de sangre
      var endIndex = sourceText.indexOf("+");
      if (endIndex > -1) {
        text = sourceText.substring(0, endIndex + 1);
        endCharFound = true;
      } else {
        endIndex = String($scope.model.value).indexOf("-");
        if (endIndex > -1) {
          text = sourceText.substring(0, endIndex + 1);
          endCharFound = true;
        } else {
          console.log("No se puede procesar la cédula");
          fx(null, "No se puede procesar la cédula");

          return;
        }
      }

      //Determinar si el tipo de sangre tiene 1(A) ó 2(AB) caracteres 

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

      //Nombre

      //Find The Name
      var nameIndex = bloodTypeIndex - 17;
      console.log("Chars");
      while (isNaN(text.substr(nameIndex, 1)) || text.charCodeAt(nameIndex) == 32) {
        nameIndex--;
      }
      nameIndex++;

      console.log("Gender index: " + (bloodTypeIndex - 15));
      console.log("Name index: " + (nameIndex) + " " + text.charCodeAt(nameIndex));

      //Con el nombre puede venir el caracter NULL o WHITE SPACE como separador, si es NULL pasar a WHITE SPACE

      var name = text.substr(nameIndex, bloodTypeIndex - 17 - nameIndex);
      var formattedName = '';
      var asciiName = '';
      for (var index = 0; index < name.length; index++) {
        var char = name.charCodeAt(index);
        if (char == 0) {
          char = 32;
        }
        asciiName = asciiName + name.charCodeAt(index) + '-';
        formattedName = formattedName + String.fromCharCode(char);
      }

      //Obtener el ID de la Cedula, es posible que vengan 1, 2 ´ó 3 ceros dependiendo
      //de lo largo del número

      var idIndex = nameIndex - 10;
      var indexChars = 10;
      //Check left zeros
      if (text.substr(idIndex, 1) == 0) {
        idIndex++;
        indexChars--;
        if (text.substr(idIndex, 1) == 0) {
          idIndex++;
          indexChars--;
          if (text.substr(idIndex, 1) == 0) {
            idIndex++;
            indexChars--;
          }
        }
      }

      var obj = {
        name: formattedName,
        ascii: asciiName,
        gender: text.substr(bloodTypeIndex - 15, 1),
        id: text.substr(idIndex, indexChars),
        bloodType: text.substr(bloodTypeIndex, bloodTypeChars),
        birthDate: text.substr(bloodTypeIndex - 14, 8)
      }

      fx(obj);

    }

    $scope.parse = function () {

      $scope.parseText($scope.model.value, function (obj, error) {

        if (error) {
          alert(error);
        } else {
          $scope.id = obj.id;
          $scope.ascii = obj.ascii;
          $scope.name = obj.name;
          $scope.bloodType = obj.bloodType;
          $scope.birthDate = obj.birthDate;
          $scope.gender = obj.gender;
        }

      });
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
