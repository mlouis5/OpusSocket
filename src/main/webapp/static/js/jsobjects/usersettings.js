/**
 * Created by Mac on 5/5/14.
 */
define([], function () {
    function UserSettings(wakeTime, toWorkTime, fromWorkTime, toSleepTime) {

        var minTemp = 66;
        var maxTemp = 73;

        var wakeup = wakeTime;
        var toWork = toWorkTime;
        var fromWork = fromWorkTime;
        var toSleep = toSleepTime;

        var currentlyOpenedClock = wakeup;
        currentlyOpenedClock.id("wakeup");

        return{
            avg: function () {
                return (minTemp + maxTemp) >> 1; //(>> 1) equivalent to (/ 2)
            },
            max: function (value) {
                if (value === undefined || value === null || value !== parseInt(value)) {
                    return maxTemp;
                } else {
                    maxTemp = parseInt(Math.ceil(value));
                }
            },
            min: function (value) {
                if (value === undefined || value === null || value !== parseInt(value)) {
                    return minTemp;
                } else {
                    minTemp = parseInt(Math.ceil(value));
                }
            },
            wakeup: function (h, m, p) {
                if ((h === undefined && m === undefined && p === undefined) || (h === null && m === null && p === null)) {
                    return wakeup;
                } else {
                    wakeup.time(h, m, p);
                }
            },
            toWork: function (h, m, p) {
                if ((h === undefined && m === undefined && p === undefined) || (h === null && m === null && p === null)) {
                    return toWork;
                } else {
                    toWork.time(h, m, p);
                }
            },
            fromWork: function (h, m, p) {
                if ((h === undefined && m === undefined && p === undefined) || (h === null && m === null && p === null)) {
                    return fromWork;
                } else {
                    fromWork.time(h, m, p);
                }
            },
            toSleep: function (h, m, p) {
                if ((h === undefined && m === undefined && p === undefined) || (h === null && m === null && p === null)) {
                    return toSleep;
                } else {
                    toSleep.time(h, m, p);
                }
            },
            currentlyOpened: function(id){
                if(id === undefined || id === null){
                    return currentlyOpenedClock;
                }else{
                    if(id === 'wakeup' || id === 'to_work' || id === 'from_work' || id === 'to_sleep'){
                        if(id === 'wakeup'){
                            currentlyOpenedClock = wakeup;
                        }else if(id === 'to_work'){
                            currentlyOpenedClock = toWork;
                        }else if(id === 'from_work'){
                            currentlyOpenedClock = fromWork;
                        }else if(id === 'to_sleep'){
                            currentlyOpenedClock = toSleep;
                        }

                        currentlyOpenedClock.id(id);
                    }
                }
            },
            setHour: function(hour){
                if(currentlyOpenedClock !== undefined){
                    currentlyOpenedClock.hour(hour);
                }
            },
            setMinute: function(minute){
                if(currentlyOpenedClock !== undefined){
                    currentlyOpenedClock.minute(minute);
                }
            },
            setPeriod: function(period){
                if(currentlyOpenedClock !== undefined){
                    currentlyOpenedClock.period(period);
                }
            },
            toSerial: function () {
                return {
                        minTemp: minTemp,
                        maxTemp: maxTemp,
                        wakeup: wakeup.toSerial(),
                        toWork: toWork.toSerial(),
                        fromWork: fromWork.toSerial(),
                        toSleep: toSleep.toSerial()
                }
            }
        }

    }

    return UserSettings;
});