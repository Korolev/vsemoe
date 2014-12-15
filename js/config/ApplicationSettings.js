/**
 * Created by mk-sfdev on 3/26/14.
 */
//TODO move all date manipulation to Moment.js
var calendarMonthNamesLoc = ["Января", "Февраля", "Марта",
        "Апреля", "Мая", "Июня",
        "Июля", "Августа", "Сентября",
        "Октября", "Ноября", "Декабря"],
    dayOfWeeks = [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    appSettings = {
        additionalCurrency:'used_currency',
        baseCurrencyId:'base_currency',
        appFilters:'app_filters',
        accountsPosition:'acc_positions'
    },
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
    ],
    default_conf = [{
        config_id: 1,
        name: 'used_currency',
        deleted: 0,
        value: ''
    },{
        config_id: 2,
        name: 'base_currency',
        deleted: 0,
        value: 478
    },{
        config_id: 3,
        name: 'app_filters',
        deleted: 0,
        value: {
            tableFilters : tableFilters
        }
    },{
        config_id: 4,
        name: 'acc_positions',
        deleted: 0,
        value: {}
    }];



var ApplicationSettings = {
    cookieName: "vse_cookie_token_",
    cookieRedirect: "vse_redirect_url"
};