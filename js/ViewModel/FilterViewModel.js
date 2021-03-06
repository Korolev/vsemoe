/**
 * Created by mk-sfdev on 12/9/13.
 */

var FilterViewModel = function (data, app) {
    var self = this;

    this.type = data.type || 'period';
    this.label = data.label || '';
    this.short = data.short || '';
    this.selected = ko.observable(data.selected);
    this.hidden = !!data.hidden;
    this.value = data.value;

    this.selectRange = function () {
        app.selectedFilter(self);
    };

    this.toggleSelected = function () {
        self.selected(!self.selected());
    };

    this.test = function (transaction, start, end) {
        var res = false,
            aid = app.accountId();
        try {
            res = !!aid ?
                transaction.from_id == aid || transaction.to_id == aid
                : true;
            if (self.value != 'all' && res) {
                //use start end date
                res = transaction.created.unix() >= start.unix()
                    && transaction.created.unix() <= end.unix();
            }
        } catch (e) {
            console && console.log(e);
        }
        return res;
    }
};