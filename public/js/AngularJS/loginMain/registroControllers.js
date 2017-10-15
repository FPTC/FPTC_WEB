(function() {
	var app = angular.module('registroControllers', ['angular.morris', 'ngMaterial', 'ngMessages', 'ngAnimate', 'funcancer', 'firebase']).service('registrarCliente', function($http) {
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

	.controller('registroController', function($scope, $mdDialog, $mdMedia, $location, registrarCliente, $firebaseAuth, $mdToast, $timeout, $mdSidenav) {


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
			
		});


		$scope.goRecuperar = function(ir) {
			$scope.myDate = new Date();
			$scope.isOpen = false;
		
			$location.path("recuperar");
		}
		$scope.goRegistro = function(ir) {
		
			$location.path("registro");
		}
		$scope.prueba.parentProperty = "none";
		$scope.emailRecuperar = "";
		$scope.botonRegistrar = true;
		$scope.validar = function() {
			if ($scope.formularioForm.$valid) {
				$scope.botonRegistrar = false;
				
			} else {
				$scope.botonRegistrar = true;
				
			}
		};
		$scope.recuperar = function() {


		}
		firebase.auth().signOut().then(function() {
			
		}, function(error) {

		});
		$scope.estadoo = $mdSidenav('left').isOpen();
		$("#cuerpo").removeClass("cuerpoWeb");
	
		if ($scope.estadoo == true) {
			$mdSidenav("left").toggle();
		}


		$scope.goLogin = function(ir) {
			
			$location.path("login");
		}



		$scope.registrarse = function() {
		
			firebase.auth().createUserWithEmailAndPassword($scope.emailRegistro, $scope.password).then(function(result) {


			

				var pinTo = $scope.getToastPosition();
				var toast = $mdToast.simple().textContent('Usuario registrado satisfactoriamente ').action('').highlightAction(true).hideDelay(4000).position(pinTo).parent(document.querySelectorAll('#toast-container'));
				$mdToast.show(toast).then(function(response) {
					if (response == 'ok') {}




						$location.path("login");
				});


				var date= new Date();
				var mes=(date.getMonth())+(1);
				var dia=date.getDate();
				var ano=date.getFullYear();
			
				firebase.database().ref('usuarios/' + result.uid).set({
					name: "" ,
					dateBirthday :  "" ,
					email: result.email ,
					age: "" ,
					phoneNumber: "" ,
					address: "" ,
					neighborhood: "" ,
					height: "" ,
					weight: "" ,
					hasChilds: "" ,
					pointsTotal: 0 ,
					currentPointsBreast: 0,
					currentPointsCervix: 0,
					pointsBreast : 0,
					pointsCervix: 0,
					state: 0 ,
					repetitionsAnswersBreast: 0,
					repetitionsAnswersCervix: 0,
					profileCompleted : 0,
					dateCompletedCervix : "",
					dateCompletedBreast : "",
					dateCreated:  dia+"/"+mes+"/"+date.getFullYear() 

				});



                //luego, creamos el usuario en el nodo usuarios de la base de datos, para así evitar problemas de registro
                return;
            }).catch(function(error) {

            	var error=error.message;

            

            	var message="";
            	if(error.code=="auth/user-not-found"){
            		message="Usuario no encontrado."
            	}

            	if(error.code=="auth/invalid-email"){
            		message="Email invalido. comprueba que tiene un formato valido."
            	}

            	if(error.code=="auth/wrong-password"){
            		message="Contraseña errada."
            	}

            	if(error == "The email address is already in use by another account."){

            		message = "Existe este usuario con este email, por favor verifique.";
            	}

            	if(error == "ERROR_INVALID_EMAIL"){
            		message = "El email registrado no es válido, por favor verifique.";
            	}


            	if(error ==  "ERROR_WRONG_PASSWORD"){ message = "La contraseña es incorrecta";}

            	if(error ==  "ERROR_USER_DISABLED"){
            		message = "El usuario se encuentra deshabilitado";
            	}
            	if(error == "ERROR_EMAIL_ALREADY_IN_USE"){
            		message = "Este usuario ya existe";
            	}
            	if(error ==  "ERROR_OPERATION_NOT_ALLOWED"){
            		message = "El email y contraseña no están habilitado. Habilítelo en la consola de Firebase";
            	}
            	if(error == "ERROR_WEAK_PASSWORD"){
            		message = "La contraseña es muy débil, digite una combinación más compleja";
            	}
            	if(error == "WEAK_PASSWORD"){

            		message = "La contraseña es débil, digite más de 6 letras o números";
            	}

            	if(error.code=="auth/user-not-found"){
            		message="Usuario no encontrado."
            	}

            	if(error.code=="auth/invalid-email"){
            		message="Email invalido. comprueba que tiene un formato valido."
            	}

            	if(error.code=="auth/wrong-password"){
            		message="Contraseña errada."
            	}


            	var pinTo = $scope.getToastPosition();
            	var toast = $mdToast.simple().textContent('Se ha presentado un error: ' + message).action('').highlightAction(true).hideDelay(10000).position(pinTo).parent(document.querySelectorAll('#toast-container'));
            	$mdToast.show(toast).then(function(response) {
            		if (response == 'ok') {}
            	});
            	return;
            });
        }

    })


})();