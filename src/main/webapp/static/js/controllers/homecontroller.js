/**
 * Created by Mac on 3/26/14.
 */
define([], function() {
    function HomeController(_tileUtil, _title) {
        var newsSocketLink = "ws://" + document.location.host + document.location.pathname + "newssocket";
        var weatherSocketLink = "ws://" + document.location.host + document.location.pathname + "weathersocket/NJ/West_Deptford";
        var isInit = false;
        var titleController = _title;
        var tileUtil = _tileUtil;        
        var titleCont = _title;
        var newsSocket = undefined;
        var weatherSocket = undefined;

        var init = function() {
            if (!isInit) {
                initView();
                initSockets();//perform last
                isInit = true;
            }
        };
        
        var deInit = function(){
            killSockets();
            tileUtil.killInterval();
            isInit = false;
        };
        
        var initView = function(){
            titleController.set("home");
            $("#display-area").load("/OpusSocket/static/views/home.html", "#homeView");
        };

        var initSockets = function() {
            var newsSocketLink = "ws://" + document.location.host + document.location.pathname + "newssocket";
            newsSocket = new WebSocket(newsSocketLink);
            weatherSocket = new WebSocket(weatherSocketLink);
            newsSocket.onopen = function(evt) {
                
            };
            
            newsSocket.onmessage = function(evt){
                var data = JSON.parse(evt.data);
                tileUtil.handleMessage(data);                
            };
            weatherSocket.onmessage = function(evt){
                console.log("onmessage called");
                var data = JSON.parse(evt.data);
                tileUtil.handleWeather(data);                
            };
            
            newsSocket.onerror = function(evt){
                //onMessage(evt.data);
            };
            
            newsSocket.onclose = function(evt){
                //onMessage(evt.data);
            };
        };
        
        var killSockets = function(){
            newsSocket.close();
            weatherSocket.close();
        };
        
        return{
            load: function(){
                init();
            },
            unload: function(){
                deInit();
            }
        };
    }
    return HomeController;
});