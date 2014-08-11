/**
 * Created by mk-sfdev on 1/13/14.
 */

var TransactionViewModel = function (data, app) {
    var self = this;

    this.id = data.transaction_id;
    this.from_id = data.from_id;
    this.to_id = data.to_id;
    this.description = data.description;
    this.comment = data.comment;
    this.split = data.split | 0;
    this.hasSplit = ko.observable(false);
    this.amount = data.amount;
    this.currency = data.currency_id;
    this.created = moment.unix(data.created);
    this.deleted = ko.observable(data.deleted | 0);
    this.finished = data.finished | 0;
    this.hidden = data.hidden | 0;
    this.position = data.position | 0;

    this.template = data.template | 0;
    this.template_id = data.template_id;

    this.action_index = 0;

    if (app.accountsHash[self.from_id]
        && app.accountsHash[self.from_id]
        && self.from_id != self.to_id
        && !app.accountsHash[self.to_id].createFormAcc()) {
        app.accountsHash[self.to_id].createFormAcc(app.accountsHash[self.from_id]);
    }

    if(self.from_id && self.to_id && (self.from_id != self.to_id)){
        (function(){
            var from_type,
                from_group,
                to_type,
                to_group,
                status = 0,
                acc;

            if(app.accountsHash[self.from_id]){
                status++;
                acc = app.accountsHash[self.from_id];
                from_group = acc.group();
                from_type = acc.type();
            }
            if(app.accountsHash[self.to_id]){
                status++;
                acc = app.accountsHash[self.to_id];
                to_group = acc.group();
                to_type = acc.type();
            }

            if (status == 2) {
                if (to_type == 'IN') {
                    self.action_index = 1;
                } else if (from_group > 0 && to_group > 0) {
                    self.action_index = 2;
                }
            }

        }());
    }

    this.cssClass = ["passive_tr", "incoming_tr", "transport_tr"][self.action_index];

    this.currencyRate = ko.observable(1);

    this.editInstance = ko.observable();

    this.removeInstance = function(){
        app.transactionEdit().editMode(true);
        self.editInstance(false);
    };

    this.splitTransactions = ko.observableArray();

    this._showSplits = ko.observable(false);
    this.showSplits = function(){
        self._showSplits(!self._showSplits());
    };

    this.editRecord = function () {
        $.each(app.transactionsSet(),function(k,tr){
            tr.removeInstance && tr.removeInstance();
        });
        app.transactionEdit().editMode(false);
        self.editInstance(new TransactionEditViewModel(self, app, function (obj,r) {
            var uw = ko.utils.unwrapObservable,
                from_id = uw(obj.from_id),
                to_id = uw(obj.to_id);

            self.amount = uw(obj.amount);
            self.comment = uw(obj.comment);
            self.created = moment.unix(uw(obj.created));
            self.currency = uw(obj.currency_id);

            if (self.from_id != from_id) {
                app.accountsHash[self.from_id].removeTransaction(self.id);
                app.accountsHash[from_id].addTransaction(self);
            }
            if (self.to_id != to_id) {
                app.accountsHash[self.to_id].removeTransaction(self.id);
                if (to_id != from_id) {
                    app.accountsHash[to_id].addTransaction(self);
                }
            }

            self.from_id = from_id;
            self.to_id = to_id;
            self.removeInstance();
        }));
    };


    this.restoreRecord = function () {
        self.deleted(0);
    };
    this.removeRecord = function () {
        console.log(arguments);
        self.deleted(1);
    };
    self.deleted.subscribe(function (val) {
        ServerApi.updateTransaction('deleted', {transaction_id: self.id, value: val}, function (r) {
            if(r){
                app.accountsHash[self.from_id] && app.accountsHash[self.from_id].recalculateSum();
                app.accountsHash[self.to_id] && app.accountsHash[self.to_id].recalculateSum();
            }else{
                self.deleted(0);
            }
        });
    });

};
