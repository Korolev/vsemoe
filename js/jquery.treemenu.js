/**
 * Created by mk-sfdev on 12/18/13.
 */
(function ($, window, document) {

    $.fn.treemenu = function (data) {
        var self = this, //input
            b = 1, //border
            maxLiCount = 12,
            ulHeight = 0,
            timeId,
            position = "bottom",
            div = $("<div class='treemenu'></div>").insertAfter(self),
            liHeight = div.outerHeight() - b,
            text = $("<span></span>").appendTo(div),
            ul = $("<ul></ul>").appendTo(div),
            setPosition = function (pos) {
                if (pos != position) {
                    ul.removeClass(position).addClass(pos);
                    position = pos;
                    ul.css({
                            top: position == "top" ? 0 - ulHeight : liHeight - b
                        }
                    );
                }
            },
            createUlTree = function (_ul, data) {
                $.each(data, function (k, item) {
                    var li,
                        timeId,
                        __ul,
                        mouseFunc = function (action) {
//                                        __ul.css({
//                                            top: position == "top" ? (item.fields.length - 1) * - liHeight : 0,
//                                            left: li.outerWidth() + b
//                                        });
//                                        __ul[action]();
                            if (timeId)clearTimeout(timeId);
                            timeId = setTimeout(function () {
                                __ul.css({
                                    top: position == "top" ? (item.fields.length - 1) * -liHeight : 0,
                                    left: li.outerWidth() + b
                                });
                                __ul[action]();
                            }, action == "show" ? 0 : 100);
                        };

                    li = $("<li></li>")
                        .appendTo(_ul)
                        .html($("<a></a>").text(item.label));

                    if (item.selected) {
                        text.text(item.label);
                    }

                    if (item.fields && item.fields.length) {
                        li.addClass("ext_has_child");
                        __ul = $("<ul></ul>").appendTo(li);
                        createUlTree(__ul, item.fields);
                        li.on({
                            "mouseover": function () {
                                mouseFunc('show');
                            },
                            "mouseleave": function () {
                                mouseFunc('hide');
                            }
                        });
                    }
                    li.on("click", function (e) {
                        e.stopPropagation();
                        if (item.name) {
                            self.val(item.name);
                            text.text(item.label);
                            ul.hide();
                        }
                    })
                });
            };

        ul.addClass(position);
        try {
            if (data.length) {
                ulHeight = data.length > 12 ?
                    12 * liHeight + 20
                    : data.length * liHeight;

                console.log(ulHeight);

                createUlTree(ul, data);
                div.on("click", function () {
                    ul.toggle();
                });
                var win = $(window),
                    winHeight = win.height(),
                    elOffset = div.offset().top + div.height() + ulHeight + 20;

                win.on('resize', function () {
                    winHeight = win.height();
                    setPosition(win.scrollTop() + winHeight - elOffset < 0 ? "top" : "bottom");
                });
                win.on("scroll", function () {
                    if (timeId)clearTimeout(timeId);
                    timeId = setTimeout(function () {
                        setPosition(win.scrollTop() + winHeight - elOffset < 0 ? "top" : "bottom");
                    }, 50);

                });
                //Start init
                setPosition(win.scrollTop() + winHeight - elOffset < 0 ? "top" : "bottom");
                $(document).on("click", function (e) {
                    var target = e.target,
                        buble = false;
                    while (target) {
                        buble = buble ? true : $(target).hasClass("treemenu");
                        target = target.parentNode;
                    }
                    if (!buble)ul.hide();
                });
            }

        } catch (e) {
            console && console.log(e);
        }

    };

}(jQuery, window, document));