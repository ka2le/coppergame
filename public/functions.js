var roomID = -1;
var role = "host";
var playerNumber = 0;
var players = [];
var playerTurn = 0;
var numberOfPlayers = 0;
var cheatsOn = false;
var finishedLoaded = false;
function onload(){
	//console.log("start");
	startConnection();
	jQueryInits();
	if(window.location.host=="localhost:4330"){
		continueOnload();
		continueOnload2();
	}
	 
}

function continueOnload(){
	//console.log("continueOnload does nothing now on host.");
	console.log("hej");
	 $(function() {
    $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
      function(json) {
        console.log("My public IP address is: ", json.ip);
		send("serverTalk", "IP", json.ip);
		//joinByID(30);
      }
    );
  });
  
}
function continueOnload2(){
	finishedLoaded = true;
	send("hostLoaded");
	$("#joiningDiv").hide();
	document.getElementById("roomID").innerHTML = "Room ID: "+ roomID;
}
function resetVariables(){

}

//-------------------------------------------------Handle Input-----------------------------------------------------------------------------------------------------------------------------------------------
function handleServerTalk(intent, data, data2){
	console.log("server wants "+ intent);
	console.log("data "+data);
	console.log("data2 "+data2);
	if(finishedLoaded){
		console.log("I am loaded");
	}else{
		if(intent=="addedToRoom"){
			roomID = data;
			var isNewRoom = data2;
			continueOnload2();
		}
		if(intent=="noSuchID"){
			console.log("Room Not Found");
		}
	}
}
function joinByID(id){
	console.log("trying to join room with ID "+id);
	send("serverTalk", "ID", id);
}	
function handleInput(data){
	var intent = data.intent;
	console.log(data);
	if(intent=="serverTalk"){
		console.log("serverTalk");
		handleServerTalk(data.value, data.value2, data.value3);
	}
	if(intent=="reconnect" || intent=="iAmReady"){
		//send("canvasSize", canvasWidth, canvasHeight);
		var thisplayerNumber = data.playerNumber;
		activatePlayer(thisplayerNumber);
		send(turnString, currentPlayerNumber, currentWord);
	}
	
}	


function handleReconnect(){
	 joinByID(roomID);
}

	
//------------------------------------------------Jquery----------------------------------------------------------------------------------------------------------------------------------------------

function jQueryInits(){
	$('#gameFrame').load(function(){
    document.getElementById('gameFrame').contentWindow.gameLoaded();
});
	$( "#menuContainer" ).click(function( event ) {
		event.stopPropagation();
		// Do something
	});
	$("#cheatsCheck").click(function() {
        if($(this).is(":checked")){
			enableCheats()
		}else{
			disableCheats();
		}
    });
	$(window).resize(function () {
	});



}



//-------------------------------------------------Menu stuff-----------------------------------------------------------------------------------------------------------------------------------------------

function enableCheats(){
	cheatsOn = true;
	$(".scoreText").prop('readonly', false);
}
function disableCheats(){
	cheatsOn = false;
	$(".scoreText").prop('readonly', true);
}
function toggleMenu(){
//	console.log("toggleMenu");
	if($("#menubackground").is(':visible')){
		$("#menubackground").fadeOut("fast");
	}else{
		$("#menubackground").fadeIn("fast");
	}
	
}
function hideMenu(){
	$("#menubackground").fadeOut("fast");
}




//-------------------------------------------------Test functions----------------------------------------------------------------------------------------------------------------------------------------------
function loadIframe(){
	document.getElementById("gameFrame").src = "Iframe Template/host.htm";
	
}

function testDraw(){
	//toggleMenu();
	var message = "00340150";
	//console.log(message.length);
	doSocketMessage(message);
}
function testplayerJoin(playerId){
	//toggleMenu();
	var message = {
      intent: "iAmReady",
	  value: "",
	  value2: playerNumber,
	  sender: "host",
	  playerNumber: playerId
    };
	handleInput(message);
}
function removeAllRooms(){

 send("serverTalk", "resetRooms");
}