(function(){

	var app = angular.module('edicionController' , ['angular.morris' ,'ngMaterial', 'ngMessages' , 'ngAnimate', 'funcancer' ,'firebase' ])

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


    return (tempDate.isValid() ? tempDate.format('DD/M/YYYY') : '');
  };
})
 .controller('edicionMainController' , function ($scope  , $mdDialog, $mdMedia, $location , registrarCliente, $firebaseAuth, $mdToast , $timeout, $mdSidenav, transacciones ) {
  $scope.minima = new Date();
  $scope.isOpen = false;
  $scope.minima.setMonth($scope.minima.getMonth() - 168);


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

    if($scope.formularioForm.$valid){
      $scope.btnGuardarDatos=false;

    }   
    else{
      $scope.btnGuardarDatos=true;
      
    }


  };


  $scope.validarTelefono= function(){

    if ($scope.formulario.envio.telefono.length < 7) {

      $scope.formularioForm.telefono.$error.validationError = true;
      $scope.formularioForm.$valid = false;
      $scope.formularioForm.telefono.$invalid=true;

    }
    else {
      $scope.formularioForm.telefono.$error.validationError = false;
      $scope.formularioForm.telefono.$invalid=false;
      
    }

  }

  $scope.validarCelular= function(){

    if ($scope.formulario.envio.celular.length < 10) {

      $scope.formularioForm.celular.$error.validationError = true;
      $scope.formularioForm.$valid = false;
      $scope.formularioForm.celular.$invalid=true;

    }
    else {
      $scope.formularioForm.celular.$error.validationError = false;
      $scope.formularioForm.celular.$invalid=false;
      
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
    $scope.minima.setMonth($scope.minima.getMonth() - 168);

    $scope.maxima = new Date();
    $scope.maxima.setMonth($scope.maxima.getMonth() - (1080));

    $scope.formulario={};
    $scope.formulario.envio={};



    var es=firebase.auth().onAuthStateChanged(function(user) {



     if(user){

      $scope.cambiarEstado();

      $scope.nulo;

      //ubicación

      var llegada=  firebase.database().ref('paises'). once('value').then(function(paises) {

        $scope.ubicacion = paises.val();

        console.log($scope.ubicacion);

        $scope.paises = [];
        $scope.ciudades = {};

        for(pais in $scope.ubicacion){

          for(ciudad in $scope.ubicacion[pais].ciudades){
              //convertimos el objeto en array

              var temp = $scope.arrayquer($scope.ubicacion[pais].ciudades[ciudad].comunas);

              
              console.log("ordenado", temp);

              var temp1 = temp.sort(function(a, b){
               var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
               if (nameA < nameB) 
                return -1;
              if (nameA > nameB)
                return 1;
              return 0; 
            });
              console.log("ordenado", temp1);

              $scope.ubicacion[pais].ciudades[ciudad].comunas = temp       
            }

          }

          if($scope.ubicacion != null){

          //paises
          for(pais in $scope.ubicacion){
            $scope.paises.push( { id: parseInt(pais) , nombre: $scope.ubicacion[pais].name } );



          }

          console.log($scope.paises);

        }

        console.log($scope.ubicacion);

      });

      var llegada=  firebase.database().ref('usuarios/'+user.uid). once('value').then(function(datos) {

        if(datos.val() == null){

          $scope.nulo=1;
        }else{

          $scope.nulo=0;
        }

        if(datos.val() != null){

          angular.element('#name').focus();


          if(datos.val().dateBirthday){
           var parts =datos.val().dateBirthday.split('/');

           var mydate = new Date(parts[2],parts[1]-1,parts[0]-1); 
         }
         else{
           var mydate = new Date(); 
           $scope.nulo = 1;
         }

         if (datos.val().email) {
           $scope.formulario.envio.email=datos.val().email;
         }else{
          $scope.formulario.envio.email=user.email;
        }

        $scope.formulario.envio.name  = datos.val().name;
        $scope.formulario.envio.lastName  = datos.val().lastName;
        $scope.formulario.envio.fechaNacimiento = mydate; 
        $scope.formulario.envio.telefono = datos.val().phoneNumber;
        if (datos.val().phoneNumberCel) {
          $scope.formulario.envio.celular = datos.val().phoneNumberCel;
        }else{
          $scope.formulario.envio.celular = "";
        }
        $scope.formulario.envio.direccion = datos.val().address;
        $scope.formulario.envio.barrio = datos.val().neighborhood;
        $scope.formulario.envio.estatura = datos.val().height;
        $scope.formulario.envio.peso = datos.val().weight;
        $scope.formulario.envio.hijos = datos.val().hasChilds;

        $scope.formulario.envio.pais = datos.val().pais
        $scope.formulario.envio.ciudad = datos.val().ciudad
        $scope.formulario.envio.comuna = datos.val().comuna
        $scope.formulario.envio.ese = datos.val().ese
        $scope.formulario.envio.ips  = datos.val().ips


        //ubicacion[formulario.envio.pais].ciudades[formulario.envio.ciudad].comunas.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} )
      }


      $scope.$apply();

    });

      $scope.arrayquer = function (array) {
        console.log(array);
        var ary = [];
        if(typeof array !== "undefined"){

          angular.forEach(array, function (val, key) {
            ary.push(val);
          });
        }
        else{

        }

        
        return ary;
      };




      $scope.guardarPerfil = function(){

        var date = $scope.formulario.envio.fechaNacimiento;


        var mes=(date.getMonth())+(1);
        var dia=date.getDate();
        var ano=date.getFullYear();



        if($scope.nulo==1){

          firebase.database().ref('usuarios/' + user.uid).update({
            name: $scope.formulario.envio.name ,
            lastName: $scope.formulario.envio.lastName ,
            dateBirthday :  dia+"/"+mes+"/"+date.getFullYear() ,
            email: $scope.formulario.envio.email ,
            phoneNumber: $scope.formulario.envio.telefono ,
            phoneNumberCel : $scope.formulario.envio.celular,
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
            repetitionsAnswersBreast : 0,
            pais: parseInt($scope.formulario.envio.pais),
            ciudad : $scope.formulario.envio.ciudad,
            comuna: $scope.formulario.envio.comuna,
            ese: $scope.formulario.envio.ese,
            ips: $scope.formulario.envio.ips

          });

        }else{

         firebase.database().ref('usuarios/' + user.uid).update({
          name: $scope.formulario.envio.name,
          lastName: $scope.formulario.envio.lastName ,
          dateBirthday :  dia+"/"+mes+"/"+date.getFullYear() ,
          email: $scope.formulario.envio.email ,
          phoneNumber: $scope.formulario.envio.telefono ,
          phoneNumberCel : $scope.formulario.envio.celular ,
          address: $scope.formulario.envio.direccion ,
          neighborhood: $scope.formulario.envio.barrio ,
          height: $scope.formulario.envio.estatura ,
          weight: $scope.formulario.envio.peso ,
          hasChilds: $scope.formulario.envio.hijos ,
          profileCompleted:1,

          pais: parseInt($scope.formulario.envio.pais),
          ciudad : $scope.formulario.envio.ciudad,
          comuna: $scope.formulario.envio.comuna,
          ese: $scope.formulario.envio.ese,
          ips: $scope.formulario.envio.ips

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