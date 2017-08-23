(function(){

	var app = angular.module('usuariosControllers' , ['angular.morris' ,'ngMaterial','md.data.table' ,'ngMessages' , 'ngAnimate', 'funcancer' ,'firebase' ])


.service('editarArea', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'PUT',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/area/v1/update",
          headers: {'Content-Type': 'application/json'},

          data : data,
        })

      return respuesta;

    }


  })


.service('consultarInvitaciones', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'GET',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/invitation/v1/loadByClient/"+data,
          headers: {'Content-Type': 'application/json'},

          data : data,
        })

      return respuesta;

    }


  })




.service('crearInvitacion', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'POST',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/invitation/v1/add",
          headers: {'Content-Type': 'application/json'},

          data : data,
        })

      return respuesta;

    }


  })

.service('enviarInvitacion', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'POST',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/invitation/v1/add",
          headers: {'Content-Type': 'application/json'},

          data : data,
        })

      return respuesta;

    }


  })


.service('enviarCorreo', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'POST',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/invitation/v1/send/"+data,
          headers: {'Content-Type': 'application/json'},

          data : data,
        })

      return respuesta;

    }


  })

.service('consultarAreas', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'get',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/area/v1/loadAllAreasByClientId/"+data,
          headers: {'Content-Type': 'application/json'},

          data : data,
        })

      return respuesta;

    }


  })


.service('consultarUsuario', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'GET',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/user/v1/loadByUID?UID="+data,
          headers: {'Content-Type': 'application/json'},

          data : "",
        })

      return respuesta;

    }


  })



.service('eliminarArea', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'DELETE',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/area/v1/delete/"+data,
          headers: {'Content-Type': 'application/json'},

          data : "",
        })

      return respuesta;

    }


  })


.service('consultarAsesores', function($http) {

    this.default = function(data) {

       var respuesta= $http({
          method: 'GET',
          url: "https://ekosave-users-dev-dot-project-963864459523015283.appspot.com/_ah/api/assessor/v1/loadByCLientId/"+data,
          headers: {'Content-Type': 'application/json'},

          data : "",
        })

      return respuesta;

    }


  })


	.controller('usuariosMainController' , function ($scope  , enviarCorreo ,consultarInvitaciones, consultarAsesores ,eliminarArea ,consultarUsuario , consultarAreas ,$mdDialog, $mdMedia, $location , registrarArea, $firebaseAuth, $mdToast,  $timeout , $mdSidenav ) {


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



  $scope.showActionToast = function() {
    var pinTo = $scope.getToastPosition();
    var toast = $mdToast.simple()
      .textContent('Usuario creado satisfactoriamente')
      .action('Vale :)')
      .highlightAction(true)
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position(pinTo);

    $mdToast.show(toast).then(function(response) {
      if ( response == 'ok' ) {
        alert('You clicked the \'UNDO\' action.');
      }
    });
  };







var user = firebase.auth().currentUser;


 $("#nav").css("display","");
   $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

 $scope.isSidenavOpen = true;

 console.log($scope.estadoo);

$timeout(function() {

  $("#cuerpoInicio").css("display","");

  $mdSidenav('left').isOpen();
// $mdSidenav("left").toggle();

$scope.cuerpos ="cuerpoWeb";

console.log("estado");
 $scope.estadoo=$mdSidenav('left').isOpen();;

 console.log($scope.estadoo);
 if($scope.estadoo==false){
$mdSidenav("left").toggle();
 }
    },200);

 buildToggler();

 $scope.openNav = true;

 $scope.estado = function estado() {

      if($scope.openNav == true){
        console.log("o");
         $scope.openNav = false;
         $("#cuerpo").removeClass("cuerpoWeb");
      }else{
          console.log("c");
           $scope.openNav = true;
           $("#cuerpo").addClass("cuerpoWeb");
      }
}





    function buildToggler(componentId) {

    if(componentId="left"){
      }else{ 
      }

$("#cuerp").addClass("cuerpo");
      return function() {
        $mdSidenav("left").toggle();
      };
}



$scope.enviarInvitacion = function(ev,i) {

  console.log("editando "+ev);
  $scope.idEditando=ev;
  console.log("scope");
  console.log($scope);


      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller:'invitarUsuarioController',
        templateUrl: 'views/usuarios/invitacion.html',
        parent: angular.element(document.body),
        targetEvent: i,
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals: { employee: 12 },
        scope:$scope,
        preserveScope: true,

      })
      .then(function(answer) {
        $mdDialog.hide();
      }, function() {

      });
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });

    }











console.log("llegan sesores");


var user = firebase.auth().currentUser;
var idCliente;
var infoUsuario;

 consultarUsuario.default(user.uid).then(function(respuesta){ 

    console.log("llegarrrr");


     infoUsuario=respuesta;
     console.log(respuesta);


 consultarAsesores.default(respuesta.data.idClient).then(function(respuesta){ 

  console.log("llegan asesores");
  console.log(respuesta);

   idCliente=respuesta.data.idClient;
 $scope.idCliente=respuesta.data.idClient;

if(respuesta.data.items){
  $scope.asesores= respuesta.data.items;

var cantidad= respuesta.data.items;

console.log("cantidad");
$scope.cantidadasesores= cantidad.length;

}
        });
        });



console.log("llegan sesores");


var user = firebase.auth().currentUser;
var idCliente;
var infoUsuario;

 consultarUsuario.default(user.uid).then(function(respuesta){ 

    console.log("llegarrrr");


     infoUsuario=respuesta;
     console.log(respuesta);


 consultarInvitaciones.default(respuesta.data.idClient).then(function(respuesta){ 

  console.log("llegan asesores");
  console.log(respuesta);

   idCliente=respuesta.data.idClient;
 $scope.idCliente=respuesta.data.idClient;

if(respuesta.data.items){
  $scope.invitaciones= respuesta.data.items;

var cantidad= respuesta.data.items;

console.log("cantidad");
$scope.cantidadinvitaciones= cantidad.length;

}
        });
        });






$scope.limitOptions = [5, 10, 15, {
  label: 'All',
  value: function () {
    return collection.length;
  }
}];


	})




  .controller('invitarUsuarioController' , function ($scope  , consultarInvitaciones ,eliminarArea ,consultarUsuario , crearInvitacion ,consultarAreas ,$mdDialog, $mdMedia, $location , registrarArea, $firebaseAuth, $mdToast,  $timeout , $mdSidenav ) {

$scope.botonEnviar=true;

$scope.validar = function (){

if($scope.formularioForm.$valid) {
 
$scope.botonEnviar=false;
console.log("valido");
  
}   else{

$scope.botonEnviar=true;

  console.log("invalido");
}


 };












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



  $scope.showActionToast = function() {
    var pinTo = $scope.getToastPosition();
    var toast = $mdToast.simple()
      .textContent('Usuario creado satisfactoriamente')
      .action('Vale :)')
      .highlightAction(true)
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position(pinTo);

    $mdToast.show(toast).then(function(response) {
      if ( response == 'ok' ) {
        alert('You clicked the \'UNDO\' action.');
      }
    });
  };







var user = firebase.auth().currentUser;


 $("#nav").css("display","");
   $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

 $scope.isSidenavOpen = true;

 console.log($scope.estadoo);

$timeout(function() {

  $("#cuerpoInicio").css("display","");

  $mdSidenav('left').isOpen();
// $mdSidenav("left").toggle();

$scope.cuerpos ="cuerpoWeb";

console.log("estado");
 $scope.estadoo=$mdSidenav('left').isOpen();;

 console.log($scope.estadoo);
 if($scope.estadoo==false){
$mdSidenav("left").toggle();
 }
    },200);

 buildToggler();

 $scope.openNav = true;

 $scope.estado = function estado() {

      if($scope.openNav == true){
        console.log("o");
         $scope.openNav = false;
         $("#cuerpo").removeClass("cuerpoWeb");
      }else{
          console.log("c");
           $scope.openNav = true;
           $("#cuerpo").addClass("cuerpoWeb");
      }
}





    function buildToggler(componentId) {

    if(componentId="left"){
      }else{ 
      }

$("#cuerp").addClass("cuerpo");
      return function() {
        $mdSidenav("left").toggle();
      };
}



$scope.enviar = function(ev,i) {

var user = firebase.auth().currentUser;
var idCliente;

 consultarUsuario.default(user.uid).then(function(respuesta){ 

$scope.idCliente = respuesta.data.idClient;

$scope.formulario.envio.idClient=respuesta.data.idClient;


$scope.formulario.envio.assessor={};
$scope.formulario.envio.assessor.id=$scope.formulario.envio.asesor;


  console.log("formulario ");
 console.log($scope.formulario.envio);




console.log("llegan sesores");


var user = firebase.auth().currentUser;
var idCliente;
var infoUsuario;

 consultarUsuario.default(user.uid).then(function(respuesta){ 

    console.log("llegarrrr");


     infoUsuario=respuesta;
     console.log(respuesta);


 consultarInvitaciones.default(respuesta.data.idClient).then(function(respuesta){ 

  console.log("llegan asesores");
  console.log(respuesta);

   idCliente=respuesta.data.idClient;
 $scope.idCliente=respuesta.data.idClient;

if(respuesta.data.items){
  $scope.invitaciones= respuesta.data.items;

var cantidad= respuesta.data.items;

console.log("cantidad");
$scope.cantidadinvitaciones= cantidad.length;

}
        });
        });



 crearInvitacion.default($scope.formulario.envio).then(function(respuesta){ 


 consultarInvitaciones.default(respuesta.data.idClient).then(function(respuesta){ 

  console.log("llegan asesores");
  console.log(respuesta);

   idCliente=respuesta.data.idClient;
 $scope.idCliente=respuesta.data.idClient;

if(respuesta.data.items){
  $scope.invitaciones= respuesta.data.items;

var cantidad= respuesta.data.items;

console.log("cantidad");
$scope.cantidadinvitaciones= cantidad.length;

}
        });



         var pinTo = $scope.getToastPosition();
          var toast = $mdToast.simple()
            .textContent('Invitacion creada satisfactoriamente.')
            .action('Vale :)')
            .highlightAction(true)
            .hideDelay(10000)
            .position(pinTo)
            .parent(document.querySelectorAll('#toast-container'));

          $mdToast.show(toast).then(function(response) {
            if ( response == 'ok' ) {      
            }
          });  

           $mdDialog.hide();

        });
        });

}




$scope.limitOptions = [5, 10, 15, {
  label: 'All',
  value: function () {
    return collection.length;
  }
}];


  })


})();