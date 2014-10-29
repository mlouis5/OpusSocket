/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// For testing purposes
var output = document.getElementById("output");
var button = document.getElementById("test");
button.addEventListener("click", function (event) {
            event.preventDefault();
            websocketWeather.send("this is a test");
        }, false);
//var wsUri = "ws://" + document.location.host + document.location.pathname + "sportnewssocket";
//var websocket = new WebSocket(wsUri);

var wsWeatherUri = "ws://" + document.location.host + document.location.pathname + "newssocket";// "weathersocket/NJ/West_Deptford";
var websocketWeather = new WebSocket(wsWeatherUri);

//websocket.onopen = function(evt) {
//    onOpen(evt);
//};

websocketWeather.onopen = function(evt) {
    onOpen(evt);
};

//websocket.onmessage = function(evt){
//    onMessage(evt.data);
//};

websocketWeather.onmessage = function(evt){
    onMessage(evt.data);
};

//websocket.onerror = function(event) {
//    onError(event);
//};

websocketWeather.onerror = function(event) {
    onError(event);
};

function writeToScreen(message) {
    output.innerHTML += message + "<br><br><br>";
}

function onOpen() {
    writeToScreen("Connected to " + wsWeatherUri);
}

function onMessage(message){
    writeToScreen(message);
}
// End test functions

function onError(event) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + event.data);
}