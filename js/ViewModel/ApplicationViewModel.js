/**
 * Created by Lenovo on 09.11.13.
 */
var ApplicationSettings = {
    cookieName: "vse_cookie_token"
};

var calendarMonthNamesLoc = ["Января", "Февраля", "Марта",
    "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября",
    "Октября", "Ноября", "Декабря"];

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }
    document.cookie = updatedCookie;
}


var ApplicationViewModel = function () {
    var self = this,
        actionMap = {
            "login": "login",
            "register": "login",
            "restore": "login",
            "congratulations": "login",
            "changepass": "login",
            "observe": "account",
            "insert": "account"
        };

    this.todayShorUpper = (new Date()).getDate() + ' ' + calendarMonthNamesLoc[date.getMonth()].substr(0, 3).toUpperCase();

    this.totalPassive = ko.observable(0);
    this.totalActive = ko.observable(0);
    this.totalConsumption = ko.observable(0);
    this.totalGain = ko.observable(0);
    this.totalLimited = ko.observable(0);

    this.page = ko.observable();
    this.action = ko.observable();

    this.currency = {};
    this.user = new UserViewModel();

//Accounts
//baseTypeAccount: ["IN", "OUT", "CASH", "BANK", "CARD", "LOAN", "ELECTRON", "OTHER"],
    this.accounts = ko.observableArray();
    this.accountsHash = {};

    this.getGainAcc = function () {
        var res = [], sum = 0;
        $.each(self.accounts(), function (k, acc) {
            if (acc.type() == "IN" && acc.group() == 0 && acc.parent() == 0) {
                res.push(acc);
                sum += acc.sum();
            }
        });
        self.totalGain(sum);
        return res;
    };
    this.getConsumptionAcc = function () {
        var res = [], sum = 0;
        $.each(self.accounts(), function (k, acc) {
            if (acc.type() == "OUT" && acc.group() == 0 && acc.parent() == 0) {
                res.push(acc);
                sum += acc.sum();
            }
        });
        self.totalConsumption(sum);
        return res;
    };
    this.getActiveAcc = function () {
        var res = [], sum = 0;
        $.each(self.accounts(), function (k, acc) {
            if (acc.group() == 1 && acc.parent() == 0) {
                res.push(acc);
                sum += acc.sum();
            }
        });
        self.totalActive(sum);
        return res;
    };
    this.getPassiveAcc = function () {
        var res = [], sum = 0;
        $.each(self.accounts(), function (k, acc) {
            if (acc.group() == 2 && acc.parent() == 0) {
                res.push(acc);
                sum += acc.sum();
            }
        });
        self.totalPassive(sum);
        return res;
    };

    this.userLogin = function () {
        var user = self.user;
        ServerApi.loginUser({user: user.login(), password: user.password()}, function (r) {
            user.token(r.token);
        })
    };

    this.user.token.subscribe(function (val){
        if (val) {
            ServerApi.getCurrencyList({}, function (r) {
                $.each(r, function (k, v) {
                    self.currency[v.currency_id] = v;
                });
            });
            ServerApi.getAccountList({}, function (r) {
                self.accounts.removeAll();
                self.accountsHash = {};
                var res = [],
                    accIds = [];
                $.each(r, function (k, acc) {
                    var a = new AccountViewModel(acc);
                    res.push(a);
                    self.accountsHash[a.id] = a;
                    accIds.push(a.id);
                });
                self.accounts.pushAll(res);
                ServerApi.getAccountSum({account_id:accIds.join(',')}, function (r) {
                    $.each(r,function(k,rObj){
                       self.accountsHash[rObj.account_id].sum(parseFloat(rObj.sum));
                    });
                    $.each(self.accounts(), function (k, acc) {
                        acc.initChildren(self);
                    });
                });

            });
        }
    });

    this.action.subscribe(function (val) {
        if (actionMap[val])self.page(actionMap[val]);
    });

    this.pageTemplateName = ko.computed(function () {
        return self.page() + "-page-tpl";
    }, this);

    this.pageContentTemplateName = ko.computed(function () {
        return self.action() + "-tpl";
    }, this);

    // Client-side routes
    Sammy(function () {
        this.get('#:action', function () {
            console.log(this.params.action);
            self.action(this.params.action);
        });

        this.get('#:action/:itemId', function () {
//            this.params.action;
//            this.params.itemId;

        });
        this.get('', function () {
            var token = getCookie(ApplicationSettings.cookieName),
                sammy = this;
            console.log(document.cookie);
            console.log(token);
            if (token) {
                ServerApi.checkToken({token: token}, function (r) {
                    if (r) {
                        ServerApi.checkAutoLogin(token, function (al) {
                            if (al) {
                                sammy.app.runRoute('get', "#observe");
                                self.user.remember(true);
                                self.user.token(token);
                                self.user.getLoginFromServer();
                            } else {
                                sammy.app.runRoute('get', "#login");
                            }
                        });
                    } else {
                        sammy.app.runRoute('get', "#login");
                    }
                });
            } else {
                sammy.app.runRoute('get', "#login");
            }
        });
    }).run();
};