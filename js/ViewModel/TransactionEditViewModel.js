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

    this.id = data.transaction_id || data.id;
    this.from_id = ko.observable(data.from_id || "66792");
    this.to_id = ko.observable(data.to_id);
    this.description = data.description;
    this.comment = ko.observable(data.comment || 'Комментарий');
    this.split = ko.observable(data.split);
    this.amount = ko.observable(data.amount);
    this.currency = ko.observable(data.currency_id || data.currency || app.baseCurrencyId());
    this.created = ko.observable(data.created);
    this.deleted = ko.observable(uw(data.deleted) | 0);
    this.finished = data.finished | 0;
    this.hidden = data.hidden | 0;

    console.log(this.currency());

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
        },
        {
            icon: 'tofriend_i',
            action: 'tofriend',
            description: 'Дать в долг'
        },
        {
            icon: 'ffriend_i',
            action: 'ffriend',
            description: 'Взять в долг'
        }

    ]);
    this.action = ko.observable(self.actions()[0]);

    self.amount.subscribe(function (v) {
        var val = v + '';
        if (val.indexOf(',')> -1) {
            val.replace(',', '.');
            self.amount(val);
        }
        val = parseFloat(val);
        if (isNaN(val)) {
            self.amount(0);
        }
        if (self.action().action == 'substract' && val > 0) {
            self.amount(val * -1);
        }else if(self.action().action != 'substract' && val < 0){
            self.amount(val * -1);
        }

    });

    this.template = data.template | 0;
    this.template_id = data.template_id;

    this.editMode = ko.observable(true);
    this.commentEdit = ko.observable(false);

    this.save = function () {

        var send = function (amount) {
                self.commentEdit(false);
                var obj = {
                    from_id: self.from_id(),
                    to_id: self.to_id(),
                    created: self.created().unix(),
                    currency_id: self.currency(),
                    comment: self.comment() == 'Комментарий' ? '' : self.comment(),
                    amount: amount,
                    finished: 1
                };
                if (self.id) {
                    obj.transaction_id = self.id;
                    ServerApi.updateTransaction(false, {data: JSON.stringify(obj)}, function (r) {
                        saveCallback && saveCallback(r);
                    })
                } else {
                    ServerApi.createTransaction(obj, function (r) {
                        saveCallback && saveCallback(r);
                        obj.transaction_id = r.transaction_id;
                        app.transactions.push(new TransactionViewModel(JSON.parse(JSON.stringify(obj))));
                        //TODO if created
                    })
                }

            },
            calculateCurrency = function (cur_from, cur_to, amount) {
                if (cur_from != cur_to && false) {
                    console.log(cur_from, cur_to);
                    ServerApi.getCurrencyRate({
                        currency_id: cur_to,
                        from: moment().format('YYYY-MM-DD')
                    }, function (r) {
                        send((parseFloat(r[1].rate) / r[0].rate) * amount);
                    });
                } else {
                    send(amount);
                }
            };

        var from_acc = app.accountsHash[self.from_id()],
            to_acc = app.accountsHash[self.to_id()];//TODO if self.currency !== to.currency ???

        calculateCurrency(from_acc.currency(), self.currency(), self.amount());
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
        return self.commentEdit() ? 'tr-comment-tpl' : 'tr-default-tpl';
    }, this);


};
