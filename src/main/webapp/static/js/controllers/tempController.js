/**
 * Created by Mac on 3/26/14.
 */
define([], function () {

    $(document).ajaxSend(function (event, xhr, settings) {
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

    function TempController(tempUtil, title, crSpline) {
        var _this = {};
        _this.isInit = false;
        _this.climateDisplay = ".overall-temp-display";
        _this.climateValueDisplay = ".inner-overall-display";

        _this.timeoutReference = undefined;
        _this.tempChangeReference = undefined;
        _this.interval = undefined;
        _this.intervalTime = 100;
        _this.powerState = false;

        _this.date = new Date();

        _this.touchStart = 0;

        _this.retryCount = 0;
        _this.retryReference = 5000;

        _this.tempUtil = tempUtil;
        _this.title = title;
        _this.crSpline = crSpline;


        _this.state = {
            currState: {
                power: false,      //is the system on or off, starts off in the off state.
                temp: 70,          //temperature set to.
                fan: false,        //if auto, unchecked, if on, checked.
                system: false      //if heat, unchecked, if cool, checked.
            },
            prevState: {
                power: false,
                temp: 70,
                fan: false,
                system: false
            },
            isEqual: function () {
                return this.prevState.power === this.currState.power &&
                    this.prevState.temp === this.currState.temp &&
                    this.prevState.fan === this.currState.fan &&
                    this.prevState.system === this.currState.system;
            },
            transfer: function () {
                this.prevState.power = this.currState.power;
                this.prevState.temp = this.currState.temp;
                this.prevState.fan = this.currState.fan;
                this.prevState.system = this.currState.system;
            },
            power: function (power) {
                if (typeof power === 'boolean') {
                    this.transfer();
                    this.currState.power = power;
                    this.updateState();
                }
            },
            temp: function (temp) {
                if (typeof temp === 'number' && temp === parseInt(temp)) {
                    this.transfer();
                    this.currState.temp = temp;
                    this.updateState();
                }
            },
            fan: function (fan) {
                if (typeof fan === 'boolean') {
                    this.transfer();
                    this.currState.fan = fan;
                    this.updateState();
                }
            },
            system: function (system) {
                if (typeof system === 'boolean') {
                    this.transfer();
                    this.currState.system = system;
                    this.updateState();
                }
            },
            setAll: function (power, temp, fan, system, shouldSave) {
                temp = parseInt(temp);
                if (typeof power === 'boolean' && (typeof temp === 'number' && temp === parseInt(temp)) && typeof fan === 'boolean' && typeof system === 'boolean') {
                    this.transfer();
                    this.currState.power = power;
                    this.currState.temp = temp;
                    this.currState.fan = fan;
                    this.currState.system = system;
                }

                if (shouldSave) {
                    this.updateState();
                }
            },
            updateState: function () {
                if (!this.isEqual()) {
                    saveState();
                }
            },
            renderState: function () {
                $("#power-checkbox").prop('checked', this.currState.power).trigger('change');
                setThermostat(this.currState.temp);
                $("#fan-switch").prop('checked', this.currState.fan).trigger('change');
                $("#system-switch").prop('checked', this.currState.system).trigger('change');
            }

        };

        var deInitialize = function () {
            if (!_this.isInit) {
                return;
            }
            _this.isInit = false;

            $("#circle-container").remove();
        };

        var init = function () {
            if (_this.isInit) {
                return;
            }
            $('#roomname').text('Current Temperature');

            _this.tempUtil.functions().initCircles();
            retrieveState();
            probeTemperature();

            $("#warm-temp").on('touchstart',function () {
                _this.touchStart = _this.date.getTime();
            }).on('touchend', function () {
                    var diff = _this.date.getTime() - _this.touchStart;

                    if (diff < 1000) {
                        increaseTemp();
                    }
                    _this.touchStart = 0;
                });

            $("#cool-temp").on('touchstart',function () {
                _this.touchStart = _this.date.getTime();
            }).on('touchend', function () {
                    var diff = _this.date.getTime() - _this.touchStart;

                    if (diff < 1000) {
                        decreaseTemp();
                    }
                    _this.touchStart = 0;
                });

            /*Cancels the Interval which sets the temperature when the user moves, or removes hand from control*/
            $("#warm-temp").on('touchend', cancelTempChangeInterval);
            $("#warm-temp").on('touchcancel', cancelTempChangeInterval);
            $("#cool-temp").on('touchend', cancelTempChangeInterval);
            $("#cool-temp").on('touchcancel', cancelTempChangeInterval);

            $("#warm-temp").mousedown(function (e) {
                _this.interval = setInterval(increaseTemp, _this.intervalTime);
            }).mouseup(function () {
                    cancelTempChangeInterval();
                });

            $("#cool-temp").mousedown(function (e) {
                _this.interval = setInterval(decreaseTemp, _this.intervalTime);
            }).mouseup(function () {
                    cancelTempChangeInterval();
                });

            $("#power-checkbox").on("change", function (e) {
                var isOn = $(this).prop('checked');
                powerStateChanged(isOn);
                if (isOn) {
                    setThermostat(getTemp());
                } else {
                    setThermostat('---');
                }
            });

            $("#system-switch").on("change", function () {
                //console.log("system-switch: " + $(this).prop('checked'));
                systemStateChanged($(this).prop('checked'));

                if (_this.timeoutReference) {
                    clearTimeout(_this.timeoutReference);
                }
                _this.timeoutReference = setTimeout(makeAjaxCallToArduino(), 5000);
            });

            $("#fan-switch").on("change", function () {
                //console.log("fan-switch: " + $(this).prop('checked'));
                fanStateChanged($(this).prop('checked'));

                if (_this.timeoutReference) {
                    clearTimeout(_this.timeoutReference);
                }
                _this.timeoutReference = setTimeout(makeAjaxCallToArduino(), 5000);
            });

            $(".days").on("click", function (e) {
                var id = $(this).attr("id");
                id = '#' + id;
                var functions = _this.tempUtil.functions();
                var day = functions.getDay(id);

                if (!day.center()) {
                    functions.toCenter(day);
                } else {
                    if (!day.expanded()) {
                        functions.expandCenter(day);
                    } else {
                        handleClock(e);
                    }
                }
            });


            $(".days").dblclick(function () {
                var id = $(this).attr("id");
                id = '#' + id;
                var functions = _this.tempUtil.functions();
                var day = functions.getDay(id);

                if (day.center() && day.expanded()) {
                    functions.collapseCenter(day);
                    saveUserSettings(day);
                }
            });
        };

        var increaseTemp = function () {
            var temp = getTemp();

            if (temp < _this.tempUtil.max()) {
                temp++;

                tempStateChanged(temp);

                setThermostat(temp);
            }
        };

        var decreaseTemp = function () {
            var temp = getTemp();

            if (temp > _this.tempUtil.min()) {
                temp--;

                tempStateChanged(temp);

                setThermostat(temp);
            }
        };

        var getTemp = function () {
            var temp = $(".inner-overall-display").text();

            if (temp === undefined || temp === '' || temp === '---') {
                temp = parseInt(_this.state.currState.temp);
            } else {
                temp = parseInt(temp);
            }
            //console.log(temp);
            return temp;
        };

        var displayTemp = function (temp) {
            var innerElement = $(".inner-rooms-display");
            if (temp != null && temp !== undefined && (temp === parseInt(temp) || temp == parseFloat(temp))) {
                temp = parseInt(temp);
                innerElement.text(temp);
            } else {
                innerElement.text("---");
            }
        };

        var setThermostat = function (temp) {
            var outerElement = $(".overall-temp-display");
            var innerElement = $(".inner-overall-display");

            if (_this.state.currState.power && temp != null && temp !== undefined && (temp === parseInt(temp))) {
                var rgb = _this.tempUtil.rgb(temp);

                outerElement.css("border-color", "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")");
                innerElement.text(temp);
                innerElement.css("border-color", "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")");

                if (_this.timeoutReference) {
                    clearTimeout(_this.timeoutReference);
                }
                _this.timeoutReference = setTimeout(makeAjaxCallToArduino(), 5000);
            } else {
                innerElement.text('---');
            }
        };

        var makeAjaxCallToArduino = function () {
            if (_this.state.currState.power) {
                //MAKE CALL TO ARDUINO TO SET TEMP USING SETTINGS FROM _this.state.currState
            }
        };

        var cancelTempChangeInterval = function () {
            clearInterval(_this.interval);
        };

        var probeTemperature = function () {
            $.ajax({
                type: 'GET',
                cache: false,
                url: 'http://192.168.11.50',
                dataType: 'text',
                timeout: (5 * 1000),
                success: function (response) {
                    var temp = JSON.parse(JSON.stringify(eval("(" + response + ")")));
                    displayTemp(temp.farenheit);

                    if (!_this.tempInterval) {
                        _this.tempInterval = setInterval(probeTemperature, 60000);
                    }
                },
                error: function (objAJAXRequest, strError) {
                    //console.log("error was thrown: " + strError);

                    if (_this.retryCount < 5) {
                        if (_this.retryReference) {
                            clearTimeout(_this.retryReference);

                            _this.retryReference = setTimeout(probeTemperature, 5000);
                        } else {
                            _this.retryReference = setTimeout(probeTemperature, 5000);
                        }
                        _this.retryCount++;
                    } else {
                        clearTimeout(_this.retryReference);
                        _this.retryCount = 0;
                    }
                }
            });
        };

        var retrieveState = function () {
            $.ajax({
                type: 'GET',
                cache: false,
                url: '/opus/tempstate/',
                dataType: 'json',
                success: function (response) {
                    //console.log(response);

                    manageState(response, false);
                    _this.state.renderState();

                }
            });
        };

        var saveState = function () {
            //console.log("saving state: " + _this.state.currState.power + " " + _this.state.currState.temp + " " + _this.state.currState.fan + " " + _this.state.currState.system);
            $.ajax({
                type: 'POST',
                cache: false,
                url: '/opus/tempstate/',
                data: _this.state.currState,
                dataType: 'json',
                success: function (response) {
                    manageState(response, false);
                }
            });
        };

        var retrieveUserSettings = function () {
            $.ajax({
                type: 'GET',
                cache: false,
                url: '/opus/usersettings/',
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                    manageState(response, false);
                    _this.state.renderState();

                }
            });
        };

        var saveUserSettings = function (currentElement) {
            console.log(currentElement.settings().toSerial());
            $.ajax({
                type: 'POST',
                cache: false,
                url: '/opus/usersettings/',
                data: currentElement.settings().toSerial(),
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                }
            });
        };

        var manageState = function (state, shouldSave) {
            if (state !== undefined && state !== 'None' && state !== '') {
                _this.state.setAll(state.power, state.temp, state.fan, state.system, shouldSave);
            }
        };

        var powerStateChanged = function (power) {
            _this.state.power(power);
        };

        var tempStateChanged = function (temp) {
            _this.state.temp(temp);
        };

        var fanStateChanged = function (fan) {
            _this.state.fan(fan);
        };

        var systemStateChanged = function (system) {
            _this.state.system(system);
        };

        var handleClock = function (e) {
            console.log("click registered as .days " + $(e.target).attr("class"));
            var className = $(e.target).attr("class");
            var id = e.target.id;

            console.log(id);

            if (className.indexOf("day-option") >= 0) {
                var clockPointer = $("#clock-pointer");
                var clock = $(".clock");

                var functions = _this.tempUtil.functions();
                functions.expandClock(clock, clockPointer, id);
            } else if (className.indexOf("times") >= 0) {
                var functions = _this.tempUtil.functions();
                functions.captureTimes("#" + id);
            }
        };

        return {
            unload: function () {
                deInitialize();
            },

            load: function () {
                $("#display-area").load("/OpusSocket/static/views/temperature.html", "#tempView", init);
                _this.title.set("thermostat");

            }
        };
    }

    return TempController;
});