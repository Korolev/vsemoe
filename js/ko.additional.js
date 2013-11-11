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
  'update': function (element, valueAccessor, allBindings, viewModel, bindingContext ) {
    var value = ko.utils.unwrapObservable(valueAccessor()),
      acc = bindingContext.$root.accountsHash[value];
    value = acc ? acc.description : "";
    ko.utils.setTextContent(element, value);
  }
};

ko.bindingHandlers['textdate'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
          date = new Date(value*1000);
        value = [date.getDate(),calendarMonthNamesLoc[date.getMonth()].substr(0,3),date.getFullYear()];
        ko.utils.setTextContent(element, value.join(" "));
    }
};
ko.bindingHandlers['shorttext'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) + "";
        value = value.length > 18 ? value.substr(0,18)+"..":value;
        ko.utils.setTextContent(element, value);
    }
};

ko.bindingHandlers['currency'] = {
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext ) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        value = bindingContext.$root.currency[value].shortname;
        ko.utils.setTextContent(element, value);
    }
};

ko.bindingHandlers['gotoaction'] = {
    'init': function (element, valueAccessor, allBindings, root) {
        $(element).click(function(e){
            var val = ko.utils.unwrapObservable(valueAccessor());
            //root.action(val);
            location.hash = val;
        })
    }
};