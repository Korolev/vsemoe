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
    this.newParent = ko.observable(data.parent || "");
    this.importance = ko.observable(data.importance | 0);
    this.creditlimit = ko.observable(data.creditlimit || "");
    this.expand = ko.observable(data.expand | 0);
    this.show = ko.observable(!!(data.show|0));

    this.comment = ko.observable(data.comment || "other");
    this.helpText = data.helpText || '';

    this.editMode = ko.observable(!!data.editMode);

    this.sum = ko.observable(0);

    this.children = ko.observableArray([]);
    this.transactions = [];

    //feature
    this.currentBlock = ko.observable(data.currentBlock || {});

    this.currentBlock.subscribe(function(block){
        if(block){
            self.comment(block.icon);
            self.type(block.type);
        }
        //self.group(block.group == undefined ? 1 : block.group);
    });

    this.editAccount = function () {
        each(app.accounts(), function (i, acc) {
            acc.editMode(false);
        });
        self.editMode(true);
    };

    this.setParentAccount = function (acc, event) {
        app.accountsViewListParent(acc.id);
    };

    this.removeAccount = function () {
        app.showModal('removeCat',function(){
            app.accounts.remove(self);
            if(self.id){
                ServerApi.deleteAccount({account_id:self.id},console.log);
            }
        });
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

        if (self.parent() && self.parent().length > 1 && res) {
            app.accountsHash[self.parent()].sum(app.accountsHash[self.parent()].sum() + res);
        }

        if(!self.children().length)self.sum(res);
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

    this.editMode.subscribe(function (edit) {
        if (!edit) {
            var val = self.newParent();
            if (val && val != self.id && val != self.parent()) {
                app.accountsHash[val].children.push(self);
                if (self.parent() > 0) {
                    console.log(self.parent());
                    app.accountsHash[self.parent()].children.remove(self);
                }
                self.parent(val);
            }
            self.save();
        }
    });

    self.newParent.subscribe(function (val) {
        if (val == self.id) {
            self.newParent(self.parent());
        }
    });

    this.save = function () {
        if(!self.description()){
            app.accounts.remove(self);
            return false;
        }
        if(self.id){
            ServerApi.updateAccount(false, {
                data: JSON.stringify({
                    description: self.description(),
                    currency_id: self.currency(),
                    parent: self.parent(),
                    type: self.type(),
                    group: self.group(),
                    expand: +(!!self.expand()),
                    account_id: self.id,
                    show: self.show() ? 1 : 0
                })
            },function(r){});
        }else{
            ServerApi.createAccount({
                description: self.description(),
                currency_id: self.currency(),
                parent: self.parent(),
                type: self.type(),
                group: self.group(),
                expand: +(!!self.expand()),
                show: self.show() ? 1 : 0
            },function(r){
                if(r.account_id){
                    self.id = r.account_id;
                    app.accountsHash[self.id] = self;
                    app.accounts.push(self);
                    if(self.sum()>0){
                        var obj = {
                            from_id: r.account_id,
                            to_id: r.account_id,
                            created: moment().unix(),
                            currency_id: self.currency(),
                            amount: self.sum(),
                            description: self.sum(),
                            finished: 1,
                            hidden:1,
                            position:1
                        };
                        ServerApi.createTransaction(obj,function(r){
                            console.log(r);
                        });
                    }
                }
            })
        }
    };

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
