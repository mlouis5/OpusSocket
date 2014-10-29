/**
 * Created by Mac on 5/5/14.
 */
define([], function () {
    function Time(tHour, tMinute, tPeriod) {

        var id;
        var gH;
        var gM;
        var gP;

        var validHour = function (h) {
            return h >= 1 && h <= 12;
        };

        var validMinute = function (m) {
            return m >= 0 && m <= 59;
        };

        var validPeriod = function (p) {
            if (typeof p === "string") {
                return p === 'am' || p === 'pm';
            }
            return false;
        }

        var hour = function (h) {
            if (h === undefined || h === null || h !== parseInt(h)) {
                return gH;
            } else {
                if (validHour(h)) {
                    gH = h;
                }
            }
        }

        var minute = function (m) {
            if (m === undefined || m === null || m !== parseInt(m)) {
                return gM;
            } else {
                if (validMinute(m)) {
                    gM = m;
                }
            }
        }

        var period = function (p) {
            if (p === undefined || p === null) {
                return gP;
            } else {
                if (validPeriod(p)) {
                    gP = p;
                }
            }
        }

        hour(tHour);
        minute(tMinute);
        period(tPeriod);

        return {
            time: function (h, m, p) {
                hour(h);
                minute(m);
                period(p);
            },
            hour: function (h) {
                hour(h);
            },
            minute: function (m) {
                minute(m);
            },
            period: function (p) {
                period(p);
            },
            post: function(){
                return "" + gH + ":" + (gM < 10 ? "0" + gM : gM) + " " + gP;
            },
            id: function(theId){
                if(theId === undefined || theId === null){
                    return id;
                }else{
                    id = theId
                }
            },
            toSerial: function () {
                return {
                    time: {
                        hour: gH,
                        minute: gM,
                        period: gP
                    }
                }
            }
        }
    }

    return Time;
})
;