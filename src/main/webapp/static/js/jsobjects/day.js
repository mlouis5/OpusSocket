/**
 * Created by Mac on 5/5/14.
 */
define([], function () {
    function Day(dayId, dayNumber, dayText, _userSettings) {
        var id = '#' + dayId;
        var subId = '#inner-' + dayId;
        var text = dayText;
        var dayNum = dayNumber;
        var path = undefined;
        var isCenter = false;
        var isExpanded = false;
        var userSettings = _userSettings;


        return {
            id: function () {
                return id;
            },
            subId: function () {
                return subId;
            },
            text: function () {
                return text;
            },
            dayNum: function () {
                return dayNum;
            },
            path: function (_path) {
                console.log('path being passed: ' + _path);
                if (_path === undefined || _path === null || typeof _path !== 'object') {
                    return path;
                } else {
                    path = _path;
                }
            },
            center: function (_isCenter) {
                if (_isCenter === undefined || _isCenter === null || typeof _isCenter !== 'boolean') {
                    return isCenter;
                } else {
                    isCenter = _isCenter;
                }
            },
            expanded: function (_isExpanded) {
                if (_isExpanded === undefined || _isExpanded === null || typeof _isExpanded !== 'boolean') {
                    return isExpanded;
                } else {
                    isExpanded = _isExpanded;
                }
            },
            settings: function (settings) {
                if (settings === undefined || settings === null || typeof settings !== 'object') {
                    return userSettings;
                } else {
                    userSettings = settings;
                }
            },
            getUI: function(){
                return $(id);
            },
            getInnerUI: function(){
                return $(id).find(subId);
            }
        }
    }

    return Day;
});