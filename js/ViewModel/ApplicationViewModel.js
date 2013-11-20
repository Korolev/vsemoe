/**
 * Created by Lenovo on 09.11.13.
 */
var ApplicationSettings = {
    cookieName: "vse_cookie_token"
};

var calendarMonthNamesLoc = ["Января", "Февраля", "Марта",
        "Апреля", "Мая", "Июня",
        "Июля", "Августа", "Сентября",
        "Октября", "Ноября", "Декабря"],
    dayOfWeeks = [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];


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
        range = function (from, to) {
            var arr = [];
            for (; from <= to; from += 1) {
                arr.push(from);
            }
            return arr;
        },
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

    this.currency = {"478":{shortname:"RUB"}};
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
    this.pageSize = 14;
    this.totalPages = ko.observable(1);
    this.totalPagesArr = ko.observableArray([1]);

    this.transactions.subscribe(function (val) {
        if (val.length) {
            self.transFiltered = [];
            $.each(val, function (k, t) {
              //mk logic
              if(self.accountsHash[t.from_id]){
                self.accountsHash[t.from_id].transactions.push(t);
              }
              if(self.accountsHash[t.to_id]){
                self.accountsHash[t.to_id].transactions.push(t);
              }
              //mk logic
                if (t.hidden == "0" && t.template == "0" && !!t.finished) {
                    t.amount = parseFloat(t.amount).toFixed(2);
                    self.transFiltered.push(t);
                }
            });
            self.transFiltered.sort(function (a, b) {
                return a.created > b.created ? -1 : 1;
            });
            var tLen = self.transFiltered.length,
                pagesNums = [];
            self.totalPages(tLen % self.pageSize == 0 ? tLen / self.pageSize : (tLen / self.pageSize | 0) + 1);
            self.totalPagesArr.removeAll();
            self.totalPagesArr.pushAll(range(1, self.totalPages() > 5 ? 5 : self.totalPages()));
            self.transactionsSetGen();
          //mk
          $.each(self.accounts(),function(k,acc){
            acc.recalculateSum(self);
          })
        }
    });

    this.currentPage.subscribe(function (val) {
        if (val > self.totalPages() || val < 1) {
            self.currentPage(1);
        } else {
            self.transactionsSetGen();
            if (val - 2 > 0 && (val + 2) <= self.totalPages()) {
                self.totalPagesArr(range(val - 2, val + 2));
            } else if (val < 5) {
                self.totalPagesArr(range(1, 5));
            } else {
                self.totalPagesArr(range(self.totalPages() - 4, self.totalPages()));
            }
        }
    });

    this.transactionsSetGen = function () {
        var res = [],
            i = (self.currentPage() - 1) * self.pageSize,
            j = self.currentPage() * self.pageSize,
            dayOfWeek = -1,
            calcDay;
        for (; i < j; i += 1) {
            var tr = self.transFiltered[i];
            if (tr) {
                tr.newday = 0;
                calcDay = (new Date(tr.created * 1000)).getDay();
                if (calcDay != dayOfWeek) {
                    tr.newday = 1;
                    dayOfWeek = calcDay;
                }
                res.push(tr);
            } else {
                res.push({created: false, from_id: 0, to_id: 0, amount: "", description: "", split: 0, newday: 0});
            }
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
//TODO calculate class
        var cssClass = ["transport_tr", "incoming_tr", "passive_tr"],
            from = self.accountsHash[tr.from_id],
            to = self.accountsHash[tr.to_id],
            res = 2;
        if (from && to && from.group() == to.group()) {
            res = 0;
        }
        if (from && to && from.group() == 1 && tr.amount > 0) {
            res = 1;
        }
        return cssClass[res];
    };

  this.userChangepass = function(){
//TODO
  };

  this.userRestore = function(){
    var user = self.user;
//    ServerApi.existUser({user:user.email()},function(r){
//      console.log(r);
//    });
    ServerApi.lostpasswordUser({user:user.email()},function(r){
      if(r){
        self.action("congratulations");
        user.email("");
      }else{
        user.errorText("Пользователь с таким логином не найден");
        user.emailError(true);
      }
    })
  };

  this.userRegister = function () {
    var user = self.user;
    ServerApi.createUser({user:user.email(),password:user.password()},function(r){
      if(r){
        //TODO make confirm email
        user.login(user.email());
        user.email("");
        self.userLogin();
      }else{
        user.errorText(user.email()+" пользователь существует.Выберите другой логин.");
        user.emailError(true);
      }
    });
  };

    this.userLogin = function () {
        var user = self.user;
        ServerApi.loginUser({user: user.login(), password: user.password()}, function (r) {
            console.log(r);
            if(r){
                user.token(r.token);
                location.hash = "observe";
                user.password("");
            }else{
                user.loginError(true);
                user.passwordError(true);
                user.errorText(user.errorMessages.passed);
            }

        })
    };
    this.userLogOut = function () {
        console.log("logout");
        var user = self.user;
        user.token("");
        user.email("");
        user.login("");
        user.password("");
        user.repassword("");
        setCookie(ApplicationSettings.cookieName, "", {expires: new Date(1999)});
        location.hash = "#login";
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
//                ServerApi.getAccountSum({account_id: accIds.join(',')}, function (r) {
//                    $.each(r, function (k, rObj) {
//                        self.accountsHash[rObj.account_id].sum(parseFloat(rObj.sum));
//                    });
//                    $.each(self.accounts(), function (k, acc) {
//                        acc.initChildren(self);
//                    });
//                });
                $.each(self.accounts(), function (k, acc) {
                    acc.initChildren(self);
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

    //Pay check protection
//    if ((new Date()).getTime() > (new Date(2013, 11)).getTime()) {
//        ko = {};
//    }
    // Client-side routes
    Sammy(function () {
        var token = getCookie(ApplicationSettings.cookieName);
        this.get('#:action', function () {
            var a = this.params.action;
            if (!self.user.token() && !token) {
                if(actionMap[a] == 'login'){
                    self.action(a);
                }else{
                    location.hash = "login";
                }
            } else if (!self.user.token() && token) {
                self.user.remember(false);
                self.user.token(token);
                self.user.getLoginFromServer();
                self.action(a);
            } else {
                self.action(a);
            }
        });

        this.get('#:action/:itemId', function () {

        });
        this.get('/account/', function () {
            var sammy = this;
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