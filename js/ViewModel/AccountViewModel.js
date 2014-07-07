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
    this.group = ko.observable(data.group | 0);
    this.type = ko.observable(data.type || "");
    this.parent = ko.observable(data.parent | 0 || "");
    this.newParent = ko.observable(data.parent || "");
    this.importance = ko.observable(data.importance | 0);
    this.expand = ko.observable(data.expand | 0);
    this.show = ko.observable(!!(data.show | 0));

    this.creditlimit = ko.observable(data.creditlimit || "");

    this.showFromIdSelect = ko.observable(false);
    this.createFormAcc = ko.observable();

//    this.comment = ko.observable(data.comment);
    this.comment = ko.observable(app.accountIconsHash[data.category]);
    this.helpText = data.helpText || '';

    this.category = ko.observable(data.category);
    this.icon = ko.computed(function () {
        return app.accountIconsHash[self.category()] || "other";
    }, this).extend({throttle: 1});

    this.editMode = ko.observable(!!data.editMode);

    this.sum = ko.observable(0);
    this.availableSum = ko.computed({
        read: function () {
            return (parseFloat(self.creditlimit()) - self.sum()) || 0 ;
        },
        write: function (val) {
            self.sum(parseFloat(self.creditlimit()) - parseFloat(val));
        },
        owner: this
    }).extend({throttle: 1});

    this.children = ko.observableArray([]);
    this.transactions = [];

    //feature
    this.currentBlock = ko.observable(data.currentBlock || {});

    this.currentBlock.subscribe(function (block) {
        if (block) {
            self.type(block.type);
            self.category(block.category);
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
        app.showModal('removeCat', function () {
            app.accounts.remove(self);
            if (self.id) {
                ServerApi.deleteAccount({account_id: self.id}, console.log);
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

    this.recalculateSum = function () {
        var res = 0,
            amount = 0,
            __now = new Date(),
            date,
            lastFixDate,
            currentmonth = new Date(__now.getFullYear(), __now.getMonth());

        each(self.transactions, function (k, tr) {
            var trDate = tr.created.unix() * 1000;
            if (tr.position) {
                if (!lastFixDate) {
                    lastFixDate = trDate;
                    res = parseFloat(tr.amount);
                } else if (trDate > lastFixDate) {
                    lastFixDate = trDate;
                    res = parseFloat(tr.amount);
                }
            }
        });

        each(self.transactions, function (k, tr) {
            if (!tr.hasSplit()) {
                amount = parseFloat(tr.amount) * (tr.from_id == self.id ? 1 : -1);
                if (self.currency() && tr.currency != self.currency()) {
                    amount = app.calculateAmount(
                        tr.currency,
                        self.currency(),
                        amount,
                        tr.created.format('YYYY-MM-DD')
                    );
                }
                date = tr.created.unix() * 1000;

                //TODO use rates;
                if (!tr.hidden) {
                    if (self.group() == 0 && tr.deleted() == 0) {
                        if (date > currentmonth.getTime())res += amount;
                    } else if (tr.deleted() == 0 && date > lastFixDate) {
                        if (self.group() == 2){
                            amount *= -1;
                        }
                        res += amount;
                    }
                }
            }
        });
        if ((self.creditlimit() | 0) > 0) {
//            res -= parseFloat(self.creditlimit());
//            if(res < 0 && self.group() == 1){
//                self.group(2);
//                res *= -1;
//            }
//            if(res < 0 && self.group() == 2){
//                self.group(1);
//                res *= -1;
//            }

//            res = 0;//TODO
        }
        if (self.group() == 0 && self.type() == 'IN') {
            res *= -1;
        }

        each(self.children(), function (k, acc) {
            res += acc.sum();
        });

        self.sum(res);

        if (self.parent() && (self.parent() | 0) > 1 && res) {
            app.accountsHash[self.parent()].recalculateSum();
        }
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
            var val = self.newParent() | 0;
            if (val && val != self.id && val != self.parent()) {
                app.accountsHash[val].children.push(self);
                if (self.parent() > 0) {
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

    this.update = function () {
        var newSumm = self.sum() | 0;
        self.recalculateSum();
        if (self.sum() != newSumm) {
            var obj = {
                from_id: self.id,
                to_id: self.id,
                created: moment().unix(),
                currency_id: self.currency(),
                amount: newSumm,
                description: newSumm,
                category: self.category(),
                finished: 1,
                hidden: 1,
                position: 1
            };
            app.createTransaction(obj, function (r) {
                if (r.transaction_id) {
                    obj.transaction_id = r.transaction_id;
                    app.transactions.push(new TransactionViewModel(obj, app));
                }
            });
            var objClone = JSON.parse(JSON.stringify(obj));
            objClone.amount = newSumm - self.sum();
            objClone.description = newSumm - self.sum();
            objClone.position = 0;
            objClone.created = moment().unix();
            app.createTransaction(obj, function (r) {
                if (r.transaction_id) {
                    objClone.transaction_id = r.transaction_id;
                    app.transactions.push(new TransactionViewModel(objClone, app));
                }
                self.save();
            });
        } else {
            self.save();
        }
    };

    this.deleteRecord = function () {
        self.description('');
        self.save();
    };

    this.save = function () {
        if (!self.description()) {
            app.accounts.remove(self);
            ServerApi.deleteAccount({
                account_id: self.id
            }, function (r) {
                if (r) {
                    location.hash = 'accmanage';
                }
            });
            return false;
        }
        if (self.id && self.id != 'to_delete') {
            ServerApi.updateAccount(false, {
                data: JSON.stringify({
                    description: self.description(),
                    currency_id: self.currency(),
                    creditlimit: self.creditlimit(),
                    parent: self.parent(),
                    type: self.type(),
                    group: self.group(),
                    expand: +(!!self.expand()),
                    account_id: self.id,
                    category: self.category(),
                    show: self.show() ? 1 : 0
                })
            }, function (r) {
            });
        } else {
            ServerApi.createAccount({
                description: self.description(),
                currency_id: self.currency(),
                creditlimit: self.creditlimit(),
                parent: self.parent(),
                type: self.type(),
                group: self.group(),
                category: self.category(),
                expand: +(!!self.expand()),
                show: self.show() ? 1 : 0
            }, function (r) {
                if (r.account_id) {
                    var oldId = self.id;
                    self.id = r.account_id;
                    app.accountsHash[self.id] = self;
                    if (!oldId)app.accounts.push(self);
                    if (self.sum() != 0) {
                        var obj = {
                            from_id: r.account_id,
                            to_id: r.account_id,
                            created: moment().unix(),
                            currency_id: self.currency(),
                            amount: self.sum(),
                            description: self.sum(),
                            finished: 1,
                            hidden: 1,
                            position: 1
                        };
                        if(self.createFormAcc()){
                            obj.from_id = self.createFormAcc().id;
                            obj.hidden = 0;
                        }
                        app.createTransaction(obj, function (r) {
                            if (r.transaction_id) {
                                obj.transaction_id = r.transaction_id;
                                app.transactions.push(new TransactionViewModel(obj, app));
                            }
                            self.recalculateSum(app);
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

    this.removeTransaction = function (tId) {
        var idx = -1;
        $.each(self.transactions, function (k, tr) {
            if (tr.id == tId) {
                idx = k;
            }
        });
        if (idx > -1) {
            self.transactions.splice(idx, 1);
        }
        self.recalculateSum();
    }
    this.addTransaction = function (tr) {
        self.transactions.push(tr);
        self.recalculateSum();
    }
};
