/**
 * Created by Mac on 4/4/14.
 */
define([], function() {
    function TempUtil(days) {


        var _this = {};

        var fadeClockFace = function(timeId, toFadeOut, toFadeIn) {
            if (timeId !== undefined && timeId !== null) {
                colorChange(timeId, "#92DB72");
            }

            $(toFadeOut).css({
                zIndex: 1
            });
            $(toFadeOut).animate({
                opacity: 0
            }, 500, function() {
                $(toFadeIn).css({
                    zIndex: 9
                });
                $(toFadeIn).animate({
                    opacity: 1
                });
            });
        }

        var fadeFade = function(toFadeOut, otherFadeOut, toFadeIn) {
            fadeClockFace(null, toFadeOut, toFadeIn);
            fadeClockFace(null, otherFadeOut, toFadeIn);
        }

        var colorChange = function(timeId, color) {
            $(timeId).animate({
                backgroundColor: color
            }, 500);
        }

        var hardColorChange = function(id, color) {
            $(id).css({
                'background-color': color
            })
        }

        var resetClockFace = function() {
            _this.minute.reset();
            $(".times").each(function(i) {
                var id = $(this).attr("id");

                console.log(id);
                console.log(id.indexOf('period'));

                if (id.indexOf("hours") >= 0 || id.indexOf("minutes") >= 0 || id.indexOf("period") >= 0) {
                    console.log("index found");
                    hardColorChange(("#" + id), "#FFAB68");
                }
            });
        }

        _this.rgb = function(temp) {
            _this.init();
            var index = _this.TEMP_RANGE.indexOf(temp);

            if (index > -1) {
                _this.LAST_RGB = _this.RGB_SPECTRUM[index];
            }
            return _this.LAST_RGB;
        };

        _this.TEMP_RANGE;
        _this.RGB_SPECTRUM;
        _this.LAST_RGB;
        _this.MIN_TEMP = -50;
        _this.MAX_TEMP = 160;
        _this.isInit = false;//SET TO TRUE WITHIN calculateSpectrum().

        _this.minute = {
            one: -1,
            two: -1,
            min: function() {
                var aMin = "" + this.one + this.two;
                return parseInt(aMin);
            },
            reset: function() {
                this.one = -1;
                this.two = -1;
            }
        };

        var clockPositions = {
            width: 200,
            height: 200,
            wakeup: {
                clock_position: {
                    top: 21
                },
                pointer_position: {
                    top: 0
                }
            },
            to_work: {
                clock_position: {
                    top: 46
                },
                pointer_position: {
                    top: 52
                }
            },
            from_work: {
                clock_position: {
                    top: 46
                },
                pointer_position: {
                    top: 127
                }
            },
            to_sleep: {
                clock_position: {
                    top: 70
                },
                pointer_position: {
                    top: 177
                }
            }
        }

        var position = {
            count: -1,
            center: [1240, 155, undefined],
            small: [
                [1100, 230, {pathToCenter: [
                            [1100, 230],
                            [1300, 230],
                            [1240, 155]
                        ], pathToOrig: [
                            [1240, 155],
                            [1100, 230]
                        ]}],
                [1210, 40, {pathToCenter: [
                            [1210, 40],
                            [1300, 100],
                            [1240, 155]
                        ],
                        pathToOrig: [
                            [1240, 155],
                            [1210, 40]
                        ]}],
                [1410, 40, {pathToCenter: [
                            [1410, 40],
                            [1440, 140],
                            [1240, 155]
                        ],
                        pathToOrig: [
                            [1240, 155],
                            [1410, 40]
                        ]}],
                [1530, 230, {pathToCenter: [
                            [1530, 230],
                            [1320, 310],
                            [1240, 155]
                        ],
                        pathToOrig: [
                            [1240, 155],
                            [1530, 230]
                        ]}],
                [1410, 420, {pathToCenter: [
                            [1410, 420],
                            [1480, 360],
                            [1240, 155]
                        ],
                        pathToOrig: [
                            [1240, 155],
                            [1410, 420]
                        ]}],
                [1210, 420, {pathToCenter: [
                            [1210, 420],
                            [1310, 400],
                            [1240, 155]
                        ],
                        pathToOrig: [
                            [1240, 155],
                            [1210, 420]
                        ]}]
            ],
            next: function() {
                var count = ++this.count;
                if (count < this.small.length) {
                    return this.small[this.count];
                } else {
                    this.count = -1;
                    return undefined;
                }
            }
        };

        var daysForm = '<section id="days-form">\
                <div id="temp-range"></div>\
                <div class="temp-range-label-container">\
                    <div class="slider-labels" id="left-label">\
                        Min Temp\
                        <div class="up-arrow" id="left-up-arrow"></div>\
                    </div>\
                    <div class="range-display" id="min-display"></div><div class="range-display" id="range-label">Range</div><div class="range-display" id="max-display"></div>\
                    <div class="slider-labels" id="right-label">\
                        Max Temp\
                        <div class="up-arrow" id="right-up-arrow"></div>\
                    </div>\
                </div>\
                <div class="temp-options-container">\
                    <div class="day-option slider-labels" id="wakeup"></div>\
                    <div class="day-option slider-labels" id="to_work"></div>\
                    <div class="day-option slider-labels" id="from_work"></div>\
                    <div class="day-option slider-labels" id="to_sleep"></div>\
                    <div class="clock">\
                        <div id="clock-pointer"></div>\
                        <div id="clock-period">\
                            <section class="times" id="period-am">AM</section>\
                            <section class="times" id="period-pm">PM</section>\
                        </div>\
                        <div id="clock-minutes">\
                            <section id="minute-label">Minutes</section>\
                            <section class="times" id="minutes-0">0</section>\
                            <section class="times" id="minutes-1">1</section>\
                            <section class="times" id="minutes-2">2</section>\
                            <section class="times" id="minutes-3">3</section>\
                            <section class="times" id="minutes-4">4</section>\
                            <section class="times" id="minutes-5">5</section>\
                            <section class="times" id="minutes-6">0</section>\
                            <section class="times" id="minutes-7">1</section>\
                            <section class="times" id="minutes-8">2</section>\
                            <section class="times" id="minutes-9">3</section>\
                            <section class="times" id="minutes-10">4</section>\
                            <section class="times" id="minutes-11">5</section>\
                            <section class="times" id="minutes-12">6</section>\
                            <section class="times" id="minutes-13">7</section>\
                            <section class="times" id="minutes-14">8</section>\
                            <section class="times" id="minutes-15">9</section>\
                        </div>\
                        <div id="clock-hours">\
                            <section id="hour-label">Hours</section>\
                            <section class="times" id="hours-1">1</section>\
                            <section class="times" id="hours-2">2</section>\
                            <section class="times" id="hours-3">3</section>\
                            <section class="times" id="hours-4">4</section>\
                            <section class="times" id="hours-5">5</section>\
                            <section class="times" id="hours-6">6</section>\
                            <section class="times" id="hours-7">7</section>\
                            <section class="times" id="hours-8">8</section>\
                            <section class="times" id="hours-9">9</section>\
                            <section class="times" id="hours-10">10</section>\
                            <section class="times" id="hours-11">11</section>\
                            <section class="times" id="hours-12">12</section>\
                        </div>\
                    </div>\
                </div>\
            </section>';

        _this.planner = {
            changed: false,
            expandTo: 270,
            shrinkTo: 120,
            largeFont: 35,
            smallFont: 30,
            twentyFiveFont: 25,
            noFont: 0,
            centerAlign: 'center',
            fullyVisible: 1.0,
            partialVisible: 0.5,
            invisible: 0,
            positions: position,
            tempRange: '#temp-range',
            minDisplay: '#min-display',
            maxDisplay: '#max-display',
            noUiConnect: '.noUi-connect',
            plannerForm: '#days-form',
            smallCircleClass: "small-circle",
            centerCircleClass: "center-circle",
            largeInnerDayClass: "large-inner-day",
            week: days,
            functions: {
                hasChanged: function() {
                    return this.changed;
                },
                toCenter: function(day) {
                    var centerElem = this.getCenterElem();

                    if (centerElem !== undefined) {
                        centerElem.path(day.path());
                        this.toOrig(centerElem);

                        var outerElem = day.getUI();
                        var innerElem = day.getInnerUI();
                        innerElem.opacity = _this.planner.invisible;

                        innerElem.animate({
                            width: _this.planner.shrinkTo - 40,
                            height: _this.planner.shrinkTo - 40
                        }, 200).animate({
                            width: _this.planner.expandTo - 30,
                            height: _this.planner.expandTo - 30,
                            'font-size': _this.planner.noFont,
                            'font-size': _this.planner.largeFont,
                                    'text-align': _this.planner.centerAlign,
                            'line-height': _this.planner.expandTo - 30,
                            opacity: _this.planner.fullyVisible
                        }, 700
                                );

                        outerElem.animate({
                            crSpline: $.crSpline.buildSequence(day.path().pathToCenter)
                        }, 350).animate({
                            width: _this.planner.expandTo,
                            height: _this.planner.expandTo,
                            'text-align': _this.planner.centerAlign
                        }, 270
                                );

                        day.center(true);
                    }
                },
                toOrig: function(day) {
                    var outerElem = day.getUI();
                    var innerElem = day.getInnerUI();
                    innerElem.opacity = _this.planner.invisible;

                    innerElem.animate({
                        width: (_this.planner.shrinkTo - 30),
                        height: (_this.planner.shrinkTo - 30),
                        'font-size': _this.planner.smallFont,
                        'text-align': _this.planner.centerAlign,
                        'line-height': (_this.planner.shrinkTo - 30),
                        opacity: _this.planner.fullyVisible
                    }, 100);
                    outerElem.animate({
                        width: _this.planner.shrinkTo,
                        height: _this.planner.shrinkTo,
                        'text-align': _this.planner.centerAlign
                    }, 100
                            ).animate({
                        crSpline: $.crSpline.buildSequence(day.path().pathToOrig)
                    }, 400).animate({opacity: _this.planner.fullyVisible}, 120);

                    innerElem.opacity = _this.planner.fullyVisible;

                    day.center(false);
                },
                fadeOutOthers: function(exception) {
                    var week = _this.planner.week;
                    for (var key in week) {
                        if (week.hasOwnProperty(key)) {
                            var day = week[key];

                            if (day !== exception) {
                                var elem = day.getUI();
                                elem.fadeOut(300);
                            }
                        }
                    }
                },
                fadeInOthers: function(exception) {
                    var week = _this.planner.week;
                    for (var key in week) {
                        if (week.hasOwnProperty(key)) {
                            var day = week[key];

                            if (day !== exception) {
                                var elem = day.getUI();
                                elem.fadeIn(800);
                            }
                        }
                    }
                },
                expandCenter: function(centerElem) {
                    var element = centerElem.getUI();

                    this.fadeOutOthers(centerElem);
                    element.animate({
                        width: (_this.planner.expandTo * 2) + 12,
                        height: (_this.planner.expandTo * 2) + 12,
                        left: _this.planner.positions.center[0] - (_this.planner.expandTo / 2) - 6,
                        top: _this.planner.positions.center[1] - (_this.planner.expandTo / 2) - 6,
                        zIndex: 5,
                        'border-radius': 10
                    }, 500);

                    var innerElem = centerElem.getInnerUI();
                    innerElem.animate({
                        width: (((_this.planner.expandTo * 2) + 12) - 30),
                        height: (((_this.planner.expandTo * 2) + 12) - 30),
                        'font-size': _this.planner.twentyFiveFont,
                        'text-align': _this.planner.centerAlign,
                        'border-radius': 10
                    }, 500);

                    innerElem.text("");
                    innerElem.html(daysForm).hide().fadeIn(300);

                    $(_this.planner.tempRange).noUiSlider({
                        start: [centerElem.settings().min(), centerElem.settings().max()],
                        step: 1,
                        connect: true,
                        range: {
                            'min': 55,
                            'max': 95
                        },
                        serialization: {
                            lower: [
                                $.Link({
                                    target: function(value, handleElement, slider) {
                                        $(_this.planner.minDisplay).text(parseInt(value));
                                        centerElem.settings().min(value);
                                        var average = centerElem.settings().avg();
                                        var rgb = _this.rgb(Math.ceil(average));

                                        $(_this.planner.noUiConnect).animate({
                                            backgroundColor: "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"
                                        }, 250);
                                    }
                                })
                            ],
                            upper: [
                                $.Link({
                                    // Link accepts functions too.
                                    // The arguments are the slider value,
                                    // the .noUi-handle element and the slider instance.
                                    target: function(value, handleElement, slider) {
                                        $(_this.planner.maxDisplay).text(parseInt(value));
                                        centerElem.settings().max(value);
                                        var average = centerElem.settings().avg();
                                        var rgb = _this.rgb(Math.ceil(average));

                                        $(_this.planner.noUiConnect).animate({
                                            backgroundColor: "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"
                                        }, 250);
                                    }
                                })
                            ],
                            // Set some default formatting options.
                            // These options will be applied to any Link
                            // that doesn't overwrite these values.
                            format: {
                                decimals: 1
                            }

                        }
                    });
                    centerElem.expanded(true);
                },
                collapseCenter: function(centerElem) {
                    var element = centerElem.getUI();

                    this.fadeInOthers(centerElem);
                    element.animate({
                        width: (_this.planner.expandTo),
                        height: (_this.planner.expandTo),
                        left: _this.planner.positions.center[0],
                        top: _this.planner.positions.center[1],
                        zIndex: 1,
                        'border-radius': '50%'
                    }, 500);

                    var innerElem = centerElem.getInnerUI();
                    innerElem.animate({
                        width: (_this.planner.expandTo - 30),
                        height: (_this.planner.expandTo - 30),
                        'font-size': _this.planner.smallFont,
                        'text-align': _this.planner.centerAlign,
                        'border-radius': '50%'
                    }, 500);

                    $(_this.planner.plannerForm).remove();
                    innerElem.text(centerElem.text()).fadeIn(500);

                    centerElem.expanded(false);
                },
                getCenterElem: function() {
                    var week = _this.planner.week;
                    for (var key in week) {
                        if (week.hasOwnProperty(key)) {
                            var day = week[key];
                            if (day.center()) {
                                return day;
                            }
                        }
                    }
                    return undefined;
                },
                getDay: function(id) {
                    var week = _this.planner.week;
                    for (var key in week) {
                        if (week.hasOwnProperty(key)) {
                            var day = week[key];
                            if (day.id() === id) {
                                return day;
                            }
                        }
                    }
                    return undefined;
                },
                initCircles: function() {
                    var date = new Date();
                    var dayOfWeek = date.getDay();

                    var week = _this.planner.week;
                    for (var key in week) {
                        if (week.hasOwnProperty(key)) {
                            var day = week[key];
                            this.init(day, dayOfWeek);
                        }
                    }
                },
                init: function(day, dayOfWeek) {
                    var element = day.getUI();

                    if (element !== undefined) {
                        element.addClass("small-circle");

                        var num = day.dayNum();
                        var coords;

                        var innerElement = day.getInnerUI();
                        innerElement.text(day.text());
                        if (num === dayOfWeek) {
                            element.removeClass(_this.planner.smallCircleClass);
                            element.addClass(_this.planner.centerCircleClass);
                            innerElement.addClass(_this.planner.largeInnerDayClass);

                            coords = _this.planner.positions.center;
                            if (coords !== undefined) {
                                element.animate({
                                    left: coords[0],
                                    top: coords[1],
                                    width: _this.planner.expandTo,
                                    height: _this.planner.expandTo,
                                    'font-size': _this.planner.largeFont
                                }, 0);
                            }
                            day.center(true);
                        } else {
                            coords = _this.planner.positions.next();
                            if (coords !== undefined) {
                                element.animate({
                                    left: coords[0],
                                    top: coords[1],
                                    width: _this.planner.shrinkTo,
                                    height: _this.planner.shrinkTo,
                                    'font-size': _this.planner.smallFont
                                }, 0);
                            }
                            day.center(false);
                        }
                        day.path(coords[2]);
                    }
                },
                expandClock: function(clock, clockPointer, clockElementId) {
                    console.log("clock element: " + clockElementId);
                    resetClockFace();
                    fadeFade("#clock-minutes", "#clock-period", "#clock-hours");

                    var centerElem = this.getCenterElem();
                    var userSettings = centerElem.settings();
                    userSettings.currentlyOpened(clockElementId);

                    clock.animate({
                        top: clockPositions[clockElementId].clock_position.top
                    }, 300);

                    clockPointer.animate({
                        top: clockPositions[clockElementId].pointer_position.top
                    }, 300)
                },
                captureTimes: function(timeId) {
                    var split = timeId.split("-");

                    var val;
                    var currentDay = this.getCenterElem();
                    var userSettings = currentDay.settings();

                    var openedClock = userSettings.currentlyOpened();


                    if (split[0] === '#hours') {
                        val = parseInt(split[1]);

                        openedClock.hour(parseInt(val));

                        fadeClockFace(timeId, "#clock-hours", "#clock-minutes");
                    } else if (split[0] === '#minutes') {
                        val = parseInt(split[1]);

                        if (val <= 5) {
                            if (_this.minute.one == val) {
                                _this.minute.one = -1;
                                colorChange(timeId, "#FFAB68");
                            } else if (_this.minute.one === -1) {
                                _this.minute.one = val;
                                colorChange(timeId, "#92DB72");
                            }
                        } else {
                            if (_this.minute.two == (val - 6)) {
                                _this.minute.two = -1;
                                colorChange(timeId, "#FFAB68");
                            } else if (_this.minute.two === -1) {
                                _this.minute.two = (val - 6);
                                colorChange(timeId, "#92DB72");
                            }
                        }

                        if (_this.minute.one > -1 && _this.minute.two > -1 && (openedClock != null && openedClock !== undefined)) {
                            openedClock.minute(_this.minute.min());
                            console.log(_this.minute.min());

                            fadeClockFace(timeId, "#clock-minutes", "#clock-period");
                        }
                    } else if (split[0] === '#period') {
                        var per = split[1];

                        openedClock.period(per);

                        console.log("post: " + openedClock.post());

                        console.log("#" + openedClock.id());

                        $("#" + openedClock.id()).html('<span class="clock-text">' + openedClock.post() + '</span>');

                        resetClockFace();

                        fadeClockFace(timeId, "#clock-period", "#clock-hours");
                    }
                }
            }
        };

        _this.init = function() {
            if (_this.isInit) {
                return;
            }
            _this.calculateSpectrum();
        }

        _this.calculateSpectrum = function() {
            _this.TEMP_RANGE = [];
            _this.RGB_SPECTRUM = [];
            var r = 41;
            var g = 146;
            var b = 195;

            _this.LAST_RGB = _this.makeRGB(r, g, b);

            var minStop = 41;
            var maxStop = 195;

            var increment = 1.5;
            var rgbIndex = 0;
            var tempIndex = 0;
            for (var i = _this.MIN_TEMP; i <= _this.MAX_TEMP; i++) {
                _this.TEMP_RANGE[tempIndex] = i;
                _this.RGB_SPECTRUM[rgbIndex] = _this.makeRGB(r, g, b);
                rgbIndex++;
                tempIndex++;

                if (i < 70) {
                    if (g < maxStop) {
                        g = Math.floor(g + increment);
                    } else if (b > minStop) {
                        b = Math.floor(b - increment);
                    } else {
                        r = Math.floor(r + increment);
                    }
                } else {
                    if (r < maxStop) {
                        r = Math.floor(r + increment);
                    } else {
                        if (g > 0) {
                            g = Math.floor(g - increment);
                        } else if (b > 0) {
                            b = Math.floor(b - increment);
                        }
                    }
                }

                if (increment < 3.8 && i >= 70) {
                    increment = 3.8;
                } else if (increment < 6 && i >= 80) {
                    increment = 8
                }
            }
            _this.isInit = true;
        }

        _this.makeRGB = function(r, g, b) {
            var rgb = [r, g, b];
            return rgb;
        }

        return {
            rgb: function(temp) {
                return _this.rgb(temp);
            },
            min: function() {
                return _this.MIN_TEMP;
            },
            max: function() {
                return _this.MAX_TEMP;
            },
            position: function() {
                return _this.planner.positions;
            },
            planner: function() {
                return _this.planner;
            },
            functions: function() {
                return _this.planner.functions;
            },
            toCelcius: function(fahrenheit) {
                if (fahrenheit === parseInt(fahrenheit) || fahrenheit === parseFloat(fahrenheit)) {
                    return (((fahrenheit - 32) * 5) / 9);
                } else {
                    return undefined;
                }
            },
            toFahrenheit: function(celcius) {
                if (celcius === parseInt(celcius) || celcius === parseFloat(celcius)) {
                    return ((celcius * 9) / 5) + 32;
                } else {
                    return undefined;
                }
            }
        }
    }

    return TempUtil;
});