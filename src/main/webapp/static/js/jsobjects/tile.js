/**
 * Created by Mac on 4/5/14.
 */
define([], function() {

    function Tile(tileId) {

        var isOpen = true;
        var tileId = tileId;
        var headingId = tileId + "-heading";
        var textId = tileId + "-text";
        var heading;
        var text;
        var link;
        var linkId;
        var bgClr;
        var fgClr;

        var clearTile = function() {
            $(headingId).text("");
            $(textId).text("");
            isOpen = true;
        };

        return {
            updateAll: function(_heading, _text, _link) {
                if (_heading !== undefined && _heading !== null && _heading.length > 0
                        && _text !== undefined && _text !== null && _text.length > 0
                        && _link !== undefined && _link !== null && _link.length > 0) {
                    heading = _heading;
                    text = _text;
                    link = _link;
                    
                    $(headingId).text(heading);
                    $(textId).text(text);
                    isOpen = false;
                    $(headingId).wrap('<a href="' + link + '"></a>');                    
                }
            },
            updateHeading: function(_heading) {
                if (_heading !== undefined && _heading !== null && _heading.length > 0) {
                    heading = _heading;
                    $(headingId).text(_heading);
                }
            },
            updateText: function(_text) {
                if (_text !== undefined && _text !== null && _text.length > 0) {
                    text = _text;
                    $(textId).text(_text);
                }
            },
            updateLink: function(_link) {
                if (_link !== undefined && _link !== null && _link.length > 0) {
                    link = _link;
                    $(linkId).text(_link);
                }
            },
            updateBgColor: function(color) {
            },
            updateFgColor: function(color) {
            },
            blink: function() {
            },
            transferToTile: function(tile) {
                if (tile !== undefined) {
                    tile.updateAll(heading, text, link);
                    tile.open(false);
                    clearTile();
                }
            },
            captureTile: function(tile) {
                if (tile !== undefined) {
                    tile.updateAll(heading, text, link);
                    tile.open(false);
                    clearTile();
                }
            },
            open: function(_isOpen) {
                if (_isOpen !== undefined && typeof (_isOpen) === 'Boolean') {
                    isOpen = _isOpen;
                } else {
                    return isOpen;
                }
            },
            heading: function() {
                return heading;
            },
            text: function() {
                return text;
            },
            link: function() {
                return link;
            },
            clear: function(){
                clearTile();
            }
        };
    }//end Tile function
    return Tile;
});