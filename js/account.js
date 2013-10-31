var account = {
    tk: null,
    init: function (tk) {
        account.tk = tk;
        $("#existAccount").click(function () {
            $("#loginDiv").removeClass('hidden');
            $("#accountDiv").addClass('hidden');
            $.ajax({
                type: "POST",
                url: account.getUrl("/user/logout"),
                cache: false,
                dataType: 'JSONP',
                data: { token: tk },
                success: function () {
                }
            });
        });
        $("#topMenuBox1").click(function () {
            $("#topMenuBox2").removeClass('selected');
            $(this).addClass("selected");
            $("#box1").removeClass('hidden');
            $("#box2").addClass('hidden');
        });
        $("#topMenuBox2").click(function () {
            $("#topMenuBox1").removeClass('selected');
            $(this).addClass("selected");
            $("#box1").addClass('hidden');
            $("#box2").removeClass('hidden');
        });

        $("#transPaging .pagingsubmit").click(function () {
            var val = $("#transPaging input.selectPage").val();
            if (val > 0 && val <= account.countPagesPaging) {
                var trans = account.transactionsForVisual;
                var start = val * account.numbersRecordsForPaging;
                if (start < 0) start = 0;
                var end = start + account.numbersRecordsForPaging;
                if (end > trans.length) end = trans.length;
                for (var t = start; t < end; t++) {
                    if (t == start) account.visualTransaction(trans[t], true);
                    else account.visualTransaction(trans[t]);
                }
                account.visualPaging(val);
            }
        });

        $("#transPaging .paging").click(function () {
            var el = $(this);
            var cur = parseInt(el.parent().find(".paging[p=selected]").text());
            if (cur > 0) {
                var sel = el.attr('p');
                if (sel) {
                    var trans = account.transactionsForVisual;
                    switch (sel) {
                        case 'first':
                            if (cur != 1) {
                                for (var t = 0; t < account.numbersRecordsForPaging; t++) {
                                    if (t == 0) account.visualTransaction(trans[t], true);
                                    else account.visualTransaction(trans[t]);
                                }
                                account.visualPaging(1);
                            }
                            break;
                        case 'prev':
                            if (cur > 1) {
                                var start = (cur - 2) * account.numbersRecordsForPaging;
                                if (start < 0) start = 0;
                                var end = start + account.numbersRecordsForPaging;
                                for (var t = start; t < end; t++) {
                                    if (t == start) account.visualTransaction(trans[t], true);
                                    else account.visualTransaction(trans[t]);
                                }
                                account.visualPaging(cur - 1);
                            }
                            break;
                        case 'prev2':
                            if (cur >= 2) {
                                var start = (cur - 3) * account.numbersRecordsForPaging;
                                if (start < 0) start = 0;
                                var end = start + account.numbersRecordsForPaging;
                                for (var t = start; t < end; t++) {
                                    if (t == start) account.visualTransaction(trans[t], true);
                                    else account.visualTransaction(trans[t]);
                                }
                                account.visualPaging(cur - 2);
                            }
                            break;
                        case 'prev1':
                            if (cur > 1) {
                                var start = (cur - 2) * account.numbersRecordsForPaging;
                                if (start < 0) start = 0;
                                var end = start + account.numbersRecordsForPaging;
                                for (var t = start; t < end; t++) {
                                    if (t == start) account.visualTransaction(trans[t], true);
                                    else account.visualTransaction(trans[t]);
                                }
                                account.visualPaging(cur - 1);
                            }
                            break;
                        case 'selected':
                            break;
                        case 'next1':
                            if (cur < account.countPagesPaging) {
                                var start = cur * account.numbersRecordsForPaging;
                                // if (start > account.countPagesPaging) start = account.numbersRecordsForPaging;
                                var end = start + account.numbersRecordsForPaging;
                                for (var t = start; t < end; t++) {
                                    if (t == start) account.visualTransaction(trans[t], true);
                                    else account.visualTransaction(trans[t]);
                                }
                                account.visualPaging(cur + 1);
                            }
                            break;
                        case 'next2':
                            if (cur < account.countPagesPaging) {
                                var start = (cur + 1) * account.numbersRecordsForPaging;
                                // if (start > account.countPagesPaging) start = account.numbersRecordsForPaging;
                                var end = start + account.numbersRecordsForPaging;
                                for (var t = start; t < end; t++) {
                                    if (t == start) account.visualTransaction(trans[t], true);
                                    else account.visualTransaction(trans[t]);
                                }
                                account.visualPaging(cur + 2);
                            }
                            break;
                        case 'next':
                            if (cur < account.countPagesPaging) {
                                var start = cur * account.numbersRecordsForPaging;
                                // if (start > account.countPagesPaging) start = account.numbersRecordsForPaging;
                                var end = start + account.numbersRecordsForPaging;
                                for (var t = start; t < end; t++) {
                                    if (t == start) account.visualTransaction(trans[t], true);
                                    else account.visualTransaction(trans[t]);
                                }
                                account.visualPaging(cur + 1);
                            }
                            break;
                        case 'last':
                            var start = account.countPagesPaging - account.numbersRecordsForPaging;
                            // if (start > account.countPagesPaging) start = account.numbersRecordsForPaging;
                            var end = account.countPagesPaging;
                            for (var t = start; t < end; t++) {
                                if (t == start) account.visualTransaction(trans[t], true);
                                else account.visualTransaction(trans[t]);
                            }
                            account.visualPaging(account.countPagesPaging);
                            break;
                    }
                }
            }
        });

        if (tk.length > 0 && tk != 0) {
            var data = { lang: "ru", token: tk };
            var url = "/account/list";
            $.ajax({
                type: "POST",
                url: account.getUrl(url),
                cache: false,
                dataType: 'JSONP',
                data: data,
                success: function (response) {
                    if (response.status == 1) {
                        account.getAccountList(response.data);
                    } else {
                        alert(response.text);
                    }
                }
            });
        }
    },
    visualPaging: function (selectPage) {
        $("#transPaging").find(".paging[p=first]").hide();
        $("#transPaging").find(".paging[p=prev]").hide();
        $("#transPaging").find(".paging[p=prev2]").hide();
        $("#transPaging").find(".paging[p=prev1]").hide();
        $("#transPaging").find(".paging[p=next1]").hide();
        $("#transPaging").find(".paging[p=next2]").hide();
        $("#transPaging").find(".paging[p=next]").hide();
        $("#transPaging").find(".paging[p=last]").hide();


        var p = (parseInt(selectPage)) + 1;
        var b = (parseInt(selectPage)) + 2;
        var c = (parseInt(selectPage)) - 1;
        var d = (parseInt(selectPage)) - 2;

        if (selectPage == 1) {
            if (account.countPagesPaging > 0 && selectPage < account.countPagesPaging) {
                $("#transPaging").find(".paging[p=next1]").text(p);
                $("#transPaging").find(".paging[p=next2]").text(b);
                $("#transPaging").find(".paging[p=next1]").show();
                $("#transPaging").find(".paging[p=next2]").show();
                $("#transPaging").find(".paging[p=next]").show();
                $("#transPaging").find(".paging[p=last]").show();
            }
        }
        if (selectPage > 1) {
            $("#transPaging").find(".paging[p=prev1]").text(c);
            $("#transPaging").find(".paging[p=prev1]").show();
            if (selectPage > 2) {
                $("#transPaging").find(".paging[p=prev2]").text(d);
                $("#transPaging").find(".paging[p=prev2]").show();
            }
            $("#transPaging").find(".paging[p=prev]").show();
            $("#transPaging").find(".paging[p=first]").show();
            if (account.countPagesPaging > 0 && selectPage < account.countPagesPaging) {
                var a = account.countPagesPaging - selectPage;
                if (a >= 2) {
                    $("#transPaging").find(".paging[p=next1]").text(p);
                    $("#transPaging").find(".paging[p=next2]").text(b);
                    $("#transPaging").find(".paging[p=next1]").show();
                    $("#transPaging").find(".paging[p=next2]").show();
                    $("#transPaging").find(".paging[p=next]").show();
                    $("#transPaging").find(".paging[p=last]").show();
                }
                else if (a >= 1) {
                    $("#transPaging").find(".paging[p=next1]").text(p);
                    $("#transPaging").find(".paging[p=next1]").show();
                    $("#transPaging").find(".paging[p=next]").show();
                    $("#transPaging").find(".paging[p=last]").show();
                }
            }
        }
        $("#transPaging").find(".paging[p=selected]").text(selectPage);
    },
    dataProcessUrl: "https://api.vsemoe.com",
    getUrl: function (url) {
        return account.dataProcessUrl + url;
    },
    countPagesPaging: 0,
    numbersRecordsForPaging: 13,
    transactions: [],
    transactionsForVisual: [],
    accounts: [],
    totalGain: 0,
    totalConsumption: 0,
    totalActive: 0,
    totalPassive: 0,
    totalLimited: 0,
    getLastTransactionDate: 0,
    getLastTransactionDate1: 0,
    getLastTransactionAmount: 0,
    getLastTransactionAmount1: 0,
    setLastTransaction: { amount: 0, date: 0 },
    setLastTransaction1: { amount: 0, date: 0 },
    baseTypeAccount: ["IN", "OUT", "CASH", "BANK", "CARD", "LOAN", "ELECTRON", "OTHER"],
    getAccountList: function (data) {
        var trs = [];
        var childs = [];
        var imp = [];
        var oth = [];
        function getTransactions(acc) {
            var url = "/transaction/list";
            $.ajax({
                type: "POST",
                url: account.getUrl(url),
                cache: false,
                dataType: 'JSONP',
                data: { lang: "ru", token: account.tk, account_id: acc.a },
                success: function (response) {
                    if (response.status == 1) {
                        var transactions = [];
                        var currentDate = new Date();
                        var currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                        currentMonth = Date.parse(currentMonth);
                        for (var d = 0; d < response.data.length; d++) {
                            if (((response.data[d].created) * 1000) >= currentMonth) {
                                var tr = trs[response.data[d].transaction_id];
                                if (tr == undefined) {
                                    transactions.push(response.data[d]);
                                    trs[response.data[d].transaction_id] = "yes";
                                    account.transactions.push(response.data[d]);
                                }
                            }
                        }
                        acc.s = account.trasactionSumAmount(transactions, acc.t, acc.g);
                        acc.tr = transactions;
                        if (acc.p != 0) childs.push(acc);
                        else {
                            if (acc.i != 0) imp.push(acc);
                            else oth.push(acc);
                        }
                    } else console.log("error transaction #: ", acc);
                    var count = imp.length + oth.length + childs.length;
                    if (count == data.length) {
                        account.setObjIncludeChilds(imp, oth, childs);
                    }
                }
            });
        }
        function getSum(obj) {
            var url = "/account/sum";
            $.ajax({
                type: "POST",
                url: account.getUrl(url),
                cache: false,
                dataType: 'JSONP',
                data: { lang: "ru", token: account.tk, account_id: obj.account_id },
                success: function (response) {
                    if (response.status == 1) {
                        var acc = account.setObjExcepCh(obj);
                        acc.sum = response.data.sum;
                        getTransactions(acc);
                    } else console.log("error sum transaction #: ", obj);
                }
            });
        }
        if (data && data.length > 0) {
            account.accounts[0] = "";
            for (var i = 0; i < data.length; i++) {
                account.totalLimited = account.totalLimited + parseFloat(data[i].creditlimit);
                getSum(data[i]);
                account.accounts[data[i].account_id] = data[i].description;
            }
        }
    },
    setObjIncludeChilds: function (imp, oth, childs) {
        for (var i = 0; i < imp.length; i++) {
            imp[i].ch = account.getChildAccounts(imp[i].a, childs);
            account.visual(imp[i]);
        }
        for (var j = 0; j < oth.length; j++) {
            oth[j].ch = account.getChildAccounts(oth[j].a, childs);
            account.visual(oth[j]);
        }
        account.totalPassive = account.totalPassive - account.totalLimited;
        $(".bottomBox .greenResult").text(account.totalGain);
        $(".bottomBox .orangeResult").text(account.totalConsumption);
        $("#box1 .largeValue").text(parseFloat(account.totalGain + account.totalConsumption));
        $(".activeTop .activeText").text(account.totalActive);
        $(".passiveTop .passiveText").text(account.totalPassive);
        $(".notice .noticeValue").text(parseFloat(account.totalActive - account.totalPassive));

        $("#box2 .largeValue").text(parseFloat(account.totalActive - account.totalPassive));
        $("#box2 .grayResult[gr=1]").text(account.totalActive);
        $("#box2 .grayResult[gr=2]").text(account.totalPassive);
        var percent0 = ((account.getLastTransactionAmount / ((account.totalGain + account.totalConsumption) - account.getLastTransactionAmount)) * 100).toFixed(1);
        var percent1 = ((account.getLastTransactionAmount1 / ((account.totalActive - account.totalPassive) - account.getLastTransactionAmount1)) * 100).toFixed(1);
        if (isNaN(percent0))
            percent0 = 0;
        if (isNaN(percent1))
            percent1 = 0;
        $(".totalPercent .percentValue").text(percent0 + " %");
        $(".noticePercent .percentValue").text(percent1 + " %");

        if (percent0 > 0) $(".totalPercent .trend").addClass("trend-up");
        else $(".totalPercent .trend").addClass("trend-down");
        if (percent1 > 0) $(".noticePercent .trend").addClass("trend-up");
        else $(".noticePercent .trend").addClass("trend-down");

        function compare(a, b) {
            if (a.modified < b.modified)
                return -1;
            if (a.modified > b.modified)
                return 1;
            return 0;
        }
        var trans = account.transactions.sort(compare);
        account.transactionsForVisual = trans;
        for (var t = 0; t < account.numbersRecordsForPaging; t++) {
            account.visualTransaction(trans[t]);
        }
        //   account.countPagesPaging = parseInt(trans.length / account.numbersRecordsForPaging) + 1;

        var count = trans.length / account.numbersRecordsForPaging;
        // if ((count ^ 0) === count)
        // if ((count).indexOf(".") > 0)
        // if (count.toFixed() != count)
        account.countPagesPaging = parseInt(count);
        //  else
        //      account.countPagesPaging = (parseInt(count)) + 1;
        if (account.countPagesPaging > 5) {
            $("#transPaging .pag").show();
        }
        else if (account.countPagesPaging > 2) {
            $("#transPaging").find(".paging[p=next1]").show();
            $("#transPaging").find(".paging[p=next]").show();
            $("#transPaging").find(".paging[p=next2]").show();
            $("#transPaging").find(".paging[p=last]").show();
            $("#transPaging").find(".paging[p=selected]").show();
            $("#transPaging .pagingcount").text(account.countPagesPaging);
        }
        else if (account.countPagesPaging > 1) {
            $("#transPaging").find(".paging[p=next1]").show();
            $("#transPaging").find(".paging[p=next]").show();
            $("#transPaging").find(".paging[p=selected]").show();
            $("#transPaging .pagingcount").text(account.countPagesPaging);
        }
    },

    setObjExcepCh: function (obj) {
        return { a: obj.account_id, c: obj.currency_id, d: obj.description, g: obj.group, i: obj.importance, p: obj.parent, t: account.baseTypeAccount.indexOf(obj.type), ch: [], s: 0, sum: 0, tr: [], limited: obj.creditlimit };
    },
    getChildAccounts: function (a, childs) {
        var ch = [];
        if (a > 0 && (childs && childs.length > 0)) {
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].p == a) {
                    ch.push(childs[i]);
                }
            }
        }
        return ch;
    },
    trasactionSumAmount: function (arr, t, g) {
        var sum = 0;
        if (arr && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                var amount = parseFloat(arr[i].amount);
                var date = parseInt(arr[i].created);
                sum = sum + amount;
                if (g == 0) {
                    if (t == 0) account.totalGain = account.totalGain + amount;
                    if (t == 1) account.totalConsumption = account.totalConsumption + amount;
                    if (date >= account.getLastTransactionDate) {
                        account.getLastTransactionDate = date;
                        account.getLastTransactionAmount = amount;
                    }
                }
                else {
                    if (date >= account.getLastTransactionDate1) {
                        account.getLastTransactionDate1 = date;
                        account.getLastTransactionAmount1 = amount;
                    }
                }
                if (g == 1) account.totalActive = account.totalActive + amount;
                if (g == 2) account.totalPassive = account.totalPassive + amount;
            }
        }
        return sum;
    },
    clickEl: function (elem) {
        $(elem).find(".caret").click(function () {
            var $el = $(this);
            if ($el.hasClass("iconSmallLeft"))
                $el.removeClass("iconSmallLeft").addClass("iconSmallDown");
            else if ($el.hasClass("iconSmallDown"))
                $el.removeClass("iconSmallDown").addClass("iconSmallLeft");
            if ($el.hasClass("iconLargeLeft"))
                $el.removeClass("iconLargeLeft").addClass("iconLargeDown");
            else if ($el.hasClass("iconLargeDown"))
                $el.removeClass("iconLargeDown").addClass("iconLargeLeft");
            $el.parent().parent().find("ul[p=" + $el.parent().attr('a') + "]").toggleClass("none");
        });
    },
    visual: function (elem) {
        var c = "";
        var l = elem.d;
        if (elem.g == 0) {
            if (elem.t == 0) c = "green";
            if (elem.t == 1) c = "orange";
        }
        if (elem.g == 1) c = "green";
        if (elem.g == 2) c = "orange";
        if (elem.d.length > 18) {
            l = elem.d.slice(0, 18);
            l = l + "..";
        }
        var view;
        var el;
        var childs = "";
        var sum = elem.s;
        if (elem.ch.length > 0) {
            childs = "<ul class='none' p='" + elem.ch[0].p + "'>";
            var l2;
            for (var j = 0; j < elem.ch.length; j++) {
                l2 = elem.ch[j].d;
                if (elem.ch[j].d.length > 18) {
                    l2 = elem.ch[j].d.slice(0, 18);
                    l2 = l2 + "..";
                }
                sum = sum + elem.ch[j].s;
                childs = childs + "<li><span class='hiddenText'>" + l2 + "</span><span class='hiddenValue'>" + elem.ch[j].s + "</span></li>";
            }
            childs = childs + "</ul>";
        }
        var el2;
        var view2;
        if (elem.g == 0) {
            var cssClass = elem.ch.length > 0 ? "caret iconSmallDown" : "";
            if (elem.i != 0) el = $("#box1 div[g=0][i=10][t=" + elem.t + "]");
            else el = $("#box1 div[g=0][i=0][t=" + elem.t + "]");
            view = $("<div a='" + elem.a + "' class='clickBox'><div class='smallclickIcon " + cssClass + "'></div><span class='baseText'>" + l + "</span><span class='" + c + "Value'>" + sum + "</span></div>" + childs);
        } else {
            var cssClass = elem.ch.length > 0 ? "caret iconLargeDown" : "";
            el = $("#box1 div[g=" + elem.g + "]");
            view = $("<div a='" + elem.a + "' class='walletBox'><div class='largeclickIcon " + cssClass + "'></div><span class='normalText'>" + l + "</span><span class='" + c + "Symbol'>Pуб</span><span class='" + c + "Value'>" + sum + "</span></div>" + childs);

            el2 = $("#box2 div[g=" + elem.g + "]");
            var cssClass2 = elem.ch.length > 0 ? "caret iconSmallDown" : "";
            view2 = $("<div a='" + elem.a + "' class='clickBox'><div class='smallclickIcon " + cssClass + "'></div><span class='baseText'>" + l + "</span><span class='" + c + "Value'>" + sum + "</span></div>" + childs);
        }
        account.clickEl(view);
        el.append(view);
        if (el2 || view2) {
            account.clickEl(view2);
            el2.append(view2);
        }
    },
    visualTransaction: function (elem, newPage) {
        if (elem) {
            var calendarMonthNamesLoc = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
            var date = new Date(parseInt(elem.created) * 1000);
            var time = date.getDate() + ' ' + calendarMonthNamesLoc[date.getMonth()] + ' ' + date.getFullYear();
            var tbl = $("#box2 .tableBox .baseTable tbody");

            if (newPage) tbl.children().not('tr[row=1]').remove();

            var view = $("<tr trId='" + elem.transaction_id + "'><td width='24'><div class='checkbox'></div></td>" +
                                                "<td class='tbody1' align='left'>" + time + "</td>" +
                                                "<td class='tbody2' align='left' a='" + elem.from_id + "'>" + account.accounts[elem.from_id] + "</td>" +
                                                "<td class='tbody3' align='left' a='" + elem.to_id + "'>" + account.accounts[elem.to_id] + "</td>" +
                                                "<td class='tbody4' align='right'>" + parseFloat(elem.amount) + "</td>" +
                                                "<td class='tbody5' align='left'>" + elem.description + "<div class='split'></div></td></tr>");
            tbl.append(view);
        }

    },
}

