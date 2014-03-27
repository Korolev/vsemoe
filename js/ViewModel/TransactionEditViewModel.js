/**
 * Created by mk-sfdev on 1/14/14.
 */
/**
 * Created by mk-sfdev on 1/13/14.
 */

var TransactionEditViewModel = function (data, app, saveCallback) {
    console.log(data);
    var self = this,
        uw = ko.utils.unwrapObservable;

    var splitTransaction = function (d) {
        var _self = this,
            data = d || {};

        this.to_id = ko.observable(data.to_id);
        this.amount = ko.observable(data.ammount || 0);

        this.isWrong = ko.observable(false);

        this.to_id.subscribe(function (val) {
            self.checkSplitSumm();
        });
        this.amount.subscribe(function (val) {
            self.checkSplitSumm();
            if (parseFloat(self.amount()) < 0 && val > 0) {
                _self.amount(-1 * val);
            }
        });
    };

    this.id = data.transaction_id || data.id;
    this.from_id = ko.observable(data.from_id || "66792");
    this.to_id = ko.observable(data.to_id);
    this.description = data.description;
    this.comment = ko.observable(data.comment || 'Комментарий');
    this.split = ko.observable(data.split);
    this.amount = ko.observable(isNaN(data.amount) ? 0 : parseFloat(data.amount));
    this.currency = ko.observable(data.currency_id || data.currency || app.baseCurrencyId());
    this.created = ko.observable(data.created);
    this.deleted = ko.observable(uw(data.deleted) | 0);
    this.finished = data.finished | 0;
    this.hidden = data.hidden | 0;

    this.cssClass = data.cssClass;

    this.actions = ko.observableArray([
        {
            icon: 'substr_i',
            action: 'substract',
            description: 'Расход',
            method: 'getConsumptionAcc'
        },
        {
            icon: 'add_i',
            action: 'add',
            description: 'Доход',
            method: 'getGainAcc'
        },
        {
            icon: 'move_i',
            action: 'move',
            description: 'Перемещение',
            method: 'getActiveAcc'
        }/*,
         {
         icon: 'tofriend_i',
         action: 'tofriend',
         description: 'Дать в долг'
         },
         {
         icon: 'ffriend_i',
         action: 'ffriend',
         description: 'Взять в долг'
         }*/

    ]);

    this.action = ko.observable(self.actions()[data.action_index | 0]);

    self.amount.subscribe(function (v) {
        var val = v + '';
        if (val.indexOf(',') > -1) {
            val.replace(',', '.');
            self.amount(val);
        }
        val = parseFloat(val);
        if (isNaN(val)) {
            self.amount(0);
        }
        if (self.action().action == 'substract' && val > 0) {
            self.amount(val * -1);
        } else if (self.action().action != 'substract' && val < 0) {
            self.amount(val * -1);
        }

    });

    this.template = data.template | 0;
    this.template_id = data.template_id;

    this.editMode = ko.observable(true);
    this.commentEdit = ko.observable(false);
    this.splitEdit = ko.observable(false);

    this.splitTransactions = ko.observableArray();

    this.commentEdit.subscribe(function (val) {
        val && self.splitEdit(false);
    });

    this.splitEdit.subscribe(function (val) {

        if (val) {
            self.commentEdit(false);
            self.splitTransactions.push(new splitTransaction());
            self.splitTransactions.push(new splitTransaction());
        } else {

        }
    });

    this.removeSplitTransaction = function (item) {
        self.splitTransactions.remove(item);
    };

    this.checkSplitSumm = function () {
        var mod = Math.abs,
            splitSumm = 0,
            splitLen = self.splitTransactions().length,
            nedAdd = false;
        $.each(self.splitTransactions(), function (k, split) {
            if (split.to_id()) {
                splitSumm += parseFloat(split.amount());
                split.isWrong(mod(splitSumm) > mod(self.amount()));
                nedAdd = (k == splitLen - 1 && mod(splitSumm) < mod(self.amount()));
            }
        });
        if (nedAdd) {
            self.splitTransactions.push(new splitTransaction());
        }
    };

    this.actionsMap = {
        substract: {
            group_from: [1, 2],
            type_from: false,
            group_to: 0,
            type_to: 'OUT'
        }, add: {
            group_from: [1, 2],
            type_from: false,
            group_to: 0,
            type_to: 'IN'
        },
        move: {
            group_from: [1, 2],
            type_from: false,
            group_to: [1, 2],
            type_to: false
        },
        tofriend: {
            group_from: [1, 2],
            type_from: false,
            group_to: 1,
            type_to: 'CASH'
        },
        ffriend: {
            group_from: [1, 2],
            type_from: false,
            group_to: 2,
            type_to: 'LOAN'
        }
    };

    this.fromAcc = ko.computed(function () {
        var fAcc = [],
            action = self.actionsMap[self.action().action];
        if (action) {
            $.each(app.accounts(), function (k, acc) {
                if (action.group_from !== false && action.type_from) {
                    if ($.isArray(action.group_from)) {
                        if (action.group_from.indexOf(acc.group()) > -1 && acc.type() == action.type_from) {
                            if (!acc.children().length)fAcc.push(acc);
                        }
                    } else {
                        if (acc.group() == action.group_from && acc.type() == action.type_from) {
                            if (!acc.children().length)fAcc.push(acc);
                        }
                    }
                } else if (action.group_from !== false && !action.type_from) {
                    if ($.isArray(action.group_from)) {
                        if (action.group_from.indexOf(acc.group()) > -1) {
                            if (!acc.children().length)fAcc.push(acc);
                        }
                    } else {
                        if (acc.group() == action.group_from) {
                            if (!acc.children().length)fAcc.push(acc);
                        }
                    }
                }
            });
        } else {
            fAcc = self.accounts();
        }
        return fAcc;
    }, this).extend({throttle: 1});

    this.toAcc = ko.computed(function () {
        var fAcc = [],
            action = self.actionsMap[self.action().action];
        if (action) {
            $.each(app.accounts(), function (k, acc) {
                if (action.group_to !== false && action.type_to) {
                    if ($.isArray(action.group_to)) {
                        if (action.group_to.indexOf(acc.group()) > -1 && acc.type() == action.type_to) {
                            if (acc.parent() == 0)fAcc.push(acc);
                        }
                    } else {
                        if (acc.group() == action.group_to && acc.type() == action.type_to) {
                            if (acc.parent() == 0)fAcc.push(acc);
                        }
                    }
                } else if (action.group_to !== false && !action.type_to) {
                    if ($.isArray(action.group_to)) {
                        if (action.group_to.indexOf(acc.group()) > -1) {
                            if (acc.parent() == 0)fAcc.push(acc);
                        }
                    } else {
                        if (acc.group() == action.group_to) {
                            if (acc.parent() == 0)fAcc.push(acc);
                        }
                    }
                }
            });
        }
        return fAcc;
    }, this).extend({throttle: 1});

    this.save = function () {

        var send = function (amount) {
            var _new_from;
            if (self.action().action == 'move' && amount > 0) {
                amount = amount * -1;
                console.log(amount);
            }
            self.commentEdit(false);
            self.splitEdit(false);
            var obj = {
                from_id: self.from_id(),
                to_id: self.to_id(),
                created: self.created().unix(),
                currency_id: self.currency(),
                comment: self.comment() == 'Комментарий' ? '' : self.comment(),
                amount: amount,
                description: amount,
                finished: 1
            };
            if (self.id) {
                obj.transaction_id = self.id;
                ServerApi.updateTransaction(false, {data: JSON.stringify(obj)}, function (r) {
                    saveCallback && saveCallback(obj, r);
                    app.accountsHash[self.from_id()] && app.accountsHash[self.from_id()].recalculateSum();
                    app.accountsHash[self.to_id()] && app.accountsHash[self.to_id()].recalculateSum();
                })
            } else {
//                if(self.action().action == 'add'){
//                    _new_from = self.to_id();
//                    obj.to_id = obj.from_id;
//                    obj.from_id = _new_from;
//                }
                app.createTransaction(obj, function (r) {
                    obj.transaction_id = r.transaction_id;
                    var newTransaction = new TransactionViewModel(JSON.parse(JSON.stringify(obj)), app),
                        splits = [];
                    saveCallback && saveCallback(r);
                    self.comment('Комментарий');
                    self.created(moment());
                    self.to_id('');
                    self.amount(0);
                    app.transactions.push(newTransaction);
                    app.transactionsHash[newTransaction.id] = newTransaction;
                    //SPLIT
                    if (self.splitTransactions().length) {
                        $.each(self.splitTransactions(), function (k, split) {
                            if (split.to_id() && split.amount()) {
                                obj.comment = '';
                                obj.split = obj.transaction_id || obj.split;
                                delete obj.transaction_id;
//                                if(_new_from){
//                                    obj.from_id = split.to_id();
//                                }else{
//                                    obj.to_id = split.to_id();
//                                }
                                obj.amount = split.amount();
                                obj.description = split.amount();

                                var _newTr,
                                    clone_obj = JSON.parse(JSON.stringify(obj));

                                app.createTransaction(clone_obj, function (_r) {
                                    clone_obj.transaction_id = _r.transaction_id;
                                    _newTr = new TransactionViewModel(clone_obj, app);
                                    newTransaction.hasSplit(true);
                                    newTransaction.splitTransactions.push(_newTr);
                                    app.transactions.push(_newTr);
                                    app.transactionsHash[_newTr.id] = _newTr;
                                });
                            }
                        });
                        self.splitTransactions.removeAll();
                    }
                })
            }

        };

        var from_acc = app.accountsHash[self.from_id()],
            to_acc = app.accountsHash[self.to_id()];

        send(self.amount());
    };

    this.cancel = function () {
        data.removeInstance();
    };

    this.getFromList = ko.computed(function () {
        var method = self.action().method,
            accounts = app.accounts();
        return app[method] ? app[method]() : [];
    }, this).extend({throttle: 1});

    this.getTpl = ko.computed(function () {
        return self.commentEdit() ?
            'tr-comment-tpl'
            : self.splitEdit() ?
            'tr-split-tpl'
            : 'tr-default-tpl';
    }, this);


};
