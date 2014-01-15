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
        var uw = ko.utils.unwrapObservable,
            value = uw(valueAccessor());
        value = uw(value);
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
//TODO option caption BUG replace 1 li but need add before
ko.bindingHandlers['select'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var uw = ko.utils.unwrapObservable,
            $element = $(element),
            config = valueAccessor(),
            optionText = uw(config.optionText),
            optionValue = uw(config.optionValue),
            optionsCaption = uw(config.optionCaption),
            tag = uw(config.tag ? config.tag : 'div'),
            icon = uw(config.icon),
            css = uw(config.css),
            options,
            value = uw(config.value),
            isSelected,
            _text,
            _ul,
            _options = [],
            buildUI = function () {
                options = uw(config.options);
                if(_text){
                    _text.remove();
                }
                if(_ul){
                    _ul.remove()
                }
                _text = $('<'+tag+' class="fake_select" />').insertBefore($element);
                _ul = $('<ul class="fake_select_body"></ul>').insertAfter(_text).addClass('hidden');
                _options = [];

                var _optionValue,
                    _innerContent;

                _ul.css(css ? css :{
                    'left': _text.position().left,
                    'width': _text.innerWidth()
                });
                if (optionsCaption) {
                    var opt0 = optionText ? {} : optionsCaption;
                    if (optionText) {
                        opt0[optionText] = optionsCaption;
                        opt0.isCaption = true;
                    }

                    _options[0] = $('<li></li>')
                        .text(optionsCaption)
                        .data('_option', opt0)
                        .data('_selected', value == 0);

                    _options[0].on('click', function () {
                        config.value(0);
                        _ul.addClass('hidden');
                    });
                    _options[0].appendTo(_ul);
                }

                for (var i = optionsCaption ? 1 : 0; i < options.length; i++) {
                    _optionValue = optionValue ? options[i][optionValue] : options[i];
                    isSelected = optionValue ?
                        _optionValue == value
                        : _optionValue === value;

                    _innerContent = optionText ? uw(options[i][optionText]) : options[i];
                    if(icon){
                        _innerContent = '<i class="'+options[i][icon]+'"></i>'+_innerContent;
                    }

                    _options[i] = $('<li></li>')
                        .html(_innerContent)
                        .data('_option', options[i])
                        .data('_selected', isSelected);

                    _options[i][isSelected ? 'addClass' : 'removeClass']('selected');

                    _options[i].on('click', function () {
                        var opt = optionValue ?
                            $(this).data('_option')[optionValue]
                            : $(this).data('_option');
                        config.value(opt);
                        _ul.addClass('hidden');
                    });
                    _options[i].appendTo(_ul);
                }

                _text.on('click', function () {
                    $('.fake_select_body').not(_ul).addClass('hidden');
                    _ul.toggleClass('hidden');
                });


                $element.data('text', _text);
                $element.data('options', _options);
            };

        buildUI();

        if (ko.isObservable(config.options)) {
            config.options.subscribe(function (val) {
                buildUI();
                config.value.valueHasMutated();
            });
        }

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var uw = ko.utils.unwrapObservable,
            $element = $(element),
            config = valueAccessor(),
            optionText = uw(config.optionText),
            optionValue = uw(config.optionValue),
            optionsCaption = uw(config.optionCaption),
            options = uw(config.options),
            value = uw(config.value),
            _text = $element.data('text'),
            _options = $element.data('options'),
            _optionValue,
            isSelected;
        for (var i = 0; i < _options.length; i++) {
            _optionValue = optionValue ?
                _options[i].data('_option')[optionValue]
                : _options[i].data('_option');
            isSelected = optionValue ?
                _optionValue == uw(value)
                : _optionValue === value;
            if (_options[i].data('_option').isCaption && uw(value) == 0) {
                isSelected = true;
            }

            _options[i][isSelected ? 'addClass' : 'removeClass']('selected');

            if (isSelected) {
                _text.text(uw(_options[i].data('_option')[optionText]));
            }
        }


    }
};

ko.bindingHandlers['treeSelect'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var uw = ko.utils.unwrapObservable,
            $element = $(element),
            config = valueAccessor(),
            optionText = uw(config.optionText),
            optionTree = uw(config.optionTree),
            optionValue = uw(config.optionValue),
            optionsCaption = uw(config.optionCaption),
            tag = uw(config.tag ? config.tag : 'div'),
            icon = uw(config.icon),
            css = uw(config.css),
            options,
            value = uw(config.value),
            isSelected,
            _text,
            _ul,
            _options = [],
            buildUI = function () {
                options = uw(config.options);
                if(_text){
                    _text.remove();
                }
                if(_ul){
                    _ul.remove()
                }
                _text = $('<'+tag+' class="fake_tree_select" />').insertBefore($element);
                _ul = $('<ul class="fake_tree_select_body"></ul>').insertAfter(_text).addClass('hidden');
                _options = [];

                var _optionValue,
                    _innerContent;

                _ul.css(css ? css :{
                    'left': _text.position().left,
                    'width': _text.innerWidth()
                });

                var buildLi = function(arr,parent){
                    var __options = [],
                        child,
                        __ul;
                    for(var i =0; i< arr.length; i++){
                        console.log(arr[i], arr[i][optionText]);
                        __options[i] = $('<li></li>')
                            .appendTo(parent)
                            .append($('<span></span>')
                                .text(uw(arr[i][optionText])));

                        child = uw(arr[i][optionTree]);
                        if(child.length){
                            __options[i].addClass('has_child');
                            __ul = $('<ul class="hidden"></ul>').appendTo(__options[i]);
                            __options[i].data('_list',__ul);
                            buildLi(child,__ul);
                            __options[i].on('click',function(){
                                $(this).toggleClass('_open');
                                $(this).data('_list').toggleClass('hidden');
                            });
                        }
                    }
                    parent.data('_options',__options);
                };

                buildLi(options,_ul);
                _text.on('click',function(){
                   _ul.toggleClass('hidden');
                });
            };

            buildUI();
        console.log(config);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var uw = ko.utils.unwrapObservable,
            $element = $(element),
            config = valueAccessor(),
            optionText = uw(config.optionText),
            optionValue = uw(config.optionValue),
            optionsCaption = uw(config.optionCaption),
            options = uw(config.options),
            value = uw(config.value),
            _text = $element.data('text'),
            _options = $element.data('options'),
            _optionValue,
            isSelected;

    }
};