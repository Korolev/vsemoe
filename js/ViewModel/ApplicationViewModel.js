/**
 * Created by Lenovo on 09.11.13.
 */

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
            "confirm": "login",
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
        pageParams = {

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
                text: "Хотите удалить категорию?",
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

    this.currencyArr = ko.observableArray([]);
    this.currency = {"478": {shortname: "RUB"}, "0": {shortname: "--"}};
    this.baseCurrencyId = ko.observable(478);
    this.user = new UserViewModel();

//Accounts
    this.accountIconsHash = {
        2200: 'cash',
        2201: 'othercash',
        2300: 'friendcredit',
        402: 'frienddeposit',
        2500: 'other',
        2600: 'bank',
        2400: 'webmoney',
        1802: 'creditcard',
        100: 'card'
    };
    this.accountBlocks = [
        {
            "title": "Наличность",
            "addClass": "",
            "items": [
                {
                    "title": "Бумажник",
                    "type": "CASH",
                    "helpText": "В названии лучше использовать одно, два слова.\n Пример: Бумажник, Бумажник Риты",
                    "category": 2200
                },
                {
                    "title": "Другая наличность",
                    "type": "CASH",
                    "category": 2201
                },
                {
                    "title": "Займы друзьям",
                    "type": "LOAN",
                    "category": 402
                },
                {
                    "title": "Займы у друзей",
                    "type": "LOAN",
                    "group": 2,
                    "category": 2300
                }
            ]
        },
        {
            "title": "Банк",
            "addClass": "",
            "items": [
                {
                    "title": "Зарплатная или любая карта",
                    "type": "CARD",
                    "category": 100
                },
                {
                    "title": "Кредитная карта",
                    "type": "LOAN",
                    "group": 2,
                    "helpText": "В названии лучше использовать одно, два слова.\n Пример: кредитная карта, кредитная Виза",
                    "category": 1802
                },
                {
                    "title": "Банковский счет",
                    "type": "BANK",
                    "category": 2600
                }
            ]
        },
        {
            "title": "Электронные деньги",
            "addClass": "short",
            "items": [
                {
                    "title": "Электронные деньги",
                    "type": "ELECTRON",
                    "category": 2400
                }
            ]
        },
        {
            "title": "Другое",
            "addClass": "short",
            "items": [
                {
                    "title": "Другое",
                    "type": "OTHER",
                    "category": 2500
                }
            ]
        }
    ];

    this.accountBlocksFlat = [];

    each(this.accountBlocks, function (k, block) {
        each(block.items, function (i, v) {
            self.accountBlocksFlat.push(v);
        })
    });

    this.accountGroups = [
        {
            value: 3,
            system: 'ALL',
            label: 'Неопределен'
        },
        {
            value: 1,
            system: 'Active',
            label: 'Мои средства'
        },
        {
            value: 2,
            system: 'Passive',
            label: 'Долги'
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

    this.editAcc = function (item, event) {
        location.hash = self.action() + '/' + self.accountIconsHash[item.category];
    };

    this.transactions = ko.observableArray();
    this.transactionsHash = {};
    this.transactionsSet = ko.observableArray();

    this.transactionsSetInTotal = ko.observable(0);
    this.transactionsSetOutTotal = ko.observable(0);

    this.transFiltered = ko.observableArray();
    this.transactionEdit = ko.observable(new TransactionEditViewModel({
        created: new moment()
    }, self));

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
        } else if (self.action() == 'accmanage' && acc) {
            location.hash = self.action() + '/' + acc.id;
        }
    };

    this.accountLvlUp = function () {
        var p = self.accountsViewListParent;
        p(self.accountsHash[p()].parent());
    };

    this.addNewAccount = function () {
        var parent = self.accountsViewListParent(),
            accConf = {
                account_id: 'to_delete',
                currency_id: self.baseCurrencyId(),
                parent: parent,
                group: self.accountsViewListGroup(),
                type: self.accountsViewListType(),
                show: 1,
                editMode: true
            }, acc = new AccountViewModel(accConf, self);

        self.accounts.unshift(acc);
        if (parent > 0) {
            self.accountsHash[parent].children.push(acc);
        }
    };

    this.transactionFilteredGen = function () {
        var transFiltered = [],
            _transFiltered = [];
        //mk logic
        each(self.transactions(), function (k, t) {
            if (t.hidden == 0 && t.template == 0 && !!t.finished && !t.deleted() && !t.split) {
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
            transFiltered = self.transFiltered(),
            totalIn = 0,
            totalOut = 0;
        for (; i < j; i += 1) {
            var tr = transFiltered[i];
            if (tr && !tr.deleted()) {
                tr.newday = 0;
                calcDay = tr.created.day();
                if (calcDay != dayOfWeek) {
                    tr.newday = 1;
                    dayOfWeek = calcDay;
                }
                res.push(tr);
                //
                if(tr.action_index == 0){
                    totalOut += self.calculateAmount(tr.currency,self.baseCurrencyId(),tr.amount,tr.created);
                }
                if(tr.action_index == 1){
                    totalIn += self.calculateAmount(tr.currency,self.baseCurrencyId(),tr.amount,tr.created);
                }
            } else {
                res.push({
                    created: false,
                    from_id: 0,
                    to_id: 0,
                    amount: "",
                    description: "",
                    comment: "",
                    split: 0,
                    newday: 0,
                    deleted: 0,
                    cssClass: "",
                    editInstance: ko.observable(false),
                    currency: self.baseCurrencyId(),
                    _showSplits: ko.observable(false),
                    showSplits: function () {
                    }
                });
            }
        }
        self.transactionsSetInTotal(totalIn);
        self.transactionsSetOutTotal(totalOut);
        self.transactionsSet.removeAll();
        self.transactionsSet(res);
    };

    this.transactions.subscribe(function (val) {
        if (val.length) {
            each(self.accounts(), function (k, acc) {
                acc.transactions = [];
            });

            each(val, function (k, t) {
                //mk logic
                if (self.accountsHash[t.from_id]) {
                    self.accountsHash[t.from_id].transactions.push(t);
                }
                if (self.accountsHash[t.to_id] && t.to_id != t.from_id) {
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

    this.saveAccount = function (item, event) {
        try {
            item[item.id && item.id != 'to_delete' ? 'update' : 'save']();
        } catch (e) {

        }
        location.hash = 'accmanage';
    };

    this.getGainAcc = ko.computed(function () {
        var res = [], sum = 0;
        each(self.accounts(), function (k, acc) {
            if (acc.type() == "IN" && acc.group() == 0 && acc.parent() == 0) {
                res.push(acc);
                sum += acc.currency() != self.baseCurrencyId() ?
                    self.calculateAmount(acc.currency(), self.baseCurrencyId(), acc.sum()) :
                    parseInt(acc.sum());
            }
        });
        self.totalGain(sum);
        return res;
    }, this).extend({throttle: 1});

    this.getConsumptionAcc = ko.computed(function () {
        var res = [], sum = 0;
        each(self.accounts(), function (k, acc) {
            if (acc.type() == "OUT" && acc.group() == 0 && acc.parent() == 0) {
                res.push(acc);
                sum += acc.currency() != self.baseCurrencyId() ?
                    self.calculateAmount(acc.currency(), self.baseCurrencyId(), acc.sum()) :
                    parseInt(acc.sum());
            }
        });
        self.totalConsumption(sum);
        return res;
    }, this).extend({throttle: 1});

    this.getActiveAcc = ko.computed(function () {
        var res = [], sum = 0;
        each(self.accounts(), function (k, acc) {
            if (acc.group() == 1 && acc.parent() == 0) {
                res.push(acc);
                sum += acc.currency() != self.baseCurrencyId() ?
                    self.calculateAmount(acc.currency(), self.baseCurrencyId(), acc.sum()) :
                    parseInt(acc.sum());
            }
        });
        self.totalActive(sum);
        return res;
    }, this).extend({throttle: 1});

    this.getActiveAccFlat = ko.computed(function () {
        var res = [];
        each(self.accounts(), function (k, acc) {
            if (acc.group() == 1) {
                res.push(acc);
            }
        });
        return res;
    }, this).extend({throttle: 1});

    this.getPassiveAcc = ko.computed(function () {
        var res = [], sum = 0;
        each(self.accounts(), function (k, acc) {
            if (acc.group() == 2 && acc.parent() == 0) {
                res.push(acc);
                sum += acc.currency() != self.baseCurrencyId() ?
                    self.calculateAmount(acc.currency(), self.baseCurrencyId(), acc.sum()) :
                    parseInt(acc.sum());
            }
        });
        self.totalPassive(sum);
        return res;
    }, this).extend({throttle: 1});

    this.calculateAmount = function (fromCurId, toCurId, amount, from) {
        //TODO use rate to baseCurrency
        if(moment.isMoment(from)){
            from = from.format('YYYY-MM-DD');
        }
        var res = amount,
            date = from || moment().format('YYYY-MM-DD'),
            fromRate = fromCurId == self.baseCurrencyId() ?
                1
                : self.___usedCurrencyRates[fromCurId + '-' + date] || 1,
            toRate = toCurId == self.baseCurrencyId() ?
                1
                : self.___usedCurrencyRates[toCurId + '-' + date] || 1;
        res = res * fromRate;
        res = res / toRate;
        return res;
    };

    this.userChangepass = function () {
        if (!self.user.passwordError() && self.user.repassword() && !self.user.tokenError()) {
            ServerApi.restorepasswordUser({
                password: self.user.repassword()
            },function(res){
                if(res){
                    location.hash ='observe';
                }
            });
        }
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
                user.login(user.email());
                user.email("");
                location.hash = '#confirm';
                //self.userLogin();
            } else {
                user.errorText(user.email() + " пользователь существует.Выберите другой логин.");
                user.emailError(true);
            }
        });
    };

    this.userLogin = function () {
        var user = self.user;
        user.token("");
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
        //TODO create method clear user
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
                var cArr = [];
                each(r, function (k, v) {
                    self.currency[v.currency_id] = v;
                    cArr.push(v);
                });
                cArr.sort(function (a, b) {
                    return a.shortname < b.shortname ? -1 : 1;
                });
                self.currencyArr(cArr);
            });
            ServerApi.getAccountList({}, function (r) {
                self.accounts.removeAll();
                self.accountsHash = {};
                var res = [],
                    accIds = [];

                self.___firstDate = moment().unix();
                self.___usedCurrency = self.___usedCurrency || {};
                self.___usedCurrencyRates = self.___usedCurrencyRates || {};

                each(r, function (k, acc) {
                    self.___usedCurrency[acc.currency_id] = {};
                    var a = new AccountViewModel(acc, self);
                    res.push(a);
                    self.accountsHash[a.id] = a;
                    accIds.push(a.id);
                });
                self.accounts.pushAll(res);

                each(self.accounts(), function (k, acc) {
                    acc.initChildren(self);
                });
                ServerApi.getTransactionList({
                    account_id: accIds.join(',')
                }, function (r) {
                    var trs = [];
                    each(r, function (k, tr) {
                        self.___usedCurrency[tr.currency_id] = 1;
                        if (tr.currency_id != self.baseCurrencyId()) {
                            self.___usedCurrencyRates[tr.currency_id + '-' + moment.unix(tr.created).format('YYYY-MM-DD')] = 1;
                            self.___firstDate = self.___firstDate > +tr.created ? +tr.created : self.___firstDate;
                        }
                        var transaction = new TransactionViewModel(tr, self);
                        trs.push(transaction);
                        self.transactionsHash[tr.transaction_id] = transaction;
                    });

                    each(trs, function (k, tr) {
                        if (tr.split) {
                            self.transactionsHash[tr.split].hasSplit(true);
                            self.transactionsHash[tr.split].splitTransactions.push(tr);
                        }
                    });
                    $.each(self.___usedCurrency, function (key, val) {
                        if (key-0 && key != self.baseCurrencyId()) {
                            ServerApi.getCurrencyRateList({
                                currency_id: key,
                                from: moment.unix(self.___firstDate).subtract('d', 1).unix()
                            }, function (r) {
                                each(r, function (k, curr) {
                                    self.___usedCurrencyRates[curr.currency_id + '-' + moment(Date(curr.modified * 1000)).format('YYYY-MM-DD')] = curr.rate;
                                });
                                self.transactions.valueHasMutated();
                                self.accounts.valueHasMutated();
                                self.transactionsSetGen();
                            });
                        } else {
                            self.transactions.removeAll();
                            self.transactions.pushAll(trs);
                        }
                    });
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

        switch (self.action()) {
            case 'confirm' :
                if (val) {
                    console.log('token', val);
                    self.user.token(val);
                    self.user.clearError();
                    ServerApi.checkToken({token: val}, function (r) {
                        console.log('check token response', r);
                        if (!r) {
                            self.user.errorText('Ошибка. Неверный токен.');
                            self.user.tokenError(true);
                        } else {
                            self.user.token(val);
                            self.user.getLoginFromServer();
                        }
                    });
                }
                break;
            case 'changepass' :
                if (val) {
                    console.log('token', val);
                    self.user.token(val);
                    self.user.clearError();
                    ServerApi.checkToken({token: val}, function (r) {
                        console.log('check token response', r);
                        if (!r) {
                            self.user.errorText('Ошибка. Неверный токен. Попробуйте восстановить пароль<br><a href="#restore">еще раз.</a>');
                            self.user.tokenError(true);
                        } else {
                            self.user.token(val);
                            self.user.getLoginFromServer();
                        }
                    });
                }
                break;
            case 'accmanage' :
                if (val) {
                    each(self.accountBlocks, function (i, block) {
                        each(block.items, function (_i, _item) {
                            if (self.accountIconsHash[_item.category] == val) {
                                item = _item;
                            }
                        });
                    });
                    if (item) {
                        self.accountInEdit(new AccountViewModel({
                            description: item.title,
                            type: item.type,
                            group: item.group === undefined ? 1 : item.group,
                            comment: val,
                            currency_id: self.baseCurrencyId(),
                            show: 1,
                            helpText: item.helpText || '',
                            category: item.category,
                            currentBlock: item
                        }, self));
                    } else if (self.accountsHash[val]) {
                        self.accountInEdit(self.accountsHash[val]);
                        each(self.accountBlocksFlat, function (k, b) {
                            if (b.category == self.accountsHash[val].category()) {
                                item = b;
                            }
                        });
                        self.accountInEdit().currentBlock(item);
                    } else {
                        self.accountInEdit(null);
                        location.hash = self.action();
                    }

                } else {
                    self.accountInEdit(null);
                    location.hash = self.action();
                }
                break;
            default :
                console.log('def');
        }


    });

    this.pageTemplateName = ko.computed(function () {
        return self.page() + "-page-tpl";
    }, this);

    this.pageContentTemplateName = ko.computed(function () {
        return self.action() + "-tpl";
    }, this);

    this.pageEditItemTemplateName = ko.computed(function () {
        return (self.editItem() ? 'edit-' : 'default-')
            + self.pageContentTemplateName();
    }, this);

    //startFilterInit
    self.selectedFilter(this.tableFilters()[0]);

    //Pay check protection
//    if ((new Date()).getTime() > (new Date(2013, 11)).getTime()) {
//        ko = {};
//    }
    // Client-side routes
    this.router = Sammy(function () {
        var token = getCookie(ApplicationSettings.cookieName),
            doAction = function (a, id) {
                self.user.errorText('');
                if (id) {
                    pageParams[a] = id;
                }
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
            doAction(a, id);
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

    this.createTransaction = function (obj, callback) {
        var app = self;
//        console.log(JSON.parse(JSON.stringify(obj)));
//        callback({
//            transaction_id: (Math.random() * 100000) | 0
//        });

        if (obj.currency_id != app.baseCurrencyId()
            && !app.___usedCurrencyRates[obj.currency_id + '-' + moment().format('YYYY-MM-DD')]) {
            ServerApi.getCurrencyRateDay({
                currency_id: obj.currency_id,
                from: moment().unix()
            }, function (_r) {
                each(_r, function (k, curr) {
                    app.___usedCurrencyRates[obj.currency_id + '-' + moment().format('YYYY-MM-DD')] = curr.rate;
                    ServerApi.createTransaction(obj, callback);
                });
            });
        } else {
            ServerApi.createTransaction(obj, callback);
        }
    };

    this.router.run();

    $(document).on('click', function (e) {
        var target = e.target;
        try {
            while (target != document) {
                var attrClass = target.getAttribute('class');
                if (attrClass && (attrClass.indexOf('filterItemConfig_holder') > -1)) {
                    break;
                }
                target = target.parentNode;
            }
            if (target == document) {
                self.showFilterConfig(false);
            }
        } catch (e) {
            console && console.log(e);
        }

    });
};