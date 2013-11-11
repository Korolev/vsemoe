/**
 * Created by Lenovo on 09.11.13.
 */
var UserViewModel = function () {
    var self = this;

    this.login = ko.observable();//email
    this.password = ko.observable();
    this.remember = ko.observable(false);

    this.token = ko.observable();

    this.getLoginFromServer = function(){
      ServerApi.getUserByToken({},function(r){
          self.login(r[0].login);
      })
    };

    this.token.subscribe(function(val){
        ServerApi.options.token = val;
        var currYear = (new Date()).getFullYear();
        if(self.remember()){
            setCookie(ApplicationSettings.cookieName,val,{expires:new Date([currYear*1+1,12,30])});
        }
    });
};