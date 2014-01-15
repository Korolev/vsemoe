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
    this.split = data.split;
    this.amount = data.amount;
    this.currency = data.currency_id;
    this.created = data.created;
    this.deleted = ko.observable(data.deleted | 0);
    this.finished = data.finished | 0;
    this.hidden = data.hidden | 0;

    this.template = data.template | 0;
    this.template_id = data.template_id;
};
