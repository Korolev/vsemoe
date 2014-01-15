/**
 * Created by mk-sfdev on 1/14/14.
 */
/**
 * Created by mk-sfdev on 1/13/14.
 */

var TransactionEditViewModel = function (data, app) {

    var self = this;

    this.id = data.transaction_id;
    this.from_id = ko.observable(data.from_id || "66792");
    this.to_id = ko.observable(data.to_id);
    this.description = data.description;
    this.comment = ko.observable(data.comment || 'Комментарий');
    this.split = ko.observable(data.split);
    this.amount = ko.observable(data.amoun);
    this.currency = ko.observable(data.currency_id || app.baseCurrencyId);
    this.created = ko.observable(data.created);
    this.deleted = ko.observable(data.deleted | 0);
    this.finished = data.finished | 0;
    this.hidden = data.hidden | 0;

    this.actions = ko.observableArray([
        {
            icon:'substr_i',
            action:'substract',
            description:'Расход'
        },{
            icon:'add_i',
            action: 'add',
            description:'Доход'
        },{
            icon:'move_i',
            action:'move',
            description:'Перемещение'
        },{
            icon:'tofriend_i',
            action: 'tofriend',
            description:'Дать в долг'
        },{
            icon:'ffriend_i',
            action: 'ffriend',
            description:'Взять в долг'
        }

    ]);
    this.action = ko.observable(self.actions()[0]);

    this.template = data.template | 0;
    this.template_id = data.template_id;

    this.editMode = ko.observable(true);
    this.commentEdit = ko.observable(false);

    this.save = function(){
        console.log('save');
    };

    this.cancel = function(){
        console.log('cancel');
    };

    this.getTpl = ko.computed(function(){
        return self.commentEdit() ? 'tr-comment-tpl' : 'tr-default-tpl';
    },this);
};
