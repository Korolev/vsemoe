/**
 * Created by Lenovo on 09.11.13.
 */

var AccountViewModel = function(data){
    var self = this;

    this.id = data.account_id;
    this.currency = ko.observable(data.currency_id||"0");
    this.description = ko.observable(data.description || "");
    this.group = ko.observable(data.group || "");
    this.type = ko.observable(data.type || "");
    this.parent = ko.observable(data.parent || "");
    this.importance = ko.observable(data.importance || "");
    this.creditlimit = ko.observable(data.creditlimit || "");
    this.expand = ko.observable(!!data.expand);

    this.sum = ko.observable(0);

    this.children = ko.observableArray([]);
    this.transactions = ko.observableArray([]);

    this.toggleExpand = function(){
      self.expand(!self.expand());
    };

    this.initChildren = function(root){
        var res = [];
        $.each(root.accounts(),function(k,acc){
            if(acc.parent()==self.id){
                res.push(acc);
            }
        });
        self.children.pushAll(res);
    };
};
