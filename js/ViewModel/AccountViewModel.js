/**
 * Created by Lenovo on 09.11.13.
 */

var AccountViewModel = function (data, app) {
    var self = this,
        each = function (arr, callback) {
            var i = 0;
            try {
                while (i < arr.length) {
                    callback(i, arr[i]);
                    i++;
                }
            } catch (e) {
                console && console.log(e);
            }
        };

    this.id = data.account_id;
    this.currency = ko.observable(data.currency_id || "0");
    this.description = ko.observable(data.description || "");
    this.group = ko.observable(data.group || "");
    this.type = ko.observable(data.type || "");
    this.parent = ko.observable(data.parent || "");
    this.importance = ko.observable(data.importance | 0);
    this.creditlimit = ko.observable(data.creditlimit || "");
    this.expand = ko.observable(data.expand | 0);

    this.editMode = ko.observable(false);

    this.sum = ko.observable(0);

    this.children = ko.observableArray([]);
    this.transactions = [];

    this.editAccount = function () {
        each(app.accounts(),function(i,acc){
           acc.editMode(false);
        });
        self.editMode(true);
    };

    this.setParentAccount = function (acc,event) {
        app.accountsViewListParent(acc.id);
    };

    this.removeAccount = function () {
        console.log('removeAccount', arguments);
    };

    this.saveAccount = function () {

    };

    this.cloneAccount = function (acc) {

    };

    this.toggleExpand = function () {
        var res = !self.expand();
//mb app.action() === 'observe' ?
        if (self.children().length) {
            self.expand(res);
            ServerApi.updateAccount("expand", {account_id: self.id, value: res ? 1 : 0}, function (r) {

            });
        }
    };

    this.recalculateSum = function (root) {
        var res = 0,
            amount = 0,
            __now = new Date(),
            date,
            currentmonth = new Date(__now.getFullYear(), __now.getMonth());

        each(self.transactions, function (k, tr) {
            amount = parseFloat(tr.amount) * (tr.from_id == self.id ? 1 : -1);
            date = tr.created * 1000;

            if (self.group() == 0) {
                if (date > currentmonth.getTime())res += amount;
            } else {
                res += amount;
            }
        });
        if ((self.creditlimit() | 0) > 0) {
            res = parseFloat(self.creditlimit()) - res;
            res = 0;//TODO
        }
        if (self.group() == 0 && self.type() == 'IN') {
            res *= -1;
        }

        if (self.parent().length > 2) {
            root.accountsHash[self.parent()].sum(root.accountsHash[self.parent()].sum() + res);
        }

        self.sum(res);
    };

    this.children.subscribe(function (val) {
        if (val.length) {
            var res = 0;
            each(val, function (k, acc) {
                res += acc.sum();
            });
            self.sum(res);
        }
    });

    this.initChildren = function (root) {
        var res = [];
        each(root.accounts(), function (k, acc) {
            if (acc.parent() == self.id) {
                res.push(acc);
            }
        });
        self.children.pushAll(res);
    };
};
