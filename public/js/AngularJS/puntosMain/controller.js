(function(){

	var app = angular.module('puntosMainControllers' , ['angular.morris' ,'ngMaterial', 'ngMessages' , 'ngAnimate', 'funcancer' ,'firebase' ])

    .service('serviceMensajes', function($http) {


        this.default = function(uid) {

         var respuesta= $http({
          method: 'get',
          url: 'https://us-central1-fptc-test.cloudfunctions.net/validationCancerType?uid='+uid,
          headers: {
              "Access-Control-Allow-Origin": "*"}


          })
         
         return respuesta;
     }
 })

    .controller('puntosMainController' , function ($scope  , $mdDialog, $mdMedia, $location , registrarCliente, $firebaseAuth, $mdToast,  $timeout , $mdSidenav,transacciones ) {

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


        $scope.reclamar = function(){

         

            if($scope.error==true){

               var pinTo = $scope.getToastPosition();
               var toast = $mdToast.simple().textContent('Para reclamar tu premio debes completar tu perfil y los test.').action('').highlightAction(true).hideDelay(4000).position(pinTo).parent(document.querySelectorAll('#toast-container'));
               $mdToast.show(toast).then(function(response) {
                if (response == 'ok') {}





            });



           }else{




            if($scope.dataUser.numOpportunities ==$scope.info.repetitionsAnswersBreast &&  $scope.dataUser.numOpportunities ==$scope.info.repetitionsAnswersCervix ){
                

                if(!("breastIndication" in $scope.info )){
                    $location.path( "puntos/reclamar" ); 
                }
                else{

                   var pinTo = $scope.getToastPosition();
                   var toast = $mdToast.simple().textContent('Ya has solicitado reclamar tu premio. Sigue atenta con nuestra aplicación para nuevas oportunidades de probar tu conocimiento y aprender. Y recuerda… ¡Ámate cuida tu salud!').action('').highlightAction(true).hideDelay(4000).position(pinTo).parent(document.querySelectorAll('#toast-container'));
                   $mdToast.show(toast).then(function(response) {
                    if (response == 'ok') {}
                });

               }

           }else{
               

            var pinTo = $scope.getToastPosition();
            var toast = $mdToast.simple().textContent('Para reclamar tu premio debes completar todos los módulos en APRENDE SOBRE EL CÁNCER').action('').highlightAction(true).hideDelay(4000).position(pinTo).parent(document.querySelectorAll('#toast-container'));
            $mdToast.show(toast).then(function(response) {
                if (response == 'ok') {}





            });

        }

    }


          //  $location.path( "puntos/reclamar" );                 
      }

      $scope.regalosEnvio={};
      $scope.puntos="";

      var es=firebase.auth().onAuthStateChanged(function(user) {

        if(user){
           
            $scope.cambiarEstado();



            var usuario=  firebase.database().ref('usuarios/'+user.uid). once('value').then(function(info) {

                
                $scope.info = info.val();

                var usuario=  firebase.database().ref('configuracion'). once('value').then(function(datos) {

                    $scope.dataUser = datos.val();
                    

                    if(info.val() != null){
                        $scope.puntos=info.val().pointsBreast + info.val().pointsCervix;
                        $scope.error=false;
                    }else{
                        $scope.puntos=0;
                        $scope.error=true;
                    }

                    if(datos.val().numOpportunities == info.val().repetitionsAnswersBreast &&  datos.val().numOpportunities == info.val().repetitionsAnswersCervix  ){


                      


                        document.getElementById("btnReclamar").classList.remove("noVisible");

                    }
                    else{

                    }

                    $scope.$apply();


                });

            });


            var regalos=  firebase.database().ref('premios').once('value').then(function(regalos) {

              
                if(regalos.val()){



                    var regalos = regalos.val();    

                    var i = 0;

                    for(regalo in regalos){


                        $scope.regalosEnvio[i] = {};
                        $scope.regalosEnvio[i].nombreRegalo = regalos[regalo].gift;
                        $scope.regalosEnvio[i].valor = regalos[regalo].points;
                        i++;
                    }
                }else{

                }

                $scope.$apply();

            });

        } else {
            $location.path( "login" );
        }
    });

  })
.controller('reclamarMainController' , function ($scope  , $mdDialog, $mdMedia, $location , registrarCliente, serviceMensajes,$firebaseAuth, $mdToast,  $timeout , $mdSidenav,transacciones ) {




    $scope.contactar = function(valor){
        if(valor == true){

            firebase.database().ref('usuarios/' + $scope.uid).update({
                appointment: true            }).then(function(info) {

                 $location.path("puntos");
                 $scope.$apply();
             });;



            }else{
                firebase.database().ref('usuarios/' + $scope.uid).update({
                    appointment: false
                }).then(function(info) {
                    $location.path("puntos");
                    $scope.$apply();
                });;
            }
        }    




        var es = firebase.auth().onAuthStateChanged(function(user) {

            if(user){


                $scope.cambiarEstado();

                $scope.uid=user.uid;


                firebase.database().ref('usuarios/' + $scope.uid).update({
                    state: 2
                });


                var usuario=  firebase.database().ref('usuarios/'+user.uid). once('value').then(function(info) {

                    $scope.userInfo = info.val();                   

                    var dateosf=  firebase.database().ref('configuracion'). once('value').then(function(datos) {

                        if(datos.val().numOpportunities == info.val().repetitionsAnswersBreast &&  datos.val().numOpportunities == info.val().repetitionsAnswersCervix  ){

                         

                            if((info.val().pointsBreast + info.val().pointsCervix ) > 5){
                                $scope.$apply();
                                serviceMensajes.default(user.uid).then(function(respuesta){
                                  

                                    $scope.mensaje ="";

                                    if(respuesta.data.breast == true && respuesta.data.cervix == false ){

                                        $scope.mensaje="mamografía"
                                    }

                                    if (respuesta.data.breast == false && respuesta.data.cervix == true ){

                                        $scope.mensaje="citología"
                                    }
                                    if(respuesta.data.breast == true && respuesta.data.cervix == true ){
                                        $scope.mensaje="mamografía y citología"
                                    }


                                    if(respuesta.data.breast == true || respuesta.data.cervix == true ){
                                        document.getElementById("acompanamiento").classList.remove("noVisible");
                                    }
                                    else{
                                        document.getElementById("recomendaciones").classList.remove("noVisible");
                                    }


                                    $scope.$apply();


                                });
                            }
                            else{
                                $location.path("puntos");
                                $scope.$apply();
                            }
                        }
                        else{
                            $location.path("puntos");
                            $scope.$apply();
                        }
                    });
                });

            }else{

                $location.path("login");
                $scope.$apply();                       

            }

        });
    }) 

})();