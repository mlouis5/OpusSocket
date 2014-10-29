/**
 * Created by Mac on 6/14/14.
 */
define([], function() {

    function Light(lightId, room) {
        var id = lightId;
        var _room = room;
        var _isFocus = false;
        var moveEventAdded = false;

        var getAnglePosObj = function(radius, angle) {
            var coord = {};

            coord.x = getX(radius, angle);
            coord.y = getY(radius, angle);

            return coord;
        };

        var getAnglePosArray = function(radius, angle) {
            var coord = [];

            coord[0] = getX(radius, angle);
            coord[1] = getY(radius, angle);

            return coord;
        };

        var getX = function(radius, angle) {
            var rad = angle * Math.PI / 180;
            var intVal = parseInt(radius * Math.cos(rad));

            if (angle > 90 && angle < 270) {
                intVal = radius + intVal;
            }

            return intVal < 0 ? 0 : intVal;
        };

        var getY = function(radius, angle) {
            var rad = angle * Math.PI / 180;
            var y = radius * Math.sin(rad);
            if (angle <= 180) {
                y = radius - y;
            } else {
                y = radius + (y * -1);
            }
            var intVal = parseInt(y);
            return intVal < 0 ? 0 : intVal;
        };

        var position = {
            current: {
                angle: 0,
                x: 0,
                y: 0,
                radius: 0,
                stepsToCenter: 0,
                direction: this.angle > 0 ? true : false
            },
            paths: [],
            clearPath: function() {
                this.paths = [];
            }
        };

        var pathToNext = function(radius, angle, step, direction) {
            var ang = position.current.angle;
            
            console.log("ang: " + ang);
            console.log("angle: " + angle);

//            if (Math.abs(ang - angle) > 30) {
//                console.log("returning");
//                return;
//            }

            position.clearPath();
            var index = 0;
            if (direction) { //true = down
                for (var i = ang; i >= angle; i -= step) {
                    console.log("down: " + i);
                    position.paths[index++] = getAnglePosArray(radius, i);
                }
            } else { //false = up
                for (var i = ang; i <= angle; i += step) {
                    console.log("up: " + i);
                    position.paths[index++] = getAnglePosArray(radius, i);
                }
            }
        };

        var getUI = function() {
            if (id.indexOf("#") === 0) {
                return $(id);
            } else if (id.indexOf("#") < 0) {
                return $("#" + id);
            }
        };

        return {
            pos: function(radius, angle) {
                if (radius > 0 && Math.abs(angle) <= 90) {
                    position.current.angle = angle;
                    position.current.x = getX(radius, angle);
                    position.current.y = getY(radius, angle);
                    position.current.radius = radius;
                    position.current.stepsToCenter = Math.abs(angle / 30);
                } else {
                    return this.currentPosition();
                }
            },
            getPathToPos: function(radius, angle, step, direction) {
                pathToNext(radius, angle, step, direction);

                return position.paths;
            },
            currentPosition: function() {
                return position.current;
            },
            id: function() {
                return id;
            },
            getUiElement: function() {
                return getUI();
            },
            focused: function(isFocused) {
                if (isFocused === undefined || isFocused === null) {
                    return _isFocus;
                } else {
                    _isFocus = isFocused;
                }
            },
            roomName: function(name) {
                if (name === undefined || name === null) {
                    return _room;
                } else {
                    _room = name;
                }
            },
            addMoveClickHandler: function() {
                if (!moveEventAdded) {
                    var element = getUI();
                    element.on('click', this.moveToCenter);
                    moveEventAdded = true;
                }
            },
            moveToCenter: function() {
                if (position.current.stepsToCenter > 0) {
                    console.log("able to move");
                    pathToNext(position.current.radius, 0, position.current.stepsToCenter, position.current.direction);
                }

                console.log(position.current);
                console.log(position.paths);

                var element = getUI();
                element.animate({
                            crSpline: $.crSpline.buildSequence(position.paths)
                        }, 500);
            }
        };

    }

    return Light;
})
        ;
