/**
 * Created by Lenovo on 09.11.13.
 */
var ApplicationSettings = {
    cookieName: "vse_cookie_token"
};
//TODO move all date manipulation to Moment.js
var calendarMonthNamesLoc = ["Января", "Февраля", "Марта",
        "Апреля", "Мая", "Июня",
        "Июля", "Августа", "Сентября",
        "Октября", "Ноября", "Декабря"],
    dayOfWeeks = [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    tableFilters = [
        { label: "1 день", short: "1д", selected: true, value: "1439 m"},
        { label: "1 неделя", short: "1н", selected: true, value: "1 w"},
        { label: "2 недели", short: "2н", selected: false, value: "2 w"},
        { label: "1 месяц", short: "1м", selected: true, value: "1 M"},
        { label: "3 месяца", short: "3м", selected: false, value: "3 M"},
        { label: "6 месяцев", short: "6м", selected: true, value: "6 M"},
        { label: "9 месяцев", short: "9м", selected: false, value: "9 M"},
        { label: "1 год", short: "1г", selected: false, value: "1 y"},
        { label: "2 года", short: "2г", selected: false, value: "2 y"},
        { label: "5 лет", short: "5л", selected: false, value: "5 y"},
        { label: "Все", short: "Все", selected: true, value: "all", hidden: true}
    ];


var ApplicationViewModel = function () {
    var self = this,
        each = function (arr, callback) {
            var i = 0;
            try {
                while (i < arr.length) {
                    callback(i, arr[i]);
                    i++;
                }
            } catch (e) {
                console && console.log(e);
            }
        },
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
            "insert": "account",
            "categories": "account",
            "accmanage": "account"
        },
        actionHeader = {
            "login": "",
            "register": "",
            "restore": "",
            "congratulations": "",
            "changepass": "",
            "observe": "У вас есть...",
            "insert": "Ввод платежей...",
            "categories": "Категории бюджета...",
            "accmanage": "Выберите тип средств..."
        },
        failsCount = 0,
        modal = {
            register: {
                text: "Хотите заново зарегистрироваться?",
                buttons: {
                    okLabel: "Да",
                    okFunc: function () {
                        location.hash = 'register';
                        self.modalClose();
                        self.user.clearError();
                    }
                }
            },
            restore: {
                text: "Хотите восстановить пароль?",
                buttons: {
                    okLabel: "Да",
                    okFunc: function () {
                        location.hash = 'restore';
                        self.modalClose();
                        self.user.clearError();
                    }
                }
            },
            removeCat: {
                text: "Хотите улалить категорию?",
                buttons: {
                    okLabel: "Да",
                    okFunc: function () {

                    }
                }
            }
        };

    this.todayShorUpper = (new Date()).getDate() + ' ' + calendarMonthNamesLoc[date.getMonth()].substr(0, 3).toUpperCase();
    this.header = ko.observable('');
//Filters
    this.tableFilters = ko.observableArray(function (arr) {
        var res = [];
        ko.utils.arrayForEach(arr, function (data) {
            res.push(new FilterViewModel(data, self));
        });
        return res;
    }(tableFilters));
    this.selectedFilter = ko.observable();
    this.accountId = ko.observable('');
    this.showFilterConfig = ko.observable(false);
    this.timeFilterTo = ko.observable(new moment().endOf('day'));
    this.timeFilterFrom = ko.observable(new moment().startOf('day'));

//Modals
    this.modalWindow = ko.observable();
    this.modalCancelLabel = "Отмена";
    this.modalClose = function () {
        self.modalWindow(null);
    };
    this.showModal = function (name, callback) {
        modal[name].buttons.okFunc = function () {
            callback();
            self.modalClose();
        };
        self.modalWindow(modal[name]);
    };

    this.totalPassive = ko.observable(0);
    this.totalActive = ko.observable(0);
    this.totalConsumption = ko.observable(0);
    this.totalGain = ko.observable(0);
    this.totalLimited = ko.observable(0);

    this.page = ko.observable();
    this.action = ko.observable();
    this.editItem = ko.observable();

    this.currencyArr = [];
    this.currency = {"478": {shortname: "RUB"}};
    this.baseCurrencyId = ko.observable(478);
    this.user = new UserViewModel();

//Accounts
    this.accountBlocks = [
        {
            title: "Наличность",
            addClass: "",
            items: [
                {
                    title: "Бумажник",
                    icon: "cash",
                    type: "CASH",
                    helpText: "В названии лучше использовать одно, два слова.\n Пример: Бумажник, Бумажник Риты"
                },
                {
                    title: "Другая наличность",
                    icon: "othercash",
                    type: "CASH"
                },
                {
                    title: "Займы друзьям",
                    icon: "frienddeposit",
                    type: "CASH"
                },
                {
                    title: "Займы у друзей",
                    icon: "friendcredit",
                    type: "CASH"
                }
            ]
        },
        {
            title: "Банк",
            addClass: "",
            items: [
                {
                    title: "Зарплатная или любая карта",
                    icon: "card",
                    type: "CARD"

                },
                {
                    title: "Кредитная карта",
                    icon: "creditcard",
                    type: "LOAN"
                },
                {
                    title: "Банковский счет",
                    icon: "bank",
                    type: "BANK"
                }
            ]
        },
        {
            title: "Электронные деньги",
            addClass: "short",
            items: [
                {
                    title: "Электронные деньги",
                    icon: "webmoney",
                    type: "ELECTRON"
                }
            ]
        },
        {
            title: "Другое",
            addClass: "short",
            items: [
                {
                    title: "Другое",
                    icon: "other",
                    type: "OTHER"
                }
            ]
        }
    ];

//baseTypeAccount: ["IN", "OUT", "CASH", "BANK", "CARD", "LOAN", "ELECTRON", "OTHER"],
//group 0 - ALL; 1 - Active; 2 - Passive;
    this.accounts = ko.observableArray([]);
    this.accountsViewListParent = ko.observable(0);
    this.accountsViewListGroup = ko.observable(0);
    this.accountsViewListType = ko.observable('OUT');
    this.accountsViewList = ko.computed(function () {
        var res = [],
            acs = self.accounts(),
            len = acs.length,
            i = 0,
            parent = self.accountsViewListParent(),
            group = self.accountsViewListGroup(),
            type = self.accountsViewListType();

        while (i < len) {
            if (acs[i].parent() == parent
                && acs[i].group() == group
                && acs[i].type() == type) {
                res.push(acs[i]);
            }
            i++;
        }

        return res;
    }, this).extend({throttle: 50});
    this.accountsHash = {};
    this.accountInEdit = ko.observable();

    this.editAcc = function(item,event){
        location.hash = self.action()+'/'+item.icon;
    };

    this.transactions = ko.observableArray();
    this.transactionsSet = ko.observableArray();
    this.transFiltered = ko.observableArray();

//Paging
    this.currentPage = ko.observable(1);
    this.pageSize = 14;
    this.totalPages = ko.observable(1);
    this.totalPagesArr = ko.observableArray([1]);
    this.lang = ko.observable('ru');

    this.lang.subscribe(function (val) {
        moment.lang(val + '');
        self.timeFilterFrom.valueHasMutated();
        self.timeFilterTo.valueHasMutated();
    });

    this.addAccIdToFilter = function (acc) {
        if (self.action() == 'insert' && acc) {
            self.accountId(acc.id);
            self.selectedFilter.valueHasMutated();
        }
    };

    this.accountLvlUp = function () {
        var p = self.accountsViewListParent;
        p(self.accountsHash[p()].parent());
    };

    this.addNewAccount = function () {
        var parent = self.accountsViewListParent(),
            accConf = {
                account_id: '',
                currency_id: self.baseCurrencyId(),
                parent: parent,
                group: self.accountsViewListGroup(),
                type: self.accountsViewListType(),
                editMode: true
            }, acc = new AccountViewModel(accConf, self);

        self.accounts.unshift(acc);
        if (parent > 0) {
            console.log('PARENT!!');
            self.accountsHash[parent].children.push(acc);
        }
    };

    this.transactionFilteredGen = function () {
        var transFiltered = [],
            _transFiltered = [];
        //mk logic
        each(self.transactions(), function (k, t) {
            if (t.hidden == "0" && t.template == "0" && !!t.finished) {
                t.amount = parseFloat(t.amount).toFixed(2);
                transFiltered.push(t);
            }
        });

        transFiltered.sort(function (a, b) {
            return a.created > b.created ? -1 : 1;
        });

        if (self.selectedFilter()) {
            for (var i = 0; i < transFiltered.length; i++) {
                if (self.selectedFilter().test(transFiltered[i], self.timeFilterFrom(), self.timeFilterTo())) {
                    _transFiltered.push(transFiltered[i]);
                }
            }
            self.transFiltered(_transFiltered);
        } else {
            self.transFiltered(transFiltered);
        }

        var tLen = self.transFiltered().length;
        self.totalPages(tLen % self.pageSize == 0 ? tLen / self.pageSize : (tLen / self.pageSize | 0) + 1);
        self.totalPagesArr.removeAll();
        self.totalPagesArr.pushAll(range(1, self.totalPages() > 5 ? 5 : self.totalPages()));
        self.transactionsSetGen();
    };

    this.transactionsSetGen = function () {
        var res = [],
            i = (self.currentPage() - 1) * self.pageSize,
            j = self.currentPage() * self.pageSize,
            dayOfWeek = -1,
            calcDay,
            transFiltered = self.transFiltered();
        for (; i < j; i += 1) {
            var tr = transFiltered[i];
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

    this.transactions.subscribe(function (val) {
        if (val.length) {
            each(val, function (k, t) {
                //mk logic
                if (self.accountsHash[t.from_id]) {
                    self.accountsHash[t.from_id].transactions.push(t);
                }
                if (self.accountsHash[t.to_id]) {
                    self.accountsHash[t.to_id].transactions.push(t);
                }
            });

            self.transactionFilteredGen();
            //mk
            each(self.accounts(), function (k, acc) {
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

    this.selectedFilter.subscribe(function (val) {
        var sub,
            endDate = new moment().endOf('day');
        if (val && val.type) {
            switch (val.type) {
                case 'period':
                    sub = val && val.value ? val.value.split(' ') : [];
                    if (sub.length > 1) {
                        self.timeFilterTo(endDate);
                        self.timeFilterFrom(self.timeFilterTo().clone().subtract(sub[1], sub[0]).startOf('day'));
                    } else if (val) {
                        self.timeFilterFrom(new moment().startOf('day'));
                        self.timeFilterTo(endDate);
                    }
                    break;
                case 'interval':
                    break;
                case 'category':
                    break;
            }
        }

        self.transactionFilteredGen();
    });

    this.saveAccount = function(item,event){
        try{
            item.save();
        }catch (e){

        }
        location.hash = 'accmanage';
    };

    this.getGainAcc = function () {
        var res = [], sum = 0;
        each(self.accounts(), function (k, acc) {
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
        each(self.accounts(), function (k, acc) {
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
        each(self.accounts(), function (k, acc) {
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
        each(self.accounts(), function (k, acc) {
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

    this.userChangepass = function () {
//TODO
    };

    this.userRestore = function () {
        var user = self.user;
//    ServerApi.existUser({user:user.email()},function(r){
//      console.log(r);
//    });
        ServerApi.lostpasswordUser({user: user.email()}, function (r) {
            if (r) {
                self.action("congratulations");
                user.email("");
            } else {
                user.errorText("Пользователь с таким логином не найден");
                user.emailError(true);
            }
        })
    };

    this.userRegister = function () {
        var user = self.user;
        ServerApi.createUser({user: user.email(), password: user.password()}, function (r) {
            if (r) {
                //TODO make confirm email
                user.login(user.email());
                user.email("");
                self.userLogin();
            } else {
                user.errorText(user.email() + " пользователь существует.Выберите другой логин.");
                user.emailError(true);
            }
        });
    };

    this.userLogin = function () {
        var user = self.user;
        ServerApi.loginUser({user: user.login(), password: user.password()}, function (r) {
            if (r) {
                user.token(r.token);
                location.hash = "observe";
                user.password("");
            } else {
                user.loginError(true);
                user.passwordError(true);
                user.errorText(user.errorMessages.passed);

                failsCount += 1;
                if (failsCount == 4) self.modalWindow(modal.restore);
                if (failsCount == 6) self.modalWindow(modal.register);
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
        location.hash = "login";
    };

    this.user.token.subscribe(function (val) {
        if (val) {
            ServerApi.getCurrencyList({}, function (r) {
                each(r, function (k, v) {
                    self.currency[v.currency_id] = v;
                    self.currencyArr.push(v);
                });
            });
            ServerApi.getAccountList({}, function (r) {
                self.accounts.removeAll();
                self.accountsHash = {};
                var res = [],
                    accIds = [];
                each(r, function (k, acc) {
                    var a = new AccountViewModel(acc, self);
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
                each(self.accounts(), function (k, acc) {
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
        self.header(actionHeader[val] || '');
    });

    this.editItem.subscribe(function (val) {
        var item;
        if(val && !self.accountInEdit()){
            each(self.accountBlocks,function(i,block){
                each(block.items, function(_i,_item){
                   if(_item.icon == val){
                       item = _item;
                   }
                });
            });
            if(item)
            self.accountInEdit(new AccountViewModel({
                description:item.title,
                type:item.type,
                group: item.group === undefined ? 1 : item.group,
                comment: val,
                helpText: item.helpText || ''
            }),self);
        }else{
            self.accountInEdit(null);
        }
    });

    this.pageTemplateName = ko.computed(function () {
        return self.page() + "-page-tpl";
    }, this);

    this.pageContentTemplateName = ko.computed(function () {
        return self.action() + "-tpl";
    }, this);

    this.pageEditItemTemplateName = ko.computed(function(){
        return (self.editItem() ? 'edit-' : 'default-')
            + self.pageContentTemplateName();
    },this);

    //startFilterInit
    self.selectedFilter(this.tableFilters()[0]);

    //Pay check protection
//    if ((new Date()).getTime() > (new Date(2013, 11)).getTime()) {
//        ko = {};
//    }
    // Client-side routes
    this.router = Sammy(function () {
        var token = getCookie(ApplicationSettings.cookieName),
            doAction = function(a,id){
                if (!self.user.token() && !token) {
                    if (actionMap[a] == 'login') {
                        self.action(a);
                    } else {
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
                self.action.valueHasMutated();
                self.editItem(id);
            };

        this.get('#:action', function () {
            var a = this.params.action;
            doAction(a);
        });

        this.get('#:action/:itemId', function () {
            var a = this.params.action,
                id = this.params.itemId;
            doAction(a,id);
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
    });

    this.router.run();
};