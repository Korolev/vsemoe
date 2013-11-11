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

    this.transactions = ko.observableArray();
    this.transactionsSet = ko.observableArray();
    this.transFiltered = [];

//Paging
    this.currentPage = ko.observable(1);
    this.pageSize = 15;
    this.totalPages = 1;
    this.totalPagesArr = ko.observableArray([1]);

    this.transactions.subscribe(function (val) {
        if (val.length) {
            self.transFiltered = [];
            $.each(val, function (k, t) {
                if (t.hidden == "0" && t.template == "0" && !!t.finished) {
                    self.transFiltered.push(t);
                }
            });
            self.transFiltered.sort(function (a, b) {
                return a.created > b.created ? -1 : 1;
            });
            var tLen = self.transFiltered.length;
            self.totalPages = tLen % self.pageSize == 0 ? tLen / self.pageSize : (tLen / self.pageSize | 0) + 1;
            self.totalPagesArr(new Array(self.totalPages));
            self.transactionsSetGen()
        }
    });

    this.currentPage.subscribe(function (val) {
        if (val > self.totalPages || val < 1) {
            self.currentPage(1);
        } else {
            self.transactionsSetGen();
        }
    });

    this.transactionsSetGen = function () {
        var res = [],
            i = (self.currentPage() - 1) * self.pageSize,
            j = self.currentPage() * self.pageSize;
        for (; i < j; i += 1) {
            if (self.transFiltered[i])res.push(self.transFiltered[i]);
        }
        self.transactionsSet.removeAll();
        self.transactionsSet(res);
    };

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

    this.getCssClass = function (tr) {
        console.log(tr);
        return "test";
    };

    this.userLogin = function () {
        var user = self.user;
        ServerApi.loginUser({user: user.login(), password: user.password()}, function (r) {
            user.token(r.token);
            location.hash = "observe";
        })
    };

    this.user.token.subscribe(function (val) {
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
                ServerApi.getAccountSum({account_id: accIds.join(',')}, function (r) {
                    $.each(r, function (k, rObj) {
                        self.accountsHash[rObj.account_id].sum(parseFloat(rObj.sum));
                    });
                    $.each(self.accounts(), function (k, acc) {
                        acc.initChildren(self);
                    });
                });
                ServerApi.getTransactionList({}, function (r) {
                    self.transactions.removeAll();
                    self.transactions.pushAll(r);
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
        var token = getCookie(ApplicationSettings.cookieName);

        this.get('#:action', function () {
            var sammy = this;
            if (!self.user.token() && !token) {
                location.hash = "login";
                self.action("login");
            } else if (!self.user.token() && token) {
                self.user.remember(false);
                self.user.token(token);
                self.user.getLoginFromServer();
                self.action(this.params.action);
            } else {
                self.action(this.params.action);
            }
        });

        this.get('#:action/:itemId', function () {

        });
        this.get('', function () {
            var sammy = this;
            console.log("token", token);
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