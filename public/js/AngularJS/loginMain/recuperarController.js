(function() {
    var app = angular.module('recuperarControllers', ['angular.morris', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ekosave-registro', 'firebase']).service('registrarCliente', function($http) {
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
    })

    .controller('recuperarController', function($scope, $mdDialog, $mdMedia, $location, registrarCliente, $firebaseAuth, $mdToast, $timeout, $mdSidenav) {

        console.log("otro aparte");

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




        $scope.recuperarContrasena = function() {

            console.log("jeje");
            firebase.auth().sendPasswordResetEmail($scope.emailRecuperar).then(function() {
                console.log("enviado correo de recuperacion");
                var pinTo = $scope.getToastPosition();
                var toast = $mdToast.simple().textContent('Mensaje de recuperación de contraseña enviado ').action('').highlightAction(true).hideDelay(10000).position(pinTo).parent(document.querySelectorAll('#toast-container'));
                $mdToast.show(toast).then(function(response) {
                    if (response == 'ok') {}
                });
            }, function(error) {
                var pinTo = $scope.getToastPosition();
                var toast = $mdToast.simple().textContent('Ingresa un correo registrado valido.').action('').highlightAction(true).hideDelay(10000).position(pinTo).parent(document.querySelectorAll('#toast-container'));
                $mdToast.show(toast).then(function(response) {
                    if (response == 'ok') {}
                });

            });
        }

    })


})();