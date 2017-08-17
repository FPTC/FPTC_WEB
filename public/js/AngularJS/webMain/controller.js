(function(){

	var app = angular.module('webMainControllers' , ['angular.morris' ,'ngMaterial', 'ngMessages' , 'ngAnimate', 'ekosave-registro' ,'firebase' ])


	.controller('webMainController' , function ($scope  , $mdDialog, $mdMedia, $location , registrarCliente, $firebaseAuth, $mdToast,  $timeout , $mdSidenav,transacciones ) {


   

    var es=firebase.auth().onAuthStateChanged(function(user) {

      if(user){
  
      $scope.cambiarEstado();
       

      } else {
       $location.path( "login" );
     }
   });



})

})();