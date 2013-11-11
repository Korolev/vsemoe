/**
 * Created by Lenovo on 09.11.13.
 */
var UserViewModel = function () {
    var self = this,
        validateEmail = function (email) {
            var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return re.test(email);
        };

    this.login = ko.observable("");//email
    this.password = ko.observable("");
    this.remember = ko.observable(false);

    this.loginError = ko.observable(false);
    this.passwordError = ko.observable(false);
    this.errorText = ko.observable("Логин и пароль не соответствуют друг другу");

    this.hasErrors = ko.computed(function(){
        return this.loginError() || this.passwordError();
    },this);

    this.login.subscribe(function(val){
        if(val){
            if(self.timeId)clearTimeout(self.timeId);
            self.timeId = setTimeout(function(){
                self.loginError(!validateEmail(val));
                self.errorText("Пожалуйста, введите корректный Email");
            },800);
        }else{
            self.loginError(false);
        }

    });

    this.token = ko.observable();

    this.getLoginFromServer = function () {
        ServerApi.getUserByToken({}, function (r) {
            self.login(r[0].login);
        })
    };

    this.token.subscribe(function (val) {
        ServerApi.options.token = val;
        var currYear = (new Date()).getFullYear();
        if (self.remember()) {
            console.log("setcookie");
            setCookie(ApplicationSettings.cookieName, val, {expires: new Date([currYear * 1 + 1, 12, 30])});
        }
    });
};