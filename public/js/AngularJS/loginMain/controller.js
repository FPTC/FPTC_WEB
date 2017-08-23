(function() {
    var app = angular.module('loginControllers', ['angular.morris', 'ngMaterial', 'ngMessages', 'ngAnimate', 'funcancer', 'firebase']).service('registrarCliente', function($http) {
        this.default = function(data) {
            var respuesta = $http({
                method: 'POST',
                url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/client/v1/add",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data,
            })
            return respuesta;
        }
    }).controller('loginMainController', function($scope, $mdDialog, $mdMedia, $location, registrarCliente, $firebaseAuth, $mdToast, $timeout, $mdSidenav) {


      var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({}, last);
    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition).filter(function(pos) {
            console.log(pos);
            return $scope.toastPosition[pos];
        }).join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if (current.bottom && last.top) current.top = false;
        if (current.top && last.bottom) current.bottom = false;
        if (current.right && last.left) current.left = false;
        if (current.left && last.right) current.right = false;
        last = angular.extend({}, current);
    }




    $scope.height = (($(window).height()) - 580) / 2;
    $(window).resize(function() {
        $scope.height = (($(window).height()) - 580) / 2;
        console.log($scope.height);

        $scope.$apply();
    });





    $scope.goRecuperar = function(ir) {
        $scope.myDate = new Date();
        $scope.isOpen = false;
        console.log(ir);
        $location.path("recuperar");
    }
    $scope.goRegistro = function(ir) {
        console.log(ir);
        $location.path("registro");
    }
    $scope.prueba.parentProperty = "none";
    $scope.emailRecuperar = "";
    $scope.botonRegistrar = true;
    $scope.validar = function() {
        if ($scope.formularioForm.$valid) {
            $scope.botonRegistrar = false;
            console.log("valido");
        } else {
            $scope.botonRegistrar = true;
            console.log("invalido");
        }
    };
    $scope.recuperar = function() {


    }
    firebase.auth().signOut().then(function() {
        console.log("deslogueado");
    }, function(error) {

    });
    $scope.estadoo = $mdSidenav('left').isOpen();
    $("#cuerpo").removeClass("cuerpoWeb");
    console.log("removido");
    if ($scope.estadoo == true) {
        $mdSidenav("left").toggle();
    }


    $scope.goLogin = function(ir) {
        console.log(ir);
        $location.path("login");
    }
    
  
    $scope.displayForm = "none";
    $scope.login = function($scope, $firebaseAuth) {
        var auth = $firebaseAuth();
    };

    $scope.displayForm = "";
    $scope.formulario = [];
    $scope.formulario.envio = {
        email: "",
        password: ""
    };
    $scope.loginFacebook = function() {
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        console.log("entro a consola");
        console.log(provider);
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            console.log("bien");
            promise = $timeout(function() {}, 2000);
            $location.path("inicio");
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.log("mal");
            console.log(error);
        });
    }
    $scope.enviarDatosLogin = function(n) {
        var email = $scope.formulario.envio.email;
        var password = $scope.formulario.envio.password;
        var log =    firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
            console.log(result);

            $location.path("inicio");
            var pinTo = $scope.getToastPosition();
            var toast = $mdToast.simple().textContent('Iniciando sesión ... ')
            .action('').highlightAction(true)
            .hideDelay(1000).position(pinTo)
            .parent(document.querySelectorAll('#toast-container'));

            $mdToast.show(toast).then(function(response) {
                if (response == 'ok') {}
            });
        }).catch(function(error) {
            console.log("llega error");
            console.log(error);
            if (error) {
                console.log(error.message);
                var pinTo = $scope.getToastPosition();
                var toast = $mdToast.simple().textContent('Se ha presentado un error: usuario o contraseña invalidos. ').action('').highlightAction(true).hideDelay(1000).position(pinTo).parent(document.querySelectorAll('#toast-container'));
                $mdToast.show(toast).then(function(response) {
                    if (response == 'ok') {}
                });
                return;
            } 
        });
            //  registrarCliente.default($scope.formulario.envio).then(function(respuesta){ 
            //	});
        }
    })





})();