/**
 * Created by Mac on 4/4/14.
 */
define([], function () {
    window.Debug = (function (window, document, undefined) {
        var debugSet = false;

        var initiate = function (shouldDebug) {
            debugSet = shouldDebug.toLowerCase() === 'develop' ? true : false;
        }

        var isDebug = function () {
            return debugSet;
        }

        return{
            init: function (mode) {
                if (mode == null || mode === undefined) {
                    mode = "";
                }
                initiate(mode.toString());
            },
            toConsole: function (value) {
                if (isDebug()) {
                    console.log(value)
                }
            }
        }
    })(window, document, undefined);
});//
