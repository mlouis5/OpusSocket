/**
 * Created by Mac on 6/13/14.
 */
define([], function () {
    function LightUtil(lights, radius) {

        var _radius = radius;
        var numLightsShown = 7;
        var allLights = lights;
        var detailFormOpen = true;

        var hiddentLights = [];

        var initAllLights = function () {
            var angle = 90;

            var index = 0;
            for (var i = angle; i >= 0; i -= 30) {
                var light = allLights[index++];
                light.pos(_radius, i);

                var element = light.getUiElement();

                var styles = {
                    position: 'absolute',
                    left: light.currentPosition().x,
                    top: light.currentPosition().y
                };

                if (i === 0) {
                    light.focused(true);
                    $(".room-label").text(light.roomName());
                    addClickToFocused(element);
                } else {
                    light.focused(false);
                }
                element.css(styles);
                light.addMoveClickHandler();
            }

            angle = 30;
            for (var i = angle; i <= 90; i += 30) {
                var light = allLights[index++];
                light.pos(_radius, (i * -1));

                var element = light.getUiElement();

                if (i !== 0) {
                    light.focused(false);
                }

                var styles = {
                    position: 'absolute',
                    left: light.currentPosition().x,
                    top: light.currentPosition().y
                };

                element.css(styles);
                light.addMoveClickHandler();
                //element.addClass("lights-on");
            }

            var hiddenIndex = 0;
            while (index < allLights.length) {
                hiddentLights[hiddenIndex++];
                index++;
            }
        };

        var detailForm = function () {
            var element = $("#detail-form");
            if (detailFormOpen) {
                collapseDetailForm(element);
            } else {
                expandDetailForm(element);
            }
        };

        var collapseDetailForm = function (element) {
            var kids = element.children();

            kids.each(function () {
                $(this).hide();
            });

            element
                .animate({
                    crSpline: $.crSpline.buildSequence([
                        [850, 285],
                        [850, 435]
                    ]),
                    height: 25
                }, 500).animate({
                    width: 0
                }, 500).fadeOut(500);

            detailFormOpen = false;
        };

        var expandDetailForm = function (element) {

            element.fadeIn(500).animate({
                crSpline: $.crSpline.buildSequence([
                    [850, 435],
                    [850, 285]
                ]),
                height: 325
            }, 500).animate({
                    width: 500
                }, 500, fadeInChildren(element));

            detailFormOpen = true;
        };

        var addClickToFocused = function (element) {
            if (element !== undefined || element !== null) {
                element.on("click", function () {
                    detailForm();
                });
            }
        };

        var removeClickFromNonFocused = function (element) {
            if (element !== undefined || element !== null) {
                element.off("click");
            }
        };

        var fadeInChildren = function (element) {
            element.children().each(function () {
                $(this).show(2400);
            });
        };

        return{
            initLights: function () {
                initAllLights();
            },
            handleDetailForm: function () {
                console.log("handleDetailForm called");
                detailForm();
            }
        };
    }

    return LightUtil;
})
;
