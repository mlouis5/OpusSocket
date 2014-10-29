/**
 * Created by Mac on 3/26/14.
 */
require.config({
    paths: {
        jquery: '../frameworks/jquery',
        jqueryColor: '../frameworks/jquery.color',
        crSpline: '../frameworks/crSpline',
        slider: '../frameworks/slider',
        underscore: '../frameworks/underscore',
        backbone: '../frameworks/backbone',
        hammer: '../frameworks/hammer.min',
        debug: 'utilities/debugutility',
        title: 'utilities/titleutility',
        tile: 'jsobjects/tile',
        tileutility: 'utilities/tileUtility',
        homecontroller: 'controllers/homecontroller',
        time: 'jsobjects/time',
        userSettings: 'jsobjects/usersettings',
        day: 'jsobjects/day',
        temputility: 'utilities/temputility',
        tempcontroller: 'controllers/tempController',
        light: 'jsobjects/light',
        lightutility: 'utilities/lightutility',
        lightcontroller: 'controllers/lightController',
        weather: 'jsobjects/weather'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'jqueryColor': {
            deps: ['jquery'],
            exports: 'jcolor'
        },
        'crSpline': {
            deps: ['jquery'],
            exports: 'crSpline'
        },
        'slider': {
            deps: ['jquery'],
            exports: 'slider'
        },
        'underscore': {
            deps: ['jquery'],
            exports: '_'
        },
        'debug': {
            deps: ['jquery'],
            exports: 'Debug'
        },
        'title': {
            deps: ['jquery', 'debug'],
            exports: 'Title'
        },
        'tile': {
            deps: ['jquery', 'debug'],
            exports: 'Tile'
        },
        'tileutility': {
            deps: ['jquery', 'debug'],
            exports: 'TileUtility'
        },
        'homecontroller': {
            deps: ['jquery', 'debug', 'tile', 'title'],
            exports: 'HomeController'
        },
        'time': {
            exports: 'Time'
        },
        'userSettings': {
            exports: 'UserSettings'
        },
        'day': {
            deps: ['jquery'],
            exports: 'Day'
        },
        'temputility': {
            deps: ['jquery', 'debug'],
            exports: 'TempUtil'
        },
        'tempcontroller': {
            deps: ['jquery', 'debug', 'temputility', 'title'],
            exports: 'TempController'
        },
        'light': {
            deps: ['jquery', 'debug'],
            exports: 'Light'
        },
        'lightutility': {
            deps: ['jquery', 'debug'],
            exports: 'LightUtil'
        },
        'lightcontroller': {
            deps: ['jquery', 'debug', 'lightutility', 'title'],
            exports: 'LightController'
        },
        'weather':{
            deps: ['jquery', 'debug'],
            exports: 'Weather'
        }

    }
});

require(['jquery', 'jqueryColor', 'crSpline', 'slider', 'debug', 'title', 'tile', 
    'tileutility', 'homecontroller', 'time', 'userSettings', 'day', 'temputility', 
    'tempcontroller', 'light', 'lightutility', 'lightcontroller', 'weather'],
        function($, jc, crSpline, slider, Debug, Title, Tile, TileUtility, 
        HomeController, Time, UserSettings, Day, TempUtil, TempController, 
        Light, LightUtil, LightController, Weather) {
            $(document).ajaxSend(function(event, xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }

                function sameOrigin(url) {
                    // url could be relative or scheme relative or absolute
                    var host = document.location.host; // host + port
                    var protocol = document.location.protocol;
                    var sr_origin = '//' + host;
                    var origin = protocol + sr_origin;
                    // Allow absolute or scheme relative URLs to same origin
                    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                            // or any other URL that isn't scheme relative or absolute i.e relative.
                            !(/^(\/\/|http:|https:).*/.test(url));
                }

                function safeMethod(method) {
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                }

                if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            });

            $(document).ready(function() {



//        var socket = new io.Socket('192.168.11.100', {
//            port: 8888
//        });
//        socket.connect();
//
//// Add a connect listener
//        socket.on('connect', function () {
//            console.log('Client has connected to the server!');
//        });
//// Add a connect listener
//        socket.on('message', function (data) {
//            console.log('Received a message from the server!', data);
//        });
//// Add a disconnect listener
//        socket.on('disconnect', function () {
//            console.log('The client has disconnected!');
//        });
//
//// Sends a message to the server via sockets
//        function sendMessageToServer(message) {
//            socket.send(message);
//        }

                var _this = {};
                _this.isSmartOn = false;

                var title = new Title();

                //instantiate Tiles
                var tiles = [                    
                    new Tile("#display-tile"),                    
                    new Tile("#main-tile"),                    
                    new Tile("#tile-five"),                    
                    new Tile("#tile-four"),                    
                    new Tile("#tile-three"),                    
                    new Tile("#tile-two"),
                    new Tile("#tile-one")
                ];                
                var weather = [
                    new Weather('#weatherOne'),
                    new Weather('#weatherTwo'),
                    new Weather('#weatherThree'),
                    new Weather('#weatherFour'),
                    new Weather('#weatherFive'),
                    new Weather('#weatherSix'),
                    new Weather('#weatherSeven'),
                    new Weather('#weatherEight'),
                    new Weather('#weatherNine'),
                    new Weather('#weatherTen')
                ];
                
                var tileUtil = new TileUtility(tiles, weather);                
                var homeController = new HomeController(tileUtil, title);
                ////////////////////////////////////////////////////////
                
                var wakeTime = new Time(6, 0, 'am');
                var toWorkTime = new Time(6, 45, 'am');
                var fromWorkTime = new Time(7, 15, 'pm');
                var toSleepTime = new Time(11, 30, 'pm');

                var monSettings = new UserSettings(wakeTime, toWorkTime, fromWorkTime, toSleepTime);
                var tueSettings = new UserSettings(wakeTime, toWorkTime, fromWorkTime, toSleepTime);
                var wedSettings = new UserSettings(wakeTime, toWorkTime, fromWorkTime, toSleepTime);
                var thuSettings = new UserSettings(wakeTime, toWorkTime, fromWorkTime, toSleepTime);
                var friSettings = new UserSettings(wakeTime, toWorkTime, fromWorkTime, toSleepTime);
                var satSettings = new UserSettings(wakeTime, toWorkTime, fromWorkTime, toSleepTime);
                var sunSettings = new UserSettings(wakeTime, toWorkTime, fromWorkTime, toSleepTime);

                var days = {
                    sunday: new Day('sunday', 0, 'Sun', sunSettings),
                    monday: new Day('monday', 1, 'Mon', monSettings),
                    tuesday: new Day('tuesday', 2, 'Tues', tueSettings),
                    wednesday: new Day('wednesday', 3, 'Wed', wedSettings),
                    thursday: new Day('thursday', 4, 'Thur', thuSettings),
                    friday: new Day('friday', 5, 'Fri', friSettings),
                    saturday: new Day('saturday', 6, 'Sat', satSettings)
                };

                var lights = [
                    new Light("light-1", "mst. Bedroom"),
                    new Light("light-2", "lvg. room"),
                    new Light("light-3", "kitchen"),
                    new Light("light-4", "gs. Bathroom"),
                    new Light("light-5", "fml. room"),
                    new Light("light-6", "office"),
                    new Light("light-7", "garage")
                ];


                var tempUtil = new TempUtil(days);
                var tempController = new TempController(tempUtil, title, crSpline);
                var lightUtil = new LightUtil(lights, 242);
                var lightController = new LightController(lightUtil, title);

                initializePage();

                function initializePage() {
                    $("#home").on('click', function() {
                        unloadAll();
                        homeController.load();
                    });

                    $("#temp").on('click', function() {
                        unloadAll();
                        tempController.load();
                    });

                    $("#light").on('click', function() {
                        unloadAll();
                        lightController.load();
                    });

                    $(".smart-tag").on('click', function() {
                        console.log("clicked");
                        if (_this.isSmartOn) {
                            $(".smart-tag").removeClass('smartOn');
                        } else {
                            $(".smart-tag").addClass('smartOn');
                        }
                        _this.isSmartOn = !_this.isSmartOn;
                    });

                    homeController.load();
                    //title.set("home");
                    //$("#display-area").load("/OpusSocket/static/views/home.html", "#homeView");

                }

//            function initSlider() {
//                $("#temp-range").noUiSlider({
//                    start: [66, 74],
//                    connect: true,
//                    range: {
//                        'min': 55,
//                        'max': 95
//                    }
//                });
//            }

                function unloadAll() {
                    tempController.unload();
                    lightController.unload();
                    homeController.unload();
                }

                function getAnglePos(radius, angle) {
                    var coord = {};

                    coord.x = getX(radius, angle);
                    coord.y = getY(radius, angle);

                    return coord;
                }

                function getX(radius, angle) {
                    var rad = angle * Math.PI / 180
                    var intVal = parseInt(radius * Math.cos(rad));

                    if (angle > 90 && angle < 270) {
                        intVal = radius + intVal;
                    }

                    return intVal < 0 ? 0 : intVal;
                }
                ;

                function getY(radius, angle) {
                    var rad = angle * Math.PI / 180
                    var y = radius * Math.sin(rad);
                    console.log("y " + y);
                    if (angle <= 180) {
                        y = radius - y;
                    } else {
                        y = radius + (y * -1);
                    }
                    var intVal = parseInt(y);
                    return intVal < 0 ? 0 : intVal;
                }
            });
        })
        ;