/**
 * Created by mk-sfdev on 12/9/13.
 */

var FilterViewModel = function(data, app){
    var self = this;
    this.label = data.label || '';
    this.short = data.short || '';
    this.selected = ko.observable(data.selected);
    this.hidden = !!data.hidden;
    this.value = data.value;

    this.selectRange = function(){
        app.selectedFilter(self);
    }

    this.toggleSelected = function(){
        self.selected(!self.selected());
    }
};