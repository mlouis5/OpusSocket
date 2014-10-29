/**
 * Created by Mac on 4/6/14.
 */
define([], function () {
    function Title() {
        var _this = {};

        _this.title = $("#title");

        return {
            set: function (theTitle) {
                _this.title.text(theTitle);
            },


            backgroundColor: function (hexColor) {
                _this.title.css('background-color', hexColor);
            },


            backgroundColor: function (r, g, b) {
                _this.title.css('background-color', "rgb(" + r + ", " + g + ", " + b + ")");
            }
        };
    }
    return Title;
});
