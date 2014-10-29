/**
 * Created by Mac on 6/15/14.
 */
define([], function () {

    function LightTracker(lights) {
        var _lights = lights;
        var numLights = lights.length;
        var startPoint;
        var endPoint;
        var mid = -1;

        var findMiddle = function(lights){
            if(numLights === 7){
                mid = 4;
            }else if(numLights > 7){
                if(isOdd(numLights)){
                    var midPoint = Math.ceil((numLights / 2)) - 1;
                    startPoint = midPoint - 3;
                    endPoint = midPoint + 3;
                }else{
                    var lowMidPoint = Math.floor(numLights / 2) - 1;
                    var highMidPoint = Math.ceil(numLights / 2) - 1;

                    startPoint = lowMidPoint - 2;
                    endPoint = highMidPoint + 2;
                }
            }else{

            }

        }

        var isOdd = function(num){
            return num % 2;
        }
    }
    return LightTracker;

})
;