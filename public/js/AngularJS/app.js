(function() {
    var app = angular.module('ekosave-registro', ['edicionController', 'recuperarControllers', 'registroControllers' ,'puntosMainControllers','webMainControllers', 'loginControllers', 'preguntasControllers', 'ngRoute', 'firebase', "ngMessages"]);
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: "views/login/main.html",
            controller: 'loginMainController',
            controllerAs: 'login',
        }).when('/edicionPerfil', {
            templateUrl: "views/edicion/main.html",
            controller: 'edicionMainController',
            controllerAs: 'edicion'
        }).when('/recuperar', {
            templateUrl: "views/login/recuperar.html",
            controller: 'recuperarController',
            controllerAs: ''
        }).when('/registro', {
            templateUrl: "views/registro/registrarse.html",
            controller: 'registroController',
            controllerAs: 'login'
        }).when('/preguntas', {
            templateUrl: "views/preguntas/seleccion.html",
            controller: 'preguntasMainController',
            controllerAs: 'preguntas'
        })
        .when('/preguntas/cancerCervix', {
            templateUrl: "views/preguntas/cervix.html",
            controller: 'cervixMainController',
            controllerAs: 'cervix'
        })
        .when('/puntos', {
            templateUrl: "views/puntos/puntos.html",
            controller: 'puntosMainController',
            controllerAs: ""
        })
        .when('/preguntas/cancerSeno', {
            templateUrl: "views/preguntas/seno.html",
            controller: 'senoMainController',
            controllerAs: 'seno'
        })
        .when('/puntos/reclamar', {
            templateUrl: "views/puntos/asignacion.html",
            controller: 'reclamarMainController',
          
        })
        .when('/inicio', {
            templateUrl: "views/web/main.html",
            controller: 'webMainController',
            controllerAs: 'web'
        }).otherwise({
            redirectTo: '/'
        })
    }]);
    app.factory("transacciones", function() {
        var botonAmpliacion = "none";
        var interfaz = {
            cambiarBotonAmpliacion: function(entrada) {
                botonAmpliacion = 1;
            },
            getCambiarBotonAmpliacion: function() {
                return botonAmpliacion;
            }
        }
        return interfaz;
    });


    app.factory("validador", function($q,$location){
        return {
            validar: function(){

                console.log("factory");

                var es = firebase.auth().onAuthStateChanged(function(user) {

                    if(user){

                        var usuario=  firebase.database().ref('usuarios/'+user.uid). once('value').then(function(info) {



                            var usuario=  firebase.database().ref('configuracion'). once('value').then(function(datos) {


                                if(datos.val().numOpportunities == info.val().repetitionsAnswersBreast &&  datos.val().numOpportunities == info.val().repetitionsAnswersCervix ){


                                    console.log((info.val().pointsBreast + info.val().pointsCervix ));

                                    if((info.val().pointsBreast + info.val().pointsCervix ) > 50){
                                        
                                    }else{
                                        $location.path("puntos");
                                
                                    }

                                }
                                else{
                                    $location.path("puntos");
                                  
                                }


                            });

                        });


                    }else{

                        $location.path("login");
                        $scope.$apply();                       
                   }

               });





            }
        };
    });



    app.controller('mainController', function($scope, $window, $route, $mdDialog, $mdMedia, $timeout, $location, $mdSidenav, $timeout, transacciones) {


    //     $(document).ready(function () {
    //       function reorient(e) {
    //         var portrait = (window.orientation % 180 == 0);
    //         $("body > div").css("-webkit-transform", !portrait ? "rotate(-90deg)" : "");
    //     }
    //     window.onorientationchange = reorient;
    //     window.setTimeout(reorient, 0);
    // });

    window.onresize = function(){ 

        if (window.matchMedia("(orientation: portrait)").matches) {
            console.log("v");
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
            console.log("h");

            
        }

    } 



    window.setInterval(function(){
        $scope.check();
    }, 500);

    $scope.check= function(){
    }
    $scope.logOut = function() {
        firebase.auth().signOut().then(function() {
            $location.path("login");

        }, function(error) {});
    } 

    $scope.cambiarEstado = function(){
       var es = firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            if($location.path()=="/login"){

                $location.path("inicio")
            }

            if (user.providerData[0].providerId == "facebook.com") {

                $scope.imagenNav.parentProperty = "https://graph.facebook.com/" + user.providerData[0].uid + "/picture?height=500";
                $scope.nombreUsuario.parentProperty = "" + user.providerData[0].displayName;
            } else {

                $scope.imagenNav.parentProperty = "http://40.71.81.33/fundacancer/public/img/amateLogoSolo.png";
                $scope.nombreUsuario.parentProperty = "" + user.providerData[0].uid;
            }
            $scope.mostrarMenuHeader.parentProperty = "block";

            $scope.botonAmpliacion = "initial";


            transacciones.cambiarBotonAmpliacion("jeje");
            $scope.informacionUsuario.parentProperty = user;
            $scope.prueba.parentProperty = "initial";

            $scope.botonAmpliacion = transacciones.getCambiarBotonAmpliacion();
            $scope.botonAmpliacion = "ddd";



            $scope.user = user;

            $scope.estadoo = $mdSidenav('left').isOpen();;

            if ($scope.estadoo == false) {
                $mdSidenav("left").toggle();
            }
            $("#nav").css("display", "");
            $("#cuerpo").addClass("cuerpoWeb");
        } else {
            $location.path("login");
        }
    });
   }


   $scope.abriendoMenu = "colapsado";

   $scope.abriendo = function(location) {

    if ($scope.abriendoMenu == "colapsando") {
        $scope.abriendoMenu = "colapsado";
    } else {
        $scope.abriendoMenu = "colapsando";
    }
}
$scope.openMenu = function($mdOpenMenu, ev) {

    $scope.$on("$mdMenuClose", function() {
        console.log("menu closing");
    });
    originatorEv = ev;
    $mdOpenMenu(ev);
};
$scope.informacionUsuario = {};
$scope.informacionUsuario.parentProperty = "";
$scope.imagenNav = {};
$scope.imagenNav.parentProperty = "http://40.71.81.33/fundacancer/public/img/amateLogoSolo.png";
$scope.nombreUsuario = {};
$scope.nombreUsuario.parentProperty = "";
$scope.mostrarMenuHeader = {};
$scope.mostrarMenuHeader.parentProperty = "none";
$scope.goSeccion = function(location) {
    $location.path("" + location);
}

$scope.prueba = {};
$scope.prueba.parentProperty = "none";
$scope.toggleLeft = buildToggler('left');
$scope.toggleRight = buildToggler('right');
$scope.isSidenavOpen = true;
$timeout(function() {}, 25);
buildToggler();
$scope.openNav = true;
$scope.estado = function estado() {
    if ($scope.openNav == true) {
        console.log("0");
        $scope.openNav = false;
        $("#cuerpo").removeClass("cuerpoWeb");
    } else {
        console.log("c");
        $scope.openNav = true;
        $("#cuerpo").addClass("cuerpoWeb");
    }
}
$scope.edicionDatos = function(ev, i) {
    $location.path("edicionPerfil");
}


function buildToggler(componentId) {

    if (componentId = "left") {} else {}
        $("#cuerp").addClass("cuerpo");
    return function() {
        $mdSidenav("left").toggle();
    };
}
})
})();