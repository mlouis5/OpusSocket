/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define([], function() {
    function TileUtility(_tiles, _weather) {
        var socketUpdateInterval = 1800000; //30 minutes in milliseconds
        var numberOfStories = 0;
        var tileChangeIntervalTime;
        var switchInterval = undefined;
        var weatherInterval = undefined;
        var count = 0;
        var day_weather = _weather;

        var TileManager = function(_allTiles) {
            var allTiles = _allTiles;

            return{
                shift: function(handler, news) {
                    var stop = allTiles.length;
                    var start = 3;
                    while (start < stop) {
                        allTiles[start].transferToTile(allTiles[start - 1]);
                        start++;
                    }
                    handler.handle(news, allTiles[stop - 1]);
                }
            };
        };//end TileManager 
        var tiles = new TileManager(_tiles);

        //create sub type ArticleHandler to handle news
        var ArticleHandler = function() {
            return {
                handle: function(news, tile) {
                    var desc = news.description;
                    var title = news.title;
                    var link = news.link;
                    tile.updateAll(title, desc, link);
                }
            };
        };
        var articleHandler = new ArticleHandler();

        //create sub type SportHandler to handle sports
        var SportHandler = function() {
            return {
                handle: function(news, tile) {
                    var title = news.headline;
                    var desc = news.description;
                    var link = news.links.web.href;
                    tile.updateAll(title, desc, link);
                }
            };
        };
        var sportHandler = new SportHandler();

        var HeadlineNews = function(_handler) {
            var handler = _handler;
            var currStory = -1;
            var arr = undefined;

            return {
                setNews: function(news) {
                    arr = news;
                },
                getNext: function() {
                    if (arr !== undefined) {
                        if (++currStory < arr.length) {
                            return arr[currStory];
                        } else {
                            currStory = -1;
                            return this.getNext();
                        }
                    }
                    return false;
                },
                getHandler: function() {
                    return handler;
                }
            };
        };//end HeadlineNews

        var NewsManager = function(_articles, _nfl, _nba, _mlb) {
            var current = -1;
            var newsArray = [_articles, _nfl, _nba, _mlb];

            return{
                article: function(_arr) {
                    if (_arr === undefined) {
                        return newsArray[0];//articles;
                    } else {
                        newsArray[0].setNews(_arr);
                    }
                },
                nfl: function(_arr) {
                    if (_arr === undefined) {
                        return newsArray[1];
                    } else {
                        newsArray[1].setNews(_arr);
                    }
                },
                nba: function(_arr) {
                    if (_arr === undefined) {
                        return newsArray[2];
                    } else {
                        newsArray[2].setNews(_arr);
                    }
                },
                mlb: function(_arr) {
                    if (_arr === undefined) {
                        return newsArray[3];
                    } else {
                        newsArray[3].setNews(_arr);
                    }
                },
                getNext: function() {
                    if (newsArray !== undefined) {
                        if (++current < newsArray.length) {
                            return newsArray[current];
                        } else {
                            current = -1;
                            return this.getNext();
                        }
                    }
                    return false;
                },
                size: function() {
                    return newsArray.length;
                }
            };
        };
        var newsManager = new NewsManager(new HeadlineNews(articleHandler),
                new HeadlineNews(sportHandler), new HeadlineNews(sportHandler),
                new HeadlineNews(sportHandler));

        var WeatherManager = function(containerId, _weather, _forecast) {
            var contId = containerId;
            var weather = _weather;
            var isInit = false;
            var forecast = _forecast;

            var rotateWeather = function() {
                if (weather === undefined || weather.length === 0) {
                    return;
                }
                var out = weather.pop();
                weather.unshift(out);
            };

            var toNextIndex = function(weatherTile) {
                var wCurIdx = weatherTile.currentIndex();
                if (wCurIdx <= weatherTile.getMaxIndex()) {
                    weatherTile.shift();
                } else {
                    weatherTile.resetIndex();
                }
                if (!weatherTile.isRendered()) {
                    weatherTile.renderWeather(contId, forecast[weatherTile.index()], 0);
                } else {
                    if(weatherTile.currentIndex() > weatherTile.getMaxIndex()){
                        weatherTile.resetIndex();
                        weatherTile.shift();
                    }
                    weatherTile.moveOver();
                }
            };

            return {
                shift: function() {
                    if (weather === undefined || forecast === undefined
                            || weather.length !== forecast.length) {
                        return;
                    }
                    if (!isInit) {
                        this.init();
                    } else {
                        var maxIndex = weather.length - 1;
                        var stopIndex = 1;

                        for (var i = maxIndex; i >= stopIndex; i--) {
                            var wTile = weather[i];
                            toNextIndex(wTile);
                        }
                        rotateWeather();
                    }
                },
                init: function() {
                    if (weather === undefined || weather.length === 0) {
                        return;
                    }

                    for (var i = 0; i < weather.length; i++) {
                        var wTile = weather[i];
                        wTile.index(i);
                        wTile.setMaxIndex(weather.length - 2);
                    }

                    var maxIndex = weather.length - 1;
                    var stopIndex = maxIndex >= 7 ? maxIndex - 7 : 0;

                    var curIndex = 7;
                    for (var i = maxIndex; i >= stopIndex; i--) {
                        var wTile = weather[i];
                        wTile.renderWeather(contId, forecast[wTile.index()], curIndex--);
                    }
                    isInit = true;
                }
            };
        };

        var sportCallback = function(_function, json) {
            _function(json.headlines);
        };
        var dailyNewsCallback = function(_function, json) {
            _function(json.stories);
        };
        var nflCallback = function(headlines) {
            numberOfStories += headlines.length;
            newsManager.nfl(headlines);
        };
        var nbaCallback = function(headlines) {
            numberOfStories += headlines.length;
            newsManager.nba(headlines);
        };
        var mlbCallback = function(headlines) {
            numberOfStories += headlines.length;
            newsManager.mlb(headlines);
        };
        var articleCallback = function(_stories) {
            numberOfStories += _stories.length;
            newsManager.article(_stories);
        };

        var switchTiles = function() {
            var headlineObj = newsManager.getNext();
            var handler = headlineObj.getHandler();
            tiles.shift(handler, headlineObj.getNext());
        };

        /*
         * Sets the initial tiles, and calculates and starts the timer
         */
        var setTiles = function() {
            tiles.shift(articleHandler, newsManager.article().getNext());
            tiles.shift(sportHandler, newsManager.nfl().getNext());
            tiles.shift(sportHandler, newsManager.nba().getNext());
            tiles.shift(sportHandler, newsManager.mlb().getNext());
            tiles.shift(articleHandler, newsManager.article().getNext());

            //calculate the story update interval, interval has to be between 8 and 15 seconds,
            //otherwise, interval is set to a default of 15 seconds
            var time = (socketUpdateInterval / numberOfStories);
            tileChangeIntervalTime = (time < tileChangeIntervalTime && time >= 8000 ? time : tileChangeIntervalTime);
            if (switchInterval) {
                clearInterval(switchInterval);
                switchInterval = setInterval(switchTiles, tileChangeIntervalTime);
            } else {
                switchInterval = setInterval(switchTiles, tileChangeIntervalTime);
            }
        };

        var setWeather = function(weatherForecast) {
            var weatherManager = new WeatherManager("#main-tile-text", day_weather, weatherForecast);

            weatherManager.init();

            if (weatherInterval) {
                clearInterval(weatherInterval);
                weatherInterval = setInterval(weatherManager.shift, 12000);
            } else {
                weatherInterval = setInterval(weatherManager.shift, 12000);
            }
        };

        return {
            handleMessage: function(msg) {
                var fromSocket = msg.fromSocket;
                var msgType = msg.msgType;
                var json = JSON.parse(msg.jsonMessage);

                if (msgType === "ARTICLES") {
                    dailyNewsCallback(articleCallback, json);
                }
                else if (msgType === "NFL") {
                    sportCallback(nflCallback, json);
                } else if (msgType === "NBA") {
                    sportCallback(nbaCallback, json);
                } else if (msgType === "MLB") {
                    sportCallback(mlbCallback, json);
                }
                count++;

                if (count === newsManager.size()) {
                    tileChangeIntervalTime = 15000;
                    count = 0;
                    setTiles();
                }
            },
            handleWeather: function(weather) {
                var weatherJson = weather.jsonMessage;
                var weatherForecast = JSON.parse(weatherJson);

                setWeather(weatherForecast.forecast.simpleforecast.forecastday);
            },
            killInterval: function() {
                clearInterval(switchInterval);
            }
        };
    }
    return TileUtility;
});