/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var wsUri = "ws://" + document.location.host + document.location.pathname + "newsendpoint/NJ/08086";
var websocket = new WebSocket(wsUri);

// For testing purposes
var output = document.getElementById("output");
websocket.onopen = function(evt) {
    onOpen(evt)
};

function writeToScreen(message) {
    output.innerHTML += message + "<br>";
}

function onOpen() {
    writeToScreen("Connected to " + wsUri);
}
// End test functions

websocket.onerror = function(event) {
    onError(event);
}

function onError(event) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + event.data);
}