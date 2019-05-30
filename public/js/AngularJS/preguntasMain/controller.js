(function(){

	var app = angular.module('preguntasControllers' , ['angular.morris' ,'ngMaterial', 'ngMessages' , 'ngAnimate', 'funcancer' ,'firebase' ])

	.controller('preguntasMainController' , function ($scope , $mdDialog , $mdMedia , $location , $firebaseAuth , $mdToast, $timeout , $mdSidenav ) {

		var es=firebase.auth().onAuthStateChanged(function(user) {

			if(user){

				$scope.cambiarEstado();

				$scope.goCervix = function(){
					$location.path( "preguntas/cancerCervix" );					
				}

				$scope.goSeno = function(){
					$location.path( "preguntas/cancerSeno" );					
				}

				$scope.goPuntos = function(){
					$location.path( "puntos" );					
				}


				
			} else {
				$location.path( "login" );
			}
		});



	})

	.controller('cervixMainController' , function ($scope , $mdDialog , $q,$mdMedia , $location , $firebaseAuth , $mdToast, $timeout , $mdSidenav ) {
		$scope.correcta="";
		$scope.goCervix = function(){
			$location.path( "preguntas/cancerCervix" );					
		}

		$scope.goSeno = function(){
			$location.path( "preguntas/cancerSeno" );					
		}

		$scope.goPuntos = function(){
			$location.path( "puntos" );					
		}

		var es=firebase.auth().onAuthStateChanged(function(user) {

			if(user){

				var self = this;

				$scope.datosUsuario = user;
				$scope.cambiarEstado();

				$scope.class=["btnLightCervix","btnPrimaryCervix" ,"btnDarkCervix"];
				
				var i=0;
				$scope.preguntas={};
				$scope.preguntas.actual=i;
				$scope.preguntas.listado={};
				$scope.preguntas.valores={};
				$scope.cantidadPreguntas=0;
				
				$scope.marco="noVisible";
				$scope.marcoPremio="noVisible";
				$scope.visibleAdicionales = "noVisible";
				$scope.disabledRespuestas = false;

				var preguntasPorHacer =0;

				$scope.indices=[];

				$scope.formateador = function(input) {
					return input + 'clientes';
				};

				function shuffleNoPromise(sourceArray) {


					for (var i = 0; i < sourceArray.length - 1; i++) {
						var j = i + Math.floor(Math.random() * (sourceArray.length - i));

						var temp = sourceArray[j];
						sourceArray[j] = sourceArray[i];
						sourceArray[i] = temp;	


					}

					return sourceArray;

				}


				//de promise

				function shuffle(sourceArray) {

				

					return $q(function(resolve, reject) {

						if(sourceArray.length == 1){
							resolve(sourceArray);
						}

						for (var i = 0; i <= sourceArray.length - 1; i++) {
							var j = i + Math.floor(Math.random() * (sourceArray.length - i));

							var temp = sourceArray[j];
							sourceArray[j] = sourceArray[i];
							sourceArray[i] = temp;	

							if(i<sourceArray.length - 1){
								resolve(sourceArray);
							}
						}
					});

				}



				var llegada=  firebase.database().ref('usuarios/'+user.uid). once('value').then(function(info) {

					if(info.val()==null){

						$scope.perfilCompletado = 0;
						$scope.marcoEdicion = "visible";
						document.getElementById("marcoEdicion").classList.remove("noVisible");
						document.getElementById("marcoEdicion").classList.add("visible");	

					}
					else{

						$scope.puntosMostrar = info.val().pointsCervix;
						$scope.$apply();


						firebase.database().ref("configuracion").once('value' , function(llegada) {

							$scope.lapso = llegada.val().lapseCervix;
							$scope.rondas = llegada.val().numOpportunities;



							if (info.val().dateCompletedCervix){
								
								$scope.fechaTerminado = info.val().dateCompletedCervix;
								var parts =info.val().dateCompletedCervix.split('/');

								$scope.fechaTerminado = new Date(parts[2],parts[1]-1,parts[0]); 


								$scope.fechaProximoExamen = $scope.fechaTerminado.setHours($scope.lapso * 24, 0, 0);

								$scope.fechaProximoExamen = new Date($scope.fechaProximoExamen);

								$scope.diferencia = $scope.fechaProximoExamen.getDate()-new Date().getDate() ;

								$scope.$apply();

							}
							else{
								$scope.diferencia=0;
							}

						});

						$scope.puntos = info.val().currentPointsCervix;
						$scope.puntosActuales = info.val().pointsCervix;

						if(info.val().profileCompleted){
							if(info.val().profileCompleted==1){
								$scope.perfilCompletado = 1;

								$scope.repeticiones = info.val().repetitionsAnswersCervix;
								
								$scope.usuario = {};

								$scope.usuario.nombre  = info.val().name;
								$scope.usuario.fechaNacimiento = info.val().dateBirthday;	
								$scope.usuario.barrio = info.val().neighborhood;
								$scope.usuario.estatura = info.val().height;
								$scope.usuario.peso = info.val().weight;
								$scope.usuario.hijos = info.val().hasChilds;
								$scope.usuario.vecesCompletado = info.val().repetitionsAnswersCervix;
								
								document.getElementById("marcoEdicion").classList.add("noVisible");
								document.getElementById("marcoEdicion").classList.remove("visible");

							}else{
								$scope.perfilCompletado = 0;
								document.getElementById("marcoEdicion").classList.add("visible");
								document.getElementById("marcoEdicion").classList.remove("noVisible");
							}
						}

						else{
							$scope.perfilCompletado = 0;
							document.getElementById("marcoEdicion").classList.add("visible");
							document.getElementById("marcoEdicion").classList.remove("noVisible");
						}

						
					}


					$scope.goPerfil = function(){
						$location.path( "edicionPerfil" );
					}

					if ($scope.perfilCompletado == 1) {

						



						var data = firebase.database().ref("preguntas/cervixCancer").orderByChild("enable").equalTo(true).once('value' , function(datos) {


							$scope.marco="visibleMarco";
							$scope.variable = datos.val();
						


							$scope.preguntasRespondidas = [];	




							

							$scope.terminado = function(){
						

								document.getElementById("cargandoPreguntas").classList.remove("visible");
								document.getElementById("cargandoPreguntas").classList.add("noVisible");

								$scope.crearRespuestas();

								if(preguntasPorHacer==0){
									// document.getElementById("mensajePreguntas").classList.remove("visible");
									// document.getElementById("mensajePreguntas").classList.add("noVisible");
									document.getElementById("marcoPremio").classList.remove("noVisible");
									document.getElementById("marcoPremio").classList.add("visible");
								}

								if($scope.variable.length==0){
									
								}

							}

							$scope.borrarRespondidas = function(){

								document.getElementById("cargandoPreguntas").classList.remove("noVisible");
								document.getElementById("cargandoPreguntas").classList.add("visible");




								if($scope.contadorHabilitadas >= 0){

								

									firebase.database().ref("respuestas/cervixCancer/"+$scope.preguntasHabilitadas[$scope.contadorHabilitadas]+"/"+$scope.datosUsuario.uid).once('value' , function(llegada) {

									

										if(llegada.val() == null ){
												preguntasPorHacer++;	
										}
										else{

											if(llegada.val()["respuesta"+$scope.repeticiones]){
												delete $scope.variable[$scope.preguntasHabilitadas[$scope.contadorHabilitadas]];
											}else{
												preguntasPorHacer++;	
											}
										}
										$scope.contadorHabilitadas--;
										$scope.borrarRespondidas();
									});
								}
								else{
									$scope.terminado();
								}
							}


							if($scope.repeticiones < $scope.rondas ){


								if($scope.diferencia > 0){
								

									// document.getElementById("mensajePreguntas").classList.remove("visible");
									// document.getElementById("mensajePreguntas").classList.add("noVisible");

									document.getElementById("marcoPremio").classList.remove("noVisible");
									document.getElementById("marcoPremio").classList.add("visible");

									document.getElementById("infoPremio").classList.remove("noVisible");
									document.getElementById("infoPremio").classList.add("visible");


									firebase.database().ref("usuarios/"+$scope.datosUsuario.uid).once('value' , function(data) {


										if(data.val().repetitionsAnswersCervix == $scope.rondas){
												//ya acabe cervix 

												document.getElementById("btnPuntos").classList.remove("noVisible");
												document.getElementById("btnPuntos").classList.add("visible");
											
											}
											else{
												//no he acabado cervix

												document.getElementById("btnTest").classList.remove("noVisible");
												document.getElementById("btnTest").classList.add("visible");
											
											}


										});




								}else{


									var llegada=  firebase.database().ref("preguntas/cervixCancer").orderByChild("enable").equalTo(true).once('value' , function(llegada) {		

										$scope.preguntasHabilitadas = llegada.val();
										$scope.preguntasHabilitadas = Object.keys($scope.preguntasHabilitadas);

										
										$scope.contadorHabilitadas = $scope.preguntasHabilitadas.length - 1;
										$scope.borrarRespondidas();
									});




									
								}

							}
							else{

								// document.getElementById("mensajePreguntas").classList.remove("visible");
								// document.getElementById("mensajePreguntas").classList.add("noVisible");

								document.getElementById("marcoPremio").classList.remove("noVisible");
								document.getElementById("marcoPremio").classList.add("visible");


								firebase.database().ref("usuarios/"+$scope.datosUsuario.uid).once('value' , function(data) {


									if(data.val().repetitionsAnswersCervix == $scope.rondas){
												//ya acabe cervix 

												document.getElementById("btnPuntos").classList.remove("noVisible");
												document.getElementById("btnPuntos").classList.add("visible");
												
											}
											else{
												//no he acabado cervix

												document.getElementById("btnTest").classList.remove("noVisible");
												document.getElementById("btnTest").classList.add("visible");
												
											}


										});



							
							}

							

							$scope.crearRespuestas = function(){

								
								var promise = shuffle( Object.keys( $scope.variable )  );
								promise.then(function(result) {

									document.getElementById("marcoPregunta").classList.remove("noVisible");
									document.getElementById("marcoPregunta").classList.add("visible");

									
									$scope.indicesAleatorios = result;



									for(indice in $scope.indicesAleatorios){
										var pregunta = $scope.indicesAleatorios[indice];

										$scope.cantidadPreguntas++;

										$scope.indices[i]=pregunta;



										$scope.preguntas.valores[i]={};
										$scope.preguntas.valores[i].textoPregunta = $scope.variable[""+pregunta].text;
										if($scope.variable[""+pregunta].info){
											$scope.preguntas.valores[i].info = $scope.variable[""+pregunta].info;
										}
										$scope.preguntas.valores[i].tipo = $scope.variable[""+pregunta].typeQuestion;

										$scope.preguntas.valores[i].id = $scope.variable[""+pregunta].id;
										$scope.preguntas.valores[i].adicional = 0;



										$scope.preguntas.valores[i].respuesta={};
										var i2 = 0;

										$scope.indiceRespuestas =	shuffleNoPromise(Object.keys($scope.variable[pregunta].answers ) );



										for(respuesta in $scope.indiceRespuestas){

											var id=$scope.indiceRespuestas[respuesta];

											$scope.preguntas.valores[i].respuesta[id]={};
											$scope.preguntas.valores[i].respuesta[id].id = id;
											$scope.preguntas.valores[i].respuesta[id].descripcion = $scope.variable[pregunta].answers[id].description;


											if($scope.variable[pregunta].answers[id].points){
												$scope.preguntas.valores[i].respuesta[id].puntos= $scope.variable[pregunta].answers[id].points;
											}


											if($scope.variable[pregunta].answers[id].value){
												$scope.preguntas.valores[i].respuesta[id].value = $scope.variable[pregunta].answers[id].value;
											}

											var i4=0;
											if($scope.variable[pregunta].answers[id].question){
												$scope.preguntas.valores[i].respuesta[id].preguntaAdicional ={};
												$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.text= $scope.variable[pregunta].answers[id].question.text;
												$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta={};



												for(compuesta in $scope.variable[pregunta].answers[id].question.answers){

													$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta[compuesta]={};
													$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta[compuesta].id = compuesta;
													$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta[compuesta].descripcion = $scope.variable[pregunta].answers[id].question.answers[compuesta].description;
													i4++;

													if($scope.variable[pregunta].answers[id].question.answers[compuesta].value){
														$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta[compuesta].value =  	$scope.variable[pregunta].answers[id].question.answers[compuesta].value;
													}

												}

												$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.cantidadRespuestas=i4;
												$scope.preguntas.valores[i].adicional=i4;
											}





											i2++;
										}

										if(i2 == 2){
											$scope.preguntas.valores[i].binaria=true;
										}

										$scope.preguntas.valores[i].cantidadRespuestas= i2;



										i++;
									}

									$scope.porcentaje=( (($scope.preguntas.actual+1) / $scope.cantidadPreguntas))*100     ;

									$scope.indicesRandom = $scope.indices;
									$scope.variable = $scope.preguntas.valores;
									



								}, function(causa) {

								});
							}



						});

$scope.mostrarLeyenda = "noVisible";

$scope.visibleAdicionales = "";
$scope.disabledRespuestas = false;


$scope.respuestaCompuesta = function(id){

	$scope.variableUpdate = 
	{
		"name": $scope.usuario.nombre,
		"uid" : $scope.datosUsuario.uid,
	}

	//para hacer que se pueda responder cuantas veces se requiera
	$scope.variableUpdate["anidada"+$scope.usuario.vecesCompletado] = id;

	var guardarRespuesta = firebase.database().ref("respuestas/cervixCancer/"+$scope.preguntas.valores[$scope.preguntas.actual].id+"/"+$scope.datosUsuario.uid)
	.update($scope.variableUpdate);


	$scope.seguir();


}

$scope.desabledSeleccion = false;

$scope.respuesta = function(id){
	
	if($scope.correcta==""){
		$scope.idSeleccionada= id;
		$scope.mostrarLeyenda = "";

		$scope.disabledRespuestas = true;

	//es necesario revisar en el numero de veces que ha completado el test, para asi mismo guardar una respuesta u otra, asi que  que se pone en "r" y la cantidad
	//de veces completado el test, asi, cuando no lo ha completado, las respuestas seran guardadas en r0, y si ya lo completo una vez, en r1


	var date = new Date();


	var mes=(date.getMonth())+(1);
	var dia=date.getDate();
	var ano=date.getFullYear();

	if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].puntos){
		$scope.puntos=$scope.puntos +  $scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].puntos;

	}

	$scope.variableUpdate = 
	{
		"name": $scope.usuario.nombre,
		"uid" : $scope.datosUsuario.uid,
	}

	//para hacer que se pueda responder cuantas veces se requiera
	$scope.variableUpdate["respuesta"+$scope.usuario.vecesCompletado] = id;

	var guardarRespuesta = firebase.database().ref("respuestas/cervixCancer/"+$scope.preguntas.valores[$scope.preguntas.actual].id+"/"+$scope.datosUsuario.uid)
	.update($scope.variableUpdate);





	var cambiarEstados = firebase.database().ref("usuarios/"+$scope.datosUsuario.uid)
	.update({
		"state" : 1,
		"currentPointsCervix" : $scope.puntos
	});


	if(($scope.preguntas.actual) < $scope.cantidadPreguntas){

		$scope.mostrarLeyenda = "noVisible";

		if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].preguntaAdicional){

			$scope.visibleAdicionales = "visibleOPciones";
			$scope.disabledRespuestas = true;
			$scope.mostrarLeyenda = "noVisible";
			$scope.correcta="Correcta";

			if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].value == true){
				$scope.correcta="Correcta";
			}else{
				$scope.correcta="Incorrecta";

			}

			
			if($scope.preguntas.valores[$scope.preguntas.actual].tipo == "Riesgo"){
				$scope.correcta="Info";
			}

		}else{


			if($scope.preguntas.valores[$scope.preguntas.actual].info){

				$scope.porcentaje=( (($scope.preguntas.actual+1) / $scope.cantidadPreguntas))*100     ;
				$scope.visibleAdicionales = "";
				$scope.disabledRespuestas = true;
				$scope.mostrarLeyenda = "visible";

				if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].value == true){
					$scope.correcta="Correcta";
				}else{
					$scope.correcta="Incorrecta";
				}

				if($scope.preguntas.valores[$scope.preguntas.actual].tipo == "Riesgo"){
					$scope.correcta="Info";
				}

			}else{

				if($scope.preguntas.valores[$scope.preguntas.actual].tipo != "Riesgo"){

					$scope.porcentaje=( (($scope.preguntas.actual+1) / $scope.cantidadPreguntas))*100     ;
					$scope.visibleAdicionales = "";
					$scope.disabledRespuestas = true;
					$scope.mostrarLeyenda = "visible";
					$scope.correcta="Correcta";
				}else{
					$scope.seguir();
				}
			}
		}

	}
	else
	{
		$scope.marcoPremio="visibleOPciones";
		$scope.marco="noVisible";
	}
}


}

$scope.seguir = function(){

	$scope.correcta="";

	if(($scope.preguntas.actual+1) < $scope.cantidadPreguntas){

		$scope.mostrarLeyenda = "noVisible";
		$scope.visibleAdicionales = "";
		$scope.disabledRespuestas = false;
		$scope.preguntas.actual++;
		$scope.porcentaje=( (($scope.preguntas.actual+1) / $scope.cantidadPreguntas))*100;

	}else{



		firebase.database().ref("configuracion").once('value' , function(llegada) {

			$scope.lapso = llegada.val().lapseCervix;
			$scope.rondas = llegada.val().numOpportunities;

			$scope.fechaTerminado = new Date(); 

			$scope.fechaProximoExamen = $scope.fechaTerminado.setHours($scope.lapso * 24, 0, 0);

			$scope.fechaProximoExamen = new Date($scope.fechaProximoExamen);

			$scope.diferencia = $scope.fechaProximoExamen.getDate()-new Date().getDate() ;

			$scope.$apply();


			$scope.marcoPremio="visibleOPciones";
			$scope.marco="noVisible";

			document.getElementById("marcoPremio").classList.remove("noVisible");
			document.getElementById("marcoPremio").classList.add("visible");


			document.getElementById("marcoPregunta").classList.remove("visible");
			document.getElementById("marcoPregunta").classList.add("noVisible");


			document.getElementById("infoPremio").classList.remove("noVisible");
			document.getElementById("infoPremio").classList.add("visible");

		});




		var date = new Date();
		var mes=(date.getMonth())+(1);
		var dia=date.getDate();
		var ano=date.getFullYear();

		//consulto que puntaje en cervix es el mayor, para asi saber si guardo o no
		firebase.database().ref("usuarios/"+$scope.datosUsuario.uid).once('value' , function(llegada) {

			if(llegada.val() == null ){
				$location.path( "login" );
				//que no deberia ocurrir 
			}
			else{


		//miro que boton poner, si ir a cervix o ir a premios

		firebase.database().ref("usuarios/"+$scope.datosUsuario.uid).once('value' , function(data) {
			

			if(data.val().repetitionsAnswersBreast == $scope.rondas){
				//ya acabe seno 
				
				document.getElementById("btnPuntos").classList.remove("noVisible");
				document.getElementById("btnPuntos").classList.add("visible");
				
			}
			else{
				//no he acabado seno
				
				document.getElementById("btnTest").classList.remove("noVisible");
				document.getElementById("btnTest").classList.add("visible");
				
			}


		});


			//si en este test consiguio mas puntos, los dejo como los finales en cervixpoints
			if($scope.puntos >= $scope.puntosActuales){

				$scope.puntosMostrar = $scope.puntos;

				var cambiarEstados = firebase.database().ref("usuarios/"+$scope.datosUsuario.uid)
				.update({
					"dateCompletedCervix": dia+"/"+mes+"/"+date.getFullYear(),

					"repetitionsAnswersCervix" : $scope.usuario.vecesCompletado + 1,
					"currentPointsCervix" : 0,
					"pointsCervix" : $scope.puntos
				});
				$scope.$apply();

			}
			else{
				var cambiarEstados = firebase.database().ref("usuarios/"+$scope.datosUsuario.uid)
				.update({
					"dateCompletedCervix": dia+"/"+mes+"/"+date.getFullYear(),
					
					"repetitionsAnswersCervix" : $scope.usuario.vecesCompletado + 1,
					"currentPointsCervix" : 0,
				});

				$scope.puntosMostrar = $scope.puntos;

				$scope.$apply();

			}
		}
		

	});




	}

}


}
});

} else {
	$location.path( "login" );
}
});



})
.controller('senoMainController' , function ($scope , $q , $mdDialog , $mdMedia , $location , $firebaseAuth , $mdToast, $timeout , $mdSidenav ) {
	$scope.correcta="";

	$scope.goCervix = function(){
		$location.path( "preguntas/cancerCervix" );					
	}

	$scope.goSeno = function(){
		$location.path( "preguntas/cancerSeno" );					
	}

	$scope.goPuntos = function(){
		$location.path( "puntos" );					
	}

	var es=firebase.auth().onAuthStateChanged(function(user) {

		if(user){
			
			var self = this;

			$scope.datosUsuario = user;
			
			$scope.cambiarEstado();

			$scope.class=["lightAmate","primaryAmate" ,"darkAmate"];
			var i=0;
			$scope.preguntas={};
			$scope.preguntas.actual=i;
			$scope.preguntas.listado={};
			$scope.preguntas.valores={};
			$scope.cantidadPreguntas=0;

			$scope.marco="noVisible";
			$scope.marcoPremio="noVisible";
			$scope.visibleAdicionales = "noVisible";
			$scope.disabledRespuestas = false;
			var preguntasPorHacer =0;



			$scope.indices=[];


			function shuffleNoPromise(sourceArray) {


				for (var i = 0; i < sourceArray.length - 1; i++) {
					var j = i + Math.floor(Math.random() * (sourceArray.length - i));

					var temp = sourceArray[j];
					sourceArray[j] = sourceArray[i];
					sourceArray[i] = temp;	


				}

				return sourceArray;

			}


				//de promise

				function shuffle(sourceArray) {

			

					return $q(function(resolve, reject) {

						if(sourceArray.length == 1){
							resolve(sourceArray);
						}

						for (var i = 0; i <= sourceArray.length - 1; i++) {
							var j = i + Math.floor(Math.random() * (sourceArray.length - i));

							var temp = sourceArray[j];
							sourceArray[j] = sourceArray[i];
							sourceArray[i] = temp;	

							if(i<sourceArray.length - 1){
								resolve(sourceArray);
							}
						}
					});

				}



				var llegada=  firebase.database().ref('usuarios/'+user.uid). once('value').then(function(info) {

					if(info.val()==null){

						$scope.perfilCompletado = 0;
						$scope.marcoEdicion = "visible";
						document.getElementById("marcoEdicion").classList.remove("noVisible");
						document.getElementById("marcoEdicion").classList.add("visible");	

					}
					else{

						$scope.puntosMostrar = info.val().pointsBreast;

						$scope.$apply();

						

						firebase.database().ref("configuracion").once('value' , function(llegada) {

							$scope.lapso = llegada.val().lapseBreast;
							$scope.rondas = llegada.val().numOpportunities;

							if (info.val().dateCompletedBreast){
								
								$scope.fechaTerminado = info.val().dateCompletedBreast;
								var parts =info.val().dateCompletedBreast.split('/');

								$scope.fechaTerminado = new Date(parts[2],parts[1]-1,parts[0]); 


								$scope.fechaProximoExamen = $scope.fechaTerminado.setHours($scope.lapso * 24, 0, 0);

								$scope.fechaProximoExamen = new Date($scope.fechaProximoExamen);

								$scope.diferencia = $scope.fechaProximoExamen.getDate()-new Date().getDate() ;

								$scope.$apply();

							}
							else{
								$scope.diferencia=0;
							}

						});

						$scope.puntos = info.val().currentPointsBreast;
						$scope.puntosActuales = info.val().pointsBreast;

						if(info.val().profileCompleted){
							if(info.val().profileCompleted==1){
								$scope.perfilCompletado = 1;

								$scope.repeticiones = info.val().repetitionsAnswersBreast;
								
								$scope.usuario = {};

								$scope.usuario.nombre  = info.val().name;
								$scope.usuario.fechaNacimiento = info.val().dateBirthday;	
								$scope.usuario.barrio = info.val().neighborhood;
								$scope.usuario.estatura = info.val().height;
								$scope.usuario.peso = info.val().weight;
								$scope.usuario.hijos = info.val().hasChilds;
								$scope.usuario.vecesCompletado = info.val().repetitionsAnswersBreast;
								
								document.getElementById("marcoEdicion").classList.add("noVisible");
								document.getElementById("marcoEdicion").classList.remove("visible");

							}else{
								$scope.perfilCompletado = 0;
								document.getElementById("marcoEdicion").classList.add("visible");
								document.getElementById("marcoEdicion").classList.remove("noVisible");
							}
						}

						else{
							$scope.perfilCompletado = 0;
							document.getElementById("marcoEdicion").classList.add("visible");
							document.getElementById("marcoEdicion").classList.remove("noVisible");
						}

						
					}


					$scope.goPerfil = function(){
						$location.path( "edicionPerfil" );
					}

					if ($scope.perfilCompletado == 1) {



						var llegada=  firebase.database().ref("preguntas/breastCancer").orderByChild("enable").equalTo(true).once('value' , function(llegada) {		

							$scope.preguntasHabilitadas = llegada.val();
							$scope.preguntasHabilitadas = Object.keys($scope.preguntasHabilitadas);

							$scope.inicio();

						});

						$scope.inicio = function(){



							var data = firebase.database().ref("preguntas/breastCancer").orderByChild("enable").equalTo(true).once('value' , function(datos) {

								$scope.marco="visibleMarco";
								$scope.variable = datos.val();
					

								$scope.preguntasRespondidas = [];	

							

								$scope.contadorHabilitadas = $scope.preguntasHabilitadas.length - 1;

								$scope.terminado = function(){
							
									$scope.crearRespuestas();

									document.getElementById("cargandoPreguntas").classList.remove("visible");
									document.getElementById("cargandoPreguntas").classList.add("noVisible");

									console.log(preguntasPorHacer);

									if(preguntasPorHacer==0){
										// document.getElementById("mensajePreguntas").classList.remove("visible");
										// document.getElementById("mensajePreguntas").classList.add("noVisible");
										document.getElementById("marcoPremio").classList.remove("noVisible");
										document.getElementById("marcoPremio").classList.add("visible");
									}

									if($scope.variable.length==0){
									
									}

								}

								$scope.borrarRespondidas = function(){

									document.getElementById("cargandoPreguntas").classList.remove("noVisible");
									document.getElementById("cargandoPreguntas").classList.add("visible");


								


									console.log($scope.contadorHabilitadas);
									if($scope.contadorHabilitadas >= 0){

								

										firebase.database().ref("respuestas/breastCancer/"+$scope.preguntasHabilitadas[$scope.contadorHabilitadas]+"/"+$scope.datosUsuario.uid).once('value' , function(llegada) {


										
											if(llegada.val() == null ){
											preguntasPorHacer++;	
											}
											else{



												if(llegada.val()["respuesta"+$scope.repeticiones]){
													delete $scope.variable[$scope.preguntasHabilitadas[$scope.contadorHabilitadas]];
												}else{
													preguntasPorHacer++;	
												}
											}
											$scope.contadorHabilitadas--;
											$scope.borrarRespondidas();
										});
									}
									else{
										$scope.terminado();
									}
								}


								if($scope.repeticiones < $scope.rondas ){


									if($scope.diferencia > 0){
									

										// document.getElementById("mensajePreguntas").classList.remove("visible");
										// document.getElementById("mensajePreguntas").classList.add("noVisible");

										document.getElementById("marcoPremio").classList.remove("noVisible");
										document.getElementById("marcoPremio").classList.add("visible");

										document.getElementById("infoPremio").classList.remove("noVisible");
										document.getElementById("infoPremio").classList.add("visible");

										firebase.database().ref("usuarios/"+$scope.datosUsuario.uid).once('value' , function(data) {


											if(data.val().repetitionsAnswersCervix == $scope.rondas){
												//ya acabe cervix 

												document.getElementById("btnPuntos").classList.remove("noVisible");
												document.getElementById("btnPuntos").classList.add("visible");
											
											}
											else{
												//no he acabado cervix

												document.getElementById("btnTest").classList.remove("noVisible");
												document.getElementById("btnTest").classList.add("visible");
											
											}


										});




									}else{

										var llegada=  firebase.database().ref("preguntas/breastCancer").orderByChild("enable").equalTo(true).once('value' , function(llegada) {		

											$scope.preguntasHabilitadas = llegada.val();
											$scope.preguntasHabilitadas = Object.keys($scope.preguntasHabilitadas);

										
											$scope.contadorHabilitadas = $scope.preguntasHabilitadas.length - 1;
											$scope.borrarRespondidas();
										});



									}

								}
								else{


									
									firebase.database().ref("usuarios/"+$scope.datosUsuario.uid).once('value' , function(data) {


										if(data.val().repetitionsAnswersCervix == $scope.rondas){
												//ya acabe cervix 

												document.getElementById("btnPuntos").classList.remove("noVisible");
												document.getElementById("btnPuntos").classList.add("visible");
											
											}
											else{
												//no he acabado cervix

												document.getElementById("btnTest").classList.remove("noVisible");
												document.getElementById("btnTest").classList.add("visible");
											
											}


										});


									// document.getElementById("mensajePreguntas").classList.remove("visible");
									// document.getElementById("mensajePreguntas").classList.add("noVisible");

									document.getElementById("marcoPremio").classList.remove("noVisible");
									document.getElementById("marcoPremio").classList.add("visible");
							
								}



								$scope.crearRespuestas = function(){



									var promise = shuffle( Object.keys( $scope.variable )  );
									promise.then(function(result) {

										document.getElementById("marcoPregunta").classList.remove("noVisible");
										document.getElementById("marcoPregunta").classList.add("visible");

								
										$scope.indicesAleatorios = result;



										for(indice in $scope.indicesAleatorios){
											var pregunta = $scope.indicesAleatorios[indice];

											$scope.cantidadPreguntas++;

											$scope.indices[i]=pregunta;



											$scope.preguntas.valores[i]={};
											$scope.preguntas.valores[i].textoPregunta = $scope.variable[""+pregunta].text;
											if($scope.variable[""+pregunta].info){
												$scope.preguntas.valores[i].info = $scope.variable[""+pregunta].info;
											}
											$scope.preguntas.valores[i].tipo = $scope.variable[""+pregunta].typeQuestion;

											$scope.preguntas.valores[i].id = $scope.variable[""+pregunta].id;
											$scope.preguntas.valores[i].adicional = 0;



											$scope.preguntas.valores[i].respuesta={};
											var i2 = 0;

											$scope.indiceRespuestas =	shuffleNoPromise(Object.keys($scope.variable[pregunta].answers ) );



											for(respuesta in $scope.indiceRespuestas){

												var id=$scope.indiceRespuestas[respuesta];

												$scope.preguntas.valores[i].respuesta[id]={};
												$scope.preguntas.valores[i].respuesta[id].id = id;
												$scope.preguntas.valores[i].respuesta[id].descripcion = $scope.variable[pregunta].answers[id].description;


												if($scope.variable[pregunta].answers[id].points){
													$scope.preguntas.valores[i].respuesta[id].puntos= $scope.variable[pregunta].answers[id].points;
												}


												if($scope.variable[pregunta].answers[id].value){
													$scope.preguntas.valores[i].respuesta[id].value = $scope.variable[pregunta].answers[id].value;
												}

												var i4=0;
												if($scope.variable[pregunta].answers[id].question){
													$scope.preguntas.valores[i].respuesta[id].preguntaAdicional ={};
													$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.text= $scope.variable[pregunta].answers[id].question.text;
													$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta={};



													for(compuesta in $scope.variable[pregunta].answers[id].question.answers){

														$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta[compuesta]={};
														$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta[compuesta].id = compuesta;
														$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta[compuesta].descripcion = $scope.variable[pregunta].answers[id].question.answers[compuesta].description;
														i4++;

														if($scope.variable[pregunta].answers[id].question.answers[compuesta].value){
															$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.respuesta[compuesta].value =  	$scope.variable[pregunta].answers[id].question.answers[compuesta].value;
														}

													}

													$scope.preguntas.valores[i].respuesta[id].preguntaAdicional.cantidadRespuestas=i4;
													$scope.preguntas.valores[i].adicional=i4;
												}





												i2++;
											}

											if(i2 == 2){
												$scope.preguntas.valores[i].binaria=true;
											}

											$scope.preguntas.valores[i].cantidadRespuestas= i2;



											i++;
										}

										$scope.porcentaje=( (($scope.preguntas.actual+1) / $scope.cantidadPreguntas))*100     ;

										$scope.indicesRandom = $scope.indices;
										$scope.variable = $scope.preguntas.valores;
									



									}, function(causa) {

									});


								}



							});

}

$scope.mostrarLeyenda = "noVisible";

$scope.visibleAdicionales = "";
$scope.disabledRespuestas = false;


$scope.respuestaCompuesta = function(id){

	$scope.disabedAnidadas = true;
	$scope.idAnidada = id;

	$scope.correctaAnidada = "Info";
	$scope.variableUpdate = 
	{
		"name": $scope.usuario.nombre,
		"uid" : $scope.datosUsuario.uid,
	};

	//para hacer que se pueda responder cuantas veces se requiera
	$scope.variableUpdate["anidada"+$scope.usuario.vecesCompletado] = id;

	var guardarRespuesta = firebase.database().ref("respuestas/breastCancer/"+$scope.preguntas.valores[$scope.preguntas.actual].id+"/"+$scope.datosUsuario.uid)
	.update($scope.variableUpdate);

	if("info" in $scope.preguntas.valores[$scope.preguntas.actual]){
	

		$scope.visibleAdicionales = "";
		$scope.disabledRespuestas = true;
		$scope.mostrarLeyenda = "visible";

		if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].value == true){
			$scope.correcta="Correcta";
		}else{
			$scope.correcta="Incorrecta";
		}

		if($scope.preguntas.valores[$scope.preguntas.actual].tipo == "Riesgo"){
			$scope.correcta="Info";
		}

	}else{
		$scope.seguir();
	}


	

}

$scope.desabledSeleccion = false;

$scope.respuesta = function(id){

	$scope.disabedAnidadas = false;
	$scope.correctaAnidada = "";

	$scope.idSeleccionada= id;
	$scope.mostrarLeyenda = "";

	$scope.disabledRespuestas = true;

	//es necesario revisar en el numero de veces que ha completado el test, para asi mismo guardar una respuesta u otra, asi que  que se pone en "r" y la cantidad
	//de veces completado el test, asi, cuando no lo ha completado, las respuestas seran guardadas en r0, y si ya lo completo una vez, en r1


	var date = new Date();


	var mes=(date.getMonth())+(1);
	var dia=date.getDate();
	var ano=date.getFullYear();

	if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].puntos){
		$scope.puntos=$scope.puntos +  $scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].puntos;

	}

	$scope.variableUpdate = 
	{
		"name": $scope.usuario.nombre,
		"uid" : $scope.datosUsuario.uid,
	}

	//para hacer que se pueda responder cuantas veces se requiera
	$scope.variableUpdate["respuesta"+$scope.usuario.vecesCompletado] = id;

	var guardarRespuesta = firebase.database().ref("respuestas/breastCancer/"+$scope.preguntas.valores[$scope.preguntas.actual].id+"/"+$scope.datosUsuario.uid)
	.update($scope.variableUpdate);




	var cambiarEstados = firebase.database().ref("usuarios/"+$scope.datosUsuario.uid)
	.update({
		"state" : 1,
		"currentPointsBreast" : $scope.puntos
	});


	if(($scope.preguntas.actual) < $scope.cantidadPreguntas){

		$scope.mostrarLeyenda = "noVisible";

		if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].preguntaAdicional){

			$scope.visibleAdicionales = "visibleOPciones";
			$scope.disabledRespuestas = true;
			$scope.mostrarLeyenda = "noVisible";
			$scope.correcta="Correcta";

			if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].value == true){
				$scope.correcta="Correcta";
			}else{
				$scope.correcta="Incorrecta";

			}


			if($scope.preguntas.valores[$scope.preguntas.actual].tipo == "Riesgo"){
				$scope.correcta="Info";
			}

		}else{


			if("info" in $scope.preguntas.valores[$scope.preguntas.actual]){
				
				$scope.porcentaje=( (($scope.preguntas.actual+1) / $scope.cantidadPreguntas))*100     ;
				$scope.visibleAdicionales = "";
				$scope.disabledRespuestas = true;
				$scope.mostrarLeyenda = "visible";

				if($scope.preguntas.valores[$scope.preguntas.actual].respuesta[id].value == true){
					$scope.correcta="Correcta";
				}else{
					$scope.correcta="Incorrecta";
				}

				if($scope.preguntas.valores[$scope.preguntas.actual].tipo == "Riesgo"){
					$scope.correcta="Info";
				}

			}else{

				if($scope.preguntas.valores[$scope.preguntas.actual].tipo != "Riesgo"){

					$scope.porcentaje=( (($scope.preguntas.actual+1) / $scope.cantidadPreguntas))*100     ;
					$scope.visibleAdicionales = "";
					$scope.disabledRespuestas = true;
					$scope.mostrarLeyenda = "visible";
					$scope.correcta="Correcta";
				}else{
					$scope.seguir();
				}
			}
		}

	}
	else
	{
		$scope.marcoPremio="visibleOPciones";
		$scope.marco="noVisible";
	}
}

$scope.seguir = function(){

	$scope.correcta="";

	if(($scope.preguntas.actual+1) < $scope.cantidadPreguntas){

		$scope.mostrarLeyenda = "noVisible";
		$scope.visibleAdicionales = "";
		$scope.disabledRespuestas = false;
		$scope.preguntas.actual++;
		$scope.porcentaje=( (($scope.preguntas.actual+1) / $scope.cantidadPreguntas))*100     ;
	}else{
		firebase.database().ref("configuracion").once('value' , function(llegada) {

			$scope.lapso = llegada.val().lapseBreast;


			$scope.fechaTerminado = new Date(); 

			$scope.fechaProximoExamen = $scope.fechaTerminado.setHours($scope.lapso * 24, 0, 0);

			$scope.fechaProximoExamen = new Date($scope.fechaProximoExamen);

			$scope.diferencia = $scope.fechaProximoExamen.getDate()-new Date().getDate() ;

			$scope.$apply();


			$scope.marcoPremio="visibleOPciones";
			$scope.marco="noVisible";

			document.getElementById("marcoPremio").classList.remove("noVisible");
			document.getElementById("marcoPremio").classList.add("visible");


			document.getElementById("marcoPregunta").classList.remove("visible");
			document.getElementById("marcoPregunta").classList.add("noVisible");


			document.getElementById("infoPremio").classList.remove("noVisible");
			document.getElementById("infoPremio").classList.add("visible");

		});



		var date = new Date();
		var mes=(date.getMonth())+(1);
		var dia=date.getDate();
		var ano=date.getFullYear();


		//miro que boton poner, si ir a cervix o ir a premios

		firebase.database().ref("usuarios/"+$scope.datosUsuario.uid).once('value' , function(data) {
			

			if(data.val().repetitionsAnswersCervix == $scope.rondas){
				//ya acabe cervix 
				
				document.getElementById("btnPuntos").classList.remove("noVisible");
				document.getElementById("btnPuntos").classList.add("visible");
				
			}
			else{
				//no he acabado cervix
				
				document.getElementById("btnTest").classList.remove("noVisible");
				document.getElementById("btnTest").classList.add("visible");
				
			}


		});




		//consulto que puntaje en seno es el mayor, para asi saber si guardo o no
		firebase.database().ref("usuarios/"+$scope.datosUsuario.uid).once('value' , function(llegada) {

			if(llegada.val() == null ){
				$location.path( "login" );
				//que no deberia ocurrir 
			}
			else{

			//si en este test consiguio mas puntos, los dejo como los finales en breastpoints
			if($scope.puntos >= $scope.puntosActuales){

				$scope.puntosMostrar = $scope.puntos;

				var cambiarEstados = firebase.database().ref("usuarios/"+$scope.datosUsuario.uid)
				.update({
					"dateCompletedBreast": dia+"/"+mes+"/"+date.getFullYear(),

					"repetitionsAnswersBreast" : $scope.usuario.vecesCompletado + 1,
					"currentPointsBreast" : 0,
					"pointsBreast" : $scope.puntos
				});

				$scope.$apply();
			}
			else{

				$scope.puntosMostrar = $scope.puntos;

				var cambiarEstados = firebase.database().ref("usuarios/"+$scope.datosUsuario.uid)
				.update({
					"dateCompletedBreast": dia+"/"+mes+"/"+date.getFullYear(),

					"repetitionsAnswersBreast" : $scope.usuario.vecesCompletado + 1,
					"currentPointsBreast" : 0,
				});

				$scope.$apply();

			}
		}


	});

		var cambiarEstados = firebase.database().ref("usuarios/"+$scope.datosUsuario.uid)
		.update({
			"dateCompletedBreast": dia+"/"+mes+"/"+date.getFullYear(),
			
			"repetitionsAnswersBreast" : $scope.usuario.vecesCompletado + 1,
			"currentPointsBreast" : 0,
		});


	}

}


}
});

} else {
	$location.path( "login" );
}
});



})

})();