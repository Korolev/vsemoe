touchslider = {
    output: function (/*string*/ msg) {
        if (console) {
            console.info(msg);
        }
    },
    createSlidePanel: function (/*string*/ gridid, /*int*/ cellWidth, /*int*/ padding) {
        var x = padding;
        $(gridid).each(function () {
            $(this).css({
                'position': 'relative',
                'left': '0px'
            });
            $(this).parent().css('overflow', 'hidden');
            $(this).children('.cell').each(function () {
                $(this).css({
                    width: cellWidth + 'px',
                    height: '64px',
                    position: 'absolute',
                    left: x + 'px',
                    top: padding + 'px'
                });

                x += cellWidth + padding;
            });
            touchslider.width = x;
            touchslider.colWidth = cellWidth + padding;

            try {
                document.createEvent('TouchEvent');
                /*
                   Now that we've finished the layout we'll make our panel respond
                   to all of the touch events.
                 */
                touchslider.makeTouchable(gridid);
            } catch (e) {
                /*
                 * Then we aren't on a device that supports touch
                 */
                $(this).css({
                    'height': '84px',/***slidebar***/
                    'overflow': 'auto'
                });
            }
        });
    },
    makeTouchable: function (/*string*/ gridid) {
        $(gridid).each(function () {
            this.ontouchstart = function (e) {
                touchslider.touchStart($(this), e);
                //e.preventDefault();
                //e.stopPropagation();
                return true;
            };

            this.ontouchend = function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (touchslider.sliding) {
                    touchslider.sliding = false;
                    touchslider.touchEnd($(this), e);
                    return false;
                } else {
                    /*
                       We never slid so we can just return true
                       and perform the default touch end
                     */
                    return true;
                }
            };

            this.ontouchmove = function (e) {
                touchslider.touchMove($(this), e);
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
        });
    },
    getLeft: function (/*JQuery*/ elem) {
        return parseInt(elem.css('left').substring(0, elem.css('left').length - 2), 10);
    },
    touchStart: function (/*JQuery*/ elem, /*event*/ e) {
        elem.css({
            '-webkit-transition-duration': '0'
        });

        touchslider.startX = e.targetTouches[0].clientX;
        touchslider.startLeft = touchslider.getLeft(elem);
        touchslider.touchStartTime = new Date().getTime();

    },
    touchEnd: function (/*JQuery*/ elem, /*event*/ e) {
        if (touchslider.getLeft(elem) > 0) {
            touchslider.doSlide(elem, 0, '2s');
            elem.parent().removeClass('sliding');
            touchslider.startX = null;
        } else if ((Math.abs(touchslider.getLeft(elem)) + elem.parent().width()) > touchslider.width) {
            touchslider.doSlide(elem, '-' + (touchslider.width - elem.parent().width()), '2s');
            elem.parent().removeClass('sliding');
            touchslider.startX = null;
        } else {
            touchslider.slideMomentum(elem, e);
        }
    },
    slideMomentum: function (/*jQuery*/ elem, /*event*/ e) {
        var slideAdjust = (new Date().getTime() - touchslider.touchStartTime) * 10;
        var left = touchslider.getLeft(elem);
        var changeX = 12000 * (Math.abs(touchslider.startLeft) - Math.abs(left));
        slideAdjust = Math.round(changeX / slideAdjust);
        var newLeft = slideAdjust + left;
        var t = newLeft % touchslider.colWidth;
        if ((Math.abs(t)) > ((touchslider.colWidth / 2))) {
            newLeft -= (touchslider.colWidth - Math.abs(t));
        } else {
            newLeft -= t;
        }
        if (touchslider.slidingLeft) {
            var maxLeft = parseInt('-' + (touchslider.width - elem.parent().width()), 10);
            touchslider.doSlide(elem, Math.max(maxLeft, newLeft), '0.5s');
        } else {
            touchslider.doSlide(elem, Math.min(0, newLeft), '0.5s');
        }
        elem.parent().removeClass('sliding');
        touchslider.startX = null;
    },

    doSlide: function (/*jQuery*/ elem, /*int*/ x, /*string*/ duration) {
        elem.css({
            left: x + 'px',
            '-webkit-transition-property': 'left',
            '-webkit-transition-duration': duration
        });
    },
    touchMove: function (/*JQuery*/ elem, /*event*/ e) {
        if (!touchslider.sliding) {
            elem.parent().addClass('sliding');
        }

        touchslider.sliding = true;

        if (touchslider.startX > e.targetTouches[0].clientX) {
            elem.css('left', '-' + (touchslider.startX - e.targetTouches[0].clientX - touchslider.startLeft) + 'px');
            touchslider.slidingLeft = true;
        } else {
            var left = (e.targetTouches[0].clientX - touchslider.startX + touchslider.startLeft);
            elem.css('left', left + 'px');
            touchslider.slidingLeft = false;
        }

    }
};
$(document).ready(function () {
    touchslider.createSlidePanel('#slidebar', 86, 0);
});