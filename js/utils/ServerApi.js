var ServerApi = {
    options: {
        dev: false,
        lang: "ru",
        token: "",
        serverUrl: {
            dev: "http://dev.vsemoe.com",
            production: "https://api.vsemoe.com"
        }
    },
    utils: function () {
        var opt = this.options,
            getCurrentUrl = function () {
                return opt.dev ? opt.serverUrl.dev : opt.serverUrl.production;
            };
        return {
            makeObj: function (namesStr, paramArr) {
                var nameArr = namesStr.split(', ');
                if (nameArr.length >= paramArr.length) {
                    return false;
                }
                var res = {};
                for (var i = 0, j = nameArr.length; i < j; i += 1) {
                    if (paramArr[i])res[nameArr[i]] = paramArr[i];
                }
                return res;
            },
            post: function (url, data, callback, doNotShowError) {
                data.lang = data.lang || opt.lang;
                if(!data.token && !!opt.token){
                    data.token = opt.token;
                }
                $.ajax({
                    url: getCurrentUrl() + url,
                    type: 'POST',
                    dataType: 'JSONP',
                    data: data,
                    success: function(r){
                        console.log(r);
                        if(r.status == 1){
                            callback && callback(r.data || r.text);
                        }else{
                            callback && callback(false);
                            console.info(r);
                            if(!doNotShowError){
                                $.gritter.add({
                                    title : 'Ошибка ',
                                    text : r.text,
                                    time: 1500
                                });
                            }
                        }
                    }
                });
            }
        }
    },

    setLang: function (lang) {
        this.options.lang = lang + "";
    },
    getLang: function () {
        return this.options.lang;
    },
//User
    loginUser: function (dataObj, callback) {
        this.utils().post("/user/login", dataObj, callback);
    },
    existUser: function (dataObj, callback) {
        this.utils().post("/user/exist/", dataObj, callback);
    },
    createUser: function (dataObj, callback) {
        this.utils().post("/user/create", dataObj, callback);
    },
    confirmUser: function (token, callback) {
        this.utils().post("/user/confirm", { token: token}, callback);
    },
    logoutUser: function (dataObj, callback) {
        this.utils().post("/user/logout", dataObj, callback);
    },
    changepasswordUser: function (dataObj, callback) {
        //TODO: what about token ?
        this.utils().post("/user/logout", dataObj, callback);
    },
    restorepasswordUser: function (dataObj, callback) {
        this.utils().post("/user/changepasswordtoken", dataObj, callback);
    },
    lostpasswordUser: function (dataObj, callback) {
        this.utils().post("/user/lostpassword", dataObj, callback);
    },
    changepasswordemailUser: function (dataObj, callback) {
        this.utils().post("/user/changepasswordemail", dataObj, callback);
    },
//Token
    checkToken: function (dataObj, callback) {
        this.utils().post("/token/check", dataObj, function(r){
            callback(!(r === false));
        });
    },
    getUserByToken: function (dataObj, callback) {
        this.utils().post("/token/getuser", dataObj, callback);
    },
//Currency
    createCurrency: function (token, shortname, callback) {
        var data = this.utils().makeObj("token, shortname", arguments);
        this.utils().post("/currency/create", data, callback);
    },
    getCurrencyList: function (dataObj, callback) {
        this.utils().post("/currency/list", dataObj, callback);
    },
    updateCurrencyName: function (token, currency_id, value, callback) {
        var data = this.utils().makeObj("token, currency_id, value", arguments);
        this.utils().post("/currency/update/shortname", data, callback);
    },
    deleteCurrency: function (token, currency_id, callback) {
        var data = this.utils().makeObj("token, currency_id", arguments);
        this.utils().post("/currency/delete", data, callback);
    },
    getCurrencyRate: function (dataObj, callback) {
        this.utils().post("/currency/rate", dataObj, callback);
    },
    getCurrencyRateDay: function (dataObj, callback) {
        this.utils().post("/rate/day", dataObj, callback, true);
    },
    getCurrencyRateList: function (dataObj, callback) {
        this.utils().post("/currency/ratelist", dataObj, callback, true);
    },
//Bank
    getBankList: function () {
    },
    createBank: function () {
    },
    updateBank: function () {
    },
    deleteBank: function () {
    },
//Accounts
    createAccount: function (dataObj, callback) {
        this.utils().post("/account/create", dataObj, callback);
    },
    updateAccount: function (param, dataObj, callback) {
        if(param){
            this.utils().post("/account/update/" + param, dataObj, callback);
        }else{
            this.utils().post("/account/update", dataObj, callback);
        }
    },
    deleteAccount: function (dataObj, callback) {
        this.utils().post("/account/delete", dataObj, callback);
    },
    getAccountList: function (dataObj, callback) {
        this.utils().post("/account/list", dataObj, callback);
    },
    getAccountSum: function (dataObj, callback) {
        this.utils().post("/account/sum", dataObj, callback);
    },
    newAccountsSet: function(callback){
        this.utils().post("/account/newset", {}, callback);
    },
//Transactions
    createTransaction: function (dataObj, callback) {
        this.utils().post("/transaction/create", dataObj, callback);
    },
    updateTransaction: function (param, dataObj, callback) {
        if(param){
            this.utils().post("/transaction/update/" + param, dataObj, callback);
        }else{
            this.utils().post("/transaction/update", dataObj, callback);
        }
    },
    deleteTransaction: function (dataObj, callback) {
        this.utils().post("/transaction/delete", dataObj, callback);
    },
    getTransactionList: function (dataObj, callback) {
        this.utils().post("/transaction/list", dataObj, callback);
    },
//Application Settings
    getSettingsList: function (dataObj, callback) {
        this.utils().post("/settings/list", dataObj, callback);
    },
    checkAutoLogin: function(token, callback){
        this.utils().post("/settings/list", {token: token, option: "user_login_auto"}, function(r){
            callback(!!r.user_login_auto);
        });
    },
    createSetting: function (dataObj, callback) {
        this.utils().post("/settings/set", dataObj, callback);
    },
    updateSetting: function (dataObj, callback) {
        this.utils().post("/settings/set", dataObj, callback);
    }
};
