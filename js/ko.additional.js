/**
 * Created by Lenovo on 09.11.13.
 */
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

ko.bindingHandlers['accountname'] = {
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            acc = bindingContext.$root.accountsHash[value];
        value = acc ? acc.description : "";
        ko.utils.setTextContent(element, value);
    }
};

ko.bindingHandlers['textdate'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            date = new Date(),
            trdate = new Date(value * 1000),
            trnow = new Date(+trdate.getFullYear(), parseInt(trdate.getMonth(),10), parseInt(trdate.getDate(),10)),
            now = new Date(+date.getFullYear(), parseInt(date.getMonth(),10), parseInt(date.getDate(),10)),
            now_1 = new Date(+date.getFullYear(), parseInt(date.getMonth(),10), parseInt(date.getDate(),10) - 1),
            now_2 = new Date(+date.getFullYear(), parseInt(date.getMonth(),10), parseInt(date.getDate(),10) - 2),
            dayOfWeek = trdate.getDay();

        if (trnow.getTime() == now.getTime()) {
            value = [
                (trdate.getHours()+"").length == 1?"0"+trdate.getHours():trdate.getHours(),
                ":",
                (trdate.getMinutes()+"").length == 1 ?"0"+trdate.getMinutes():trdate.getMinutes()].join("");
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
        value = bindingContext.$root.currency[value].shortname;
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