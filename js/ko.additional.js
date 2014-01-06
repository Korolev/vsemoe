/**
 * Created by Lenovo on 09.11.13.
 */
moment.lang('ru', {
    months: [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
        'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    monthsShort: [
        'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл',
        'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ]
});

var datePickerLocale = {
    days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    daysMin: ['Во', 'По', 'Вт', 'Ср', 'Че', 'Пя', 'Су', 'Во'],
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
};


$(document).on('click', function (e) {
    var target = e.target;
    try {
        while (target != document) {
            var attrClass = target.getAttribute('class');
            if (attrClass && (attrClass.split(' '))[0] == 'dateInput') {
                break;
            }
            target = target.parentNode;
        }
        $('.dateInput').not(target).each(function (k, el) {
            $(el).find('.itemDropDown').removeClass('fadeInDon').addClass('hidden');
        });
    } catch (e) {
        console && console.log(e);
    }

});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }
    document.cookie = updatedCookie;
}


ko.observableArray.fn.pushAll = function (valuesToPush) {
    var underlyingArray = this();
    this.valueWillMutate();
    ko.utils.arrayPushAll(underlyingArray, valuesToPush);
    this.valueHasMutated();
    return this;
};

ko.bindingHandlers['digitext'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) + "";
        value = value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        ko.utils.setTextContent(element, value);
    }
};

ko.bindingHandlers['absdigitext'] = {
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = parseFloat(ko.utils.unwrapObservable(valueAccessor()));

        if (!isNaN(value) && bindingContext.$root.getCssClass(viewModel) == "transport_tr") {
            value = Math.abs(value);
        }

        value = isNaN(value) ? '' : value + '';

        value = value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        ko.utils.setTextContent(element, value);
    }
};

ko.bindingHandlers['accountname'] = {
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            acc = bindingContext.$root.accountsHash[value];
        value = acc ? acc.description : "";
        ko.utils.setTextContent(element, value);
    }
};
ko.bindingHandlers['shorttext'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) + "";
        value = value.length > 18 ? value.substr(0, 18) + ".." : value;
        ko.utils.setTextContent(element, value);
    }
};

ko.bindingHandlers['currency'] = {
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        value = value ? value : 0;
        try {
            value = bindingContext.$root.currency[value].shortname;
        } catch (e) {
            console.log(e, value);
        }

        ko.utils.setTextContent(element, value);
    }
};

ko.bindingHandlers['gotoaction'] = {
    'init': function (element, valueAccessor, allBindings, root) {
        $(element).click(function (e) {
            var val = ko.utils.unwrapObservable(valueAccessor());
            //root.action(val);
            location.hash = val;
        })
    }
};
//DATE

ko.bindingHandlers['textdate'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            date = new Date(),
            trdate = new Date(value * 1000),
            trnow = new Date(+trdate.getFullYear(), parseInt(trdate.getMonth(), 10), parseInt(trdate.getDate(), 10)),
            now = new Date(+date.getFullYear(), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10)),
            now_1 = new Date(+date.getFullYear(), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 1),
            now_2 = new Date(+date.getFullYear(), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 2),
            dayOfWeek = trdate.getDay();

        if (trnow.getTime() == now.getTime()) {
            value = [
                (trdate.getHours() + "").length == 1 ? "0" + trdate.getHours() : trdate.getHours(),
                ":",
                (trdate.getMinutes() + "").length == 1 ? "0" + trdate.getMinutes() : trdate.getMinutes()].join("");
        } else if (trnow.getTime() == now_1.getTime()) {
            value = "Вчера"
        } else if (trnow.getTime() == now_2.getTime()) {
            value = dayOfWeeks[dayOfWeek];
        } else {
            value = value ?
                [trdate.getDate(), calendarMonthNamesLoc[trdate.getMonth()].substr(0, 3), trdate.getFullYear()].join(" ")
                : "";
        }

        ko.utils.setTextContent(element, value);
    }
};

ko.bindingHandlers['date'] = {
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        //TODO appen datePicker here
        var value = ko.utils.unwrapObservable(valueAccessor());
        value = moment.isMoment(value) ?
            value.format()
            : ko.utils.unwrapObservable(value.value).format(value.format);

        ko.utils.setTextContent(element, value);
    }
};
ko.bindingHandlers['datepick'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element = $(element),
            value = ko.utils.unwrapObservable(valueAccessor()),
            date,
            textHolder,
            datePicker;


        date = moment.isMoment(value) ?
            value.format()
            : ko.utils.unwrapObservable(value.value).format(value.format);

        textHolder = $('<div/>', {class: 'dateval'}).appendTo(element).text(date);
        datePicker = $('<div/>', {class: 'hidden animated itemDropDown'}).appendTo(element);

        textHolder.on('click', function (e) {
            var hidden = datePicker.hasClass('hidden');
            datePicker.removeClass(hidden ? 'hidden' : 'fadeInDown')
                .addClass(hidden ? 'fadeInDown' : 'hidden');
        });

        datePicker.pickmeup({
            flat: true,
            locale: datePickerLocale,
            date: moment.isMoment(value) ? value : ko.utils.unwrapObservable(value.value),
            change: function (s, d) {
                value.value(new moment(d));
                console.log(value.value().format());
                bindingContext.$root.selectedFilter(new FilterViewModel({type: 'interval'}, bindingContext.$root));
                datePicker.addClass('hidden').removeClass('fadeInDown');
            }
        });

        $element.data('textHolder', textHolder);
        $element.data('datePicker', datePicker);
    },
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element = $(element),
            value = ko.utils.unwrapObservable(valueAccessor()),
            date,
            textHolder = $element.data('textHolder'),
            datePicker = $element.data('datePicker');


        date = moment.isMoment(value) ?
            value.format()
            : ko.utils.unwrapObservable(value.value).format(value.format);

        datePicker && datePicker.pickmeup('set_date', moment.isMoment(value) ? value : ko.utils.unwrapObservable(value.value));
        textHolder && textHolder.text(date);
    }
};

ko.bindingHandlers['tabs'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var each = function (arr, func) {
                try {
                    for (var i = 0; i < arr.length; i++) {
                        func(arr[i], i);
                    }
                } catch (e) {
                    console && console.log(e);
                }
            },
            options = allBindings().tabs.options,
            $element = $(element),
            tabClass = $element.attr('class') + '-',
            $ul = $($element.children()[0]),
            $tabs = (function (elArr) {
                var res = [];
                each(elArr, function (e) {
                    var $el = $(e);
                    $el.addClass(tabClass + 'tab');
                    $el.data('href', $el.children()[0].href.split('#')[1]);
                    $el.find('span').unwrap();
                    res.push($el);
                });
                return $(res);
            }($ul.find('li'))),
            selectTab = function ($el) {
                var selected = tabClass + 'selected',
                    href = $el.data('href'),
                    divId = '#' + href;

                each($tabs, function (e) {
                    e.removeClass(selected);
                });
                $el.addClass(selected);

                each($element.children(), function (el, i) {
                    $(el).addClass(i > 0 ? 'hidden' : '');
                });
                $(divId).removeClass('hidden');
                if (options.callback[href]) {
                    try {
                        options.callback[href].apply(bindingContext.$root);
                    } catch (e) {
                        console && console.log(e);
                    }
                }
            };

        $ul.addClass(tabClass + 'tabs');

        each($tabs, function (el) {
            $(el).on('click', function (event) {
                selectTab($(this));
            });
        });

        selectTab($tabs[0]);
    }
};

ko.bindingHandlers['treemenu'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
//        var each = function (arr, func) {
//                try {
//                    for (var i = 0; i < arr.length; i++) {
//                        func(arr[i], i);
//                    }
//                } catch (e) {
//                    console && console.log(e);
//                }
//            },
//            data = allBindings().treemenu.data(),
//            selected = allBindings().treemenu.value(),
//            $element = $(element);
//
//        console.log(data);
//        console.log(selected);
    }
};