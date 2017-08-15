(function(){

	var app = angular.module('edicionController' , ['angular.morris' ,'ngMaterial', 'ngMessages' , 'ngAnimate', 'ekosave-registro' ,'firebase' ])

	.service('registrarCliente', function($http) {

		this.default = function(data) {

      var respuesta= $http({
       method: 'POST',
       url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/client/v1/add",
       headers: {'Content-Type': 'application/json'},

       data : data,
     })

      return respuesta;
    }


  })



 .config(function($mdDateLocaleProvider) {

   $mdDateLocaleProvider.formatDate = function (date)
   {
    var tempDate = moment(date);

    console.log("fecha "+date);
    return (tempDate.isValid() ? tempDate.format('DD/M/YYYY') : '');
  };
})
 .controller('edicionMainController' , function ($scope  , $mdDialog, $mdMedia, $location , registrarCliente, $firebaseAuth, $mdToast , $timeout, $mdSidenav, transacciones ) {
  $scope.minima = new Date();
  $scope.isOpen = false;
  console.log("fecha "+$scope.minima.setMonth($scope.minima.getMonth() - 168));


  var last = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };

  $scope.toastPosition = angular.extend({},last);

  $scope.getToastPosition = function() {
    sanitizePosition();

    return Object.keys($scope.toastPosition)
    .filter(function(pos) {
      console.log(pos);
      return $scope.toastPosition[pos]; })
    .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;

    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;

    last = angular.extend({},current);
  }

  $scope.showSimpleToast = function() {


    var pinTo = $scope.getToastPosition();

    $mdToast.show(
      $mdToast.simple()
      .textContent('Simple Toast!')
      .position(pinTo )
      .hideDelay(3000)
      .parent(document.querySelectorAll('#toast-container'))
      );
  };

  $scope.btnGuardarDatos=true;

  $scope.validar = function (){
    console.log($scope.formularioForm);
    if($scope.formularioForm.$valid){
      $scope.btnGuardarDatos=false;
      console.log("valido");
    }   
    else{
      $scope.btnGuardarDatos=true;
      console.log("invalido");
    }

    console.log($scope.formularioForm.$valid);
  };


  $scope.validarTelefono= function(){

    if ($scope.formulario.envio.telefono.length < 6) {
      console.log(" no validando");
      $scope.formularioForm.telefono.$error.validationError = true;
      $scope.formularioForm.$valid = false;
      $scope.formularioForm.telefono.$invalid=true;

    }
    else {
      $scope.formularioForm.telefono.$error.validationError = false;
      $scope.formularioForm.telefono.$invalid=false;
      console.log("  validando");
    }

  }


  $scope.showActionToast = function() {
    var pinTo = $scope.getToastPosition();
    var toast = $mdToast.simple()
    .textContent('Marked as read')
    .action('UNDO')
    .highlightAction(true)
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position(pinTo);

      $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {
          alert('You clicked the \'UNDO\' action.');
        }
      });
    };



    $scope.$on('$viewContentLoaded', function(event) {
      $("input.md-datepicker-input").prop('readonly', true);
    });

    $scope.minima = new Date();
    $scope.isOpen = false;
    console.log("fecha "+$scope.minima.setMonth($scope.minima.getMonth() - 168));

    $scope.maxima = new Date();
    console.log("fecha maxima"+$scope.maxima.setMonth($scope.maxima.getMonth() - (1080) ));

    $scope.formulario={};
    $scope.formulario.envio={};



    var es=firebase.auth().onAuthStateChanged(function(user) {



     if(user){

      $scope.cambiarEstado();

      $scope.nulo;

      var llegada=  firebase.database().ref('usuarios/'+user.uid). once('value').then(function(datos) {

        if(datos.val() == null){
          console.log("es nul");
          $scope.nulo=1;
        }else{
          console.log("ni es nul");
          $scope.nulo=0;
        }

        if(datos.val() != null){
          console.log("datos llegada");
          console.log(datos.val());
          angular.element('#name').focus();

          


          console.log(datos.val());

          if(datos.val().dateBirthday){
           var parts =datos.val().dateBirthday.split('/');

           var mydate = new Date(parts[2],parts[1]-1,parts[0]-1); 
         }
         else{
           var mydate = new Date(); 
           $scope.nulo = 1;
         }





         console.log(mydate);

         $scope.formulario.envio.name  = datos.val().name;
         $scope.formulario.envio.lastName  = datos.val().lastName;
       $scope.formulario.envio.fechaNacimiento = mydate; // "2017-04-25";//new Date(datos.val().dateBirthDay);
       $scope.formulario.envio.telefono = datos.val().phoneNumber;
       $scope.formulario.envio.direccion = datos.val().address;
       $scope.formulario.envio.barrio = datos.val().neighborhood;
       $scope.formulario.envio.estatura = datos.val().height;
       $scope.formulario.envio.peso = datos.val().weight;
       $scope.formulario.envio.hijos = datos.val().hasChilds;
     }

 $scope.$apply();

   });



      $scope.formulario.envio.email=user.email;

      $scope.guardarPerfil = function(){

        var date = $scope.formulario.envio.fechaNacimiento;


        var mes=(date.getMonth())+(1);
        var dia=date.getDate();
        var ano=date.getFullYear();

        console.log("nulo viene en "+$scope.nulo);

        console.log( mes  + '-' + dia + '-' +  date.getFullYear());

        if($scope.nulo==1){
        	console.log($scope.formulario.envio);
          firebase.database().ref('usuarios/' + user.uid).update({
            name: $scope.formulario.envio.name ,
            lastName: $scope.formulario.envio.lastName ,
            dateBirthday :  dia+"/"+mes+"/"+date.getFullYear() ,
            email: user.email ,
            phoneNumber: $scope.formulario.envio.telefono ,
            address: $scope.formulario.envio.direccion ,
            neighborhood: $scope.formulario.envio.barrio ,
            height: $scope.formulario.envio.estatura ,
            weight: $scope.formulario.envio.peso ,
            hasChilds: $scope.formulario.envio.hijos ,
            profileCompleted:1,
            currentPointsBreast : 0,
            currentPointsCervix : 0,
            dateCompletedCervix : "",
            dateCompletedBreast : "",
            pointsBreast : 0,
            pointsCervix : 0,
            state: 0,
            repetitionsAnswersCervix : 0,
            repetitionsAnswersBreast : 0

          });

        }else{
         console.log($scope.formulario.envio);
         firebase.database().ref('usuarios/' + user.uid).update({
          name: $scope.formulario.envio.name ,
          lastName: $scope.formulario.envio.lastName ,
          dateBirthday :  dia+"/"+mes+"/"+date.getFullYear() ,
          email: user.email ,
          phoneNumber: $scope.formulario.envio.telefono ,
          address: $scope.formulario.envio.direccion ,
          neighborhood: $scope.formulario.envio.barrio ,
          height: $scope.formulario.envio.estatura ,
          weight: $scope.formulario.envio.peso ,
          hasChilds: $scope.formulario.envio.hijos ,
          profileCompleted:1,

        });


       }




       var pinTo = $scope.getToastPosition();
       var toast = $mdToast.simple()
       .textContent('Cambios realizados satisfactoriamente.')
       .action('')
       .highlightAction(true)
       .hideDelay(10000)
       .position(pinTo)
       .parent(document.querySelectorAll('#toast-container'));

       $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {      
        }
      });  

       $timeout( function(){
         $location.path( "preguntas" );
       }, 1000 );

      

     }
   }else {
     $location.path( "login" );
   }

 });


})

})();