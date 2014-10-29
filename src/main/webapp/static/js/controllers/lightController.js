/**
 * Created by Mac on 6/12/14.
 */

define([], function () {

    function LightController(lightUtil, title) {

        var _title = title;
        var isInit = false;
        var _lightUtil = lightUtil;

        var init = function () {
            if (isInit) {
                return;
            } else {
                console.log("initializing");
                _lightUtil.initLights();


//                $("#highlight").on("click", function(){
//                    console.log("handling hightlight click");
//                    _lightUtil.handleDetailForm();
//                });

                isInit = true;
            }
        }

        var deInitialize = function () {
            if (!isInit) {
                return;
            }
            isInit = false;

            $("#light-container").remove();
        };

        return {
            unload: function () {
                deInitialize();
            },

            load: function () {
                console.log("loading now");
                $("#display-area").load("/OpusSocket/static/views/lights.html", "#tempView", init);
                _title.set("Lights");
            }
        };
    }

    return LightController;

})
;