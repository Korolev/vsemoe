/**
 * Created by Lenovo on 09.11.13.
 */
var UserViewModel = function () {
    var self = this,
        validateEmail = function (email) {
            var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return re.test(email);
        };

    this.errorMessages = {
        password: {
            required: "Пожалуйста, введите пароль"
        },
        newpassword: {
            required: "Пожалуйста, введите пароль"
        },
        renewpassword: {
            required: "Пожалуйста, введите пароль",
            equalTo: "Введеные вами пароли не совпадают"
        },
        user: {
            email: "Пожалуйста, введите корректный Email",
            required: "Пожалуйста, введите логин"
        },
        passed: "Email и пароль не соотвествуют друг другу"
    };

    this.login = ko.observable("");//email
    this.email = ko.observable("");//email
    this.password = ko.observable("");
    this.repassword = ko.observable("");
    this.remember = ko.observable(true);

    this.afterLoginFunc = function(){

    };

    this.showPassword = ko.observable(false);

    this.loginError = ko.observable(false);
    this.tokenError = ko.observable(false);
    this.emailError = ko.observable(false);
    this.passwordError = ko.observable(false);
    this.errorText = ko.observable("Логин и пароль не соответствуют друг другу");

    this.hasErrors = ko.computed(function () {
        return this.loginError() || this.emailError() || this.passwordError() || this.tokenError();
    }, this);

    this.clearError = function () {
        self.loginError(false);
        self.emailError(false);
        self.passwordError(false);
        self.tokenError(false);
    };

    this.loginValidate = function () {
        if (self.login().length) {
            self.loginError(!validateEmail(self.login()));
            self.errorText("Пожалуйста, введите корректный Email");
        } else if (self.email().length) {
            self.emailError(!validateEmail(self.email()));
            self.errorText("Пожалуйста, введите корректный Email");
        } else {
            self.loginError(false);
        }
    };

    this.password.subscribe(function (val) {
        self.passwordError(false);
    });

    this.repasswordValidate = function () {
        self.passwordError(self.password() != self.repassword());
        self.errorText('Пароли не соответствуют друг другу');
    };

    this.login.subscribe(function (val) {
        self.loginError(false);
    });
    this.email.subscribe(function (val) {
        self.emailError(false);
    });

    this.token = ko.observable();

    this.getLoginFromServer = function (callback) {
        var token = getCookie(ApplicationSettings.cookieName);
        if(!token) {
            if(typeof callback == 'function') { callback(); }
        } else {
            ServerApi.getUserByToken({token: token}, function (r) {
                try{
                    self.login(r[0].login);
                    if(typeof callback == 'function') { callback(); }
                }catch (e){
                    if(!r){
                        self.removeToken();
                    }
                    console.log(r);
                    console.log(e);
                    if(typeof callback == 'function') { callback(); }
                }
            });
        }
    };

    this.logout = function(callback) {
        var token = getCookie(ApplicationSettings.cookieName);
        ServerApi.logoutUser({token: token}, function(r) {
            console.log(r);
            self.login('');
            self.removeToken();
            if(typeof callback == 'function') { callback(); }
            else {
                window.location = '/';
            }
        })
    }

    this.setToken = function(val){
        var currDate = new Date(),
            token = getCookie(ApplicationSettings.cookieName);

        currDate.addYears(4);
        if(token != val){
            setCookie(ApplicationSettings.cookieName, val, self.remember() ? {
                expires: currDate
            } : {});
        }
    };

    this.removeToken = function(){
        setCookie(ApplicationSettings.cookieName, 0, {expires: new Date('1990')});
    };

    this.token.subscribe(function (val) {
        ServerApi.options.token = val;
        var token = getCookie(ApplicationSettings.cookieName);

        if (val && val != token) {
            self.setToken(val);
        }

        if(val){
            self.afterLoginFunc();
        }
    });
};
