/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define([], function() {
    function Weather(weatherId) {
        var prevIndex = -1;
        var curIndex = -1;
        var maxIndex = -1;
        var shiftAnimationTime = 750; //milliseconds
        var index = -1;
        var _isRendered = false;
        var dayId = weatherId + "-day";
        var dateId = weatherId + "-date";
        var hiTempId = weatherId + "-hi";
        var lowTempId = weatherId + "-low";
        var imgId = weatherId + "-img";
        var weatherContainer = {
            weatherIdCss: {
                display: 'inline-block',
                position: 'absolute',
                width: 100,
                height: 90,
                'font-family': 'Oswald, sans-serif, Helvetica',
                cursor: 'pointer',
                background: 'url("static/images/sqBgButton.jpg")'
            },
            weatherDayCss: {
                position: 'absolute',
                display: 'inline-block',
                width: 54,
                height: 20,
                top: 4,
                left: 8,
                'background-color': 'transparent',
                color: '#777777'
            },
            weatherDateCss:{
                position: 'absolute',
                display: 'inline-block',
                width: 36,
                height: 20,
                top: 4,
                left: 64,
                'background-color': 'transparent',
                color: '#777777'
            },
            hiTempCss: {
                position: 'absolute',
                display: 'inline-block',
                width: 25,
                height: 20,
                color: '#777777',
                top: 32,
                left: 66,
                'text-align': 'center'
            },
            lowTempCss: {
                position: 'absolute',
                display: 'inline-block',
                width: 25,
                height: 20,
                color: '#777777',
                top: 54,
                left: 66,
                'text-align': 'center'
            },
            imgCss: {
                position: 'absolute',
                display: 'inline-block',
                width: 52,
                height: 52,
                top: 30,
                left: 6,
                "background-color": 'transparent',
                'background-image': ''
            },
            containerMarkup: "<section class=\"weather\" id=\"" + weatherId.slice(1) + "\">\
                <section class=\"weatherDay\" id=\"" + dayId.slice(1) + "\"></section>\
                <section class=\"weatherDay\" id=\"" + dateId.slice(1) + "\"></section>\
                <section class=\"hi\" id=\"" + hiTempId.slice(1) + "\"></section>\
                <section class=\"low\" id=\"" + lowTempId.slice(1) + "\"></section>\
                <section class=\"weatherImg\" id=\"" + imgId.slice(1) + "\"> </section>\
                </section>"
        };
        var calcPosition = function(fromIndex, toIndex, hSpace, vSpace, numRows, itemsPerRow, itemWidth, itemHeight) {
            var pos = [];
            var usedHSpace = itemWidth * itemsPerRow;
            var usedVSpace = itemHeight * numRows;
            var marginLeft = (hSpace - usedHSpace) / (itemsPerRow + 1);
            var marginTop = (vSpace - usedVSpace) / (numRows + 1);
            pos[0] = calcPos(fromIndex, marginLeft, marginTop, itemsPerRow, itemWidth, itemHeight);
            pos[1] = calcPos(toIndex, marginLeft, marginTop, itemsPerRow, itemWidth, itemHeight);
            return pos;
        };
        var calcPos = function(index, marginLeft, marginTop, itemsPerRow, itemWidth, itemHeight) {
            var pos = [];
            var trueIndex = index % itemsPerRow;
            var row = Math.floor(index / itemsPerRow);
            if (index < 0) {
                pos[0] = -1 * (itemWidth + marginLeft);
                pos[1] = marginTop;
            } else {
                pos[0] = marginLeft * (trueIndex + 1) + (itemWidth * trueIndex);
                pos[1] = marginTop * (row + 1) + (itemHeight * row);
            }
            return pos;
        };
        return {
            index: function(_index) {
                if (_index === undefined) {
                    return index;
                } else {
                    index = _index;
                }
            },
            renderWeather: function(containerId, forecastDay, atIndex) {
                var month = forecastDay.date.month;
                var day = forecastDay.date.day;

                var position = calcPosition(atIndex - 1, atIndex, 581, 270, 2, 4, 
                weatherContainer.weatherIdCss.width, weatherContainer.weatherIdCss.height);

                $(containerId).append(weatherContainer.containerMarkup);
                $(weatherId).css(weatherContainer.weatherIdCss);
                $(dayId).css(weatherContainer.weatherDayCss).text(forecastDay.date.weekday_short);
                $(dateId).css(weatherContainer.weatherDateCss).text(month + "/" + day);
                $(hiTempId).css(weatherContainer.hiTempCss).text(forecastDay.high.fahrenheit);
                $(lowTempId).css(weatherContainer.lowTempCss).text(forecastDay.low.fahrenheit);
                weatherContainer.imgCss['background-image'] = 'url(' + forecastDay.icon_url + ')';
                $(imgId).css(weatherContainer.imgCss);

                $(weatherId).animate({
                    crSpline: $.crSpline.buildSequence(position)
                }, shiftAnimationTime);

                curIndex = atIndex;
                prevIndex = curIndex - 1;

                _isRendered = true;
            },
            moveOver: function() {
                var position = [];
                if (curIndex >= maxIndex) {
                    position = calcPosition(7, 7, 581, 270, 2, 4, 
                    weatherContainer.weatherIdCss.width, weatherContainer.weatherIdCss.height);
                    position[1][0] = 590;
                }else {
                    position = calcPosition(prevIndex, curIndex, 581, 270, 2, 4, 
                    weatherContainer.weatherIdCss.width, weatherContainer.weatherIdCss.height);
                }

                $(weatherId).animate({
                    crSpline: $.crSpline.buildSequence(position)
                }, shiftAnimationTime);
            },
            isRendered: function() {
                return _isRendered;
            },
            shift: function() {
                prevIndex = curIndex;
                curIndex++;
            },
            resetIndex: function() {
                prevIndex = -1;
                curIndex = -1;
            },
            currentIndex: function() {
                return curIndex;
            },
            setMaxIndex: function(mxIndex) {
                maxIndex = mxIndex;
            },
            getMaxIndex: function(){
                return maxIndex;
            }
        };
    }//end Weather function
    return Weather;
});