
$(document).ready(function () {

   // var token = getCookie("token");
  //  alert(token);
    //var str = $.cookie("token");
    //alert(str);
    //$.cookie("kittens", "Seven Kittens");
    //var str2 = $.cookie("kittens");
    //alert(str2);
    //$.cookie("demoCookie", "Seven Kittens356", { expires: 7});
    //var str3 = $.cookie("demoCookie");
    //alert(str3);


    $(".hiddenBox").hide();
    $("#dateList").hide();
    $("#btnDay").removeClass('none');
    $("#btnWeet").removeClass('none');
    $("#btnMonth").removeClass('none');
    $("#btnAll").removeClass('none');
    for (var i = 1; i < 25; i++) {
        var id = "clickIconSmall" + i;
        $("#" + id).bind('click', function () {
           var thisId=this.id;
           var thisAtr = $("#" + thisId).attr('atr');
           if (thisAtr == "up") {
               $("#" + thisId).next().slideDown();
               $("#" + thisId).attr('atr', 'down');
               $("#" + thisId).children(':first-child').attr('class', 'smallclickIcon iconSmallLeft');
           }
           else {
               $("#" + thisId).next().slideUp();
               $("#" + thisId).attr('atr', 'up');
               $("#" + thisId).children(':first-child').attr('class', 'smallclickIcon iconSmallDown');
           }
        });
    }
    baseFunction("up", "dateList");

    for (var i = 1; i < 25; i++) {
        var id = "clickIconLarge" + i;
        $("#" + id).bind('click', function () {
            var thisId = this.id;
            var thisAtr = $("#" + thisId).attr('atr');
            if (thisAtr == "up") {
                $("#" + thisId).next().slideDown();
                $("#" + thisId).attr('atr', 'down');
                $("#" + thisId).children(':first-child').attr('class', 'largeclickIcon iconLargeLeft');
            }
            else {
                $("#" + thisId).next().slideUp();
                $("#" + thisId).attr('atr', 'up');
                $("#" + thisId).children(':first-child').attr('class', 'largeclickIcon iconLargeDown');
            }
        });
    }
    baseFunction("up", "dateList");
    $("#selectDay").click(function () {
        selectFunctionFordateListCheck(this.id, "btnDay");
    });
    $("#selectWeet").click(function () {
        selectFunctionFordateListCheck(this.id, "btnWeet");
    });
    $("#selectTwoWeet").click(function () {
        selectFunctionFordateListCheck(this.id, "btnTwoWeet");
    });
    $("#selectMonth").click(function () {
        selectFunctionFordateListCheck(this.id, "btnMonth");
    });
    $("#selectThreeMonth").click(function () {
        selectFunctionFordateListCheck(this.id, "btnTreeMonth");
    });
    $("#selectSixMonths").click(function () {
        selectFunctionFordateListCheck(this.id, "btnSixMonths");
    });
    $("#selectNineMonths").click(function () {
        selectFunctionFordateListCheck(this.id, "btnNineMonths");
    });
    $("#selectYear").click(function () {
        selectFunctionFordateListCheck(this.id, "btnYear");
    });
    $("#selectTwoYear").click(function () {
        selectFunctionFordateListCheck(this.id, "btnTwoYear");
    });
    $("#selectAll").click(function () {
        selectFunctionFordateListCheck(this.id, "btnAll");
    });

    $("#headerInfo").click(function () {
        var thisClass = $("#headerInfo").attr('class');
        if (thisClass == "open iconOpen") {
            $("#headerWindow").slideUp();
            $("#headerInfo").attr('class', 'open iconClose');
        }
        else if (thisClass == "open iconClose") {
            $("#headerWindow").slideDown();
            $("#headerInfo").attr('class', 'open iconOpen');
        }

    });
    $("#endPeriodInput").datepicker({
        dateFormat: 'dd.mm.yy',
        showStatus: true,
        showWeeks: true,
        highlightWeek: true,
        numberOfMonths: 1,
        showAnim: "fadeIn",
        showOtherMonths: true,
        showOptions: { origin: ["top", "left"] },
        //onClose: function () { $(this).valid(); }
    });
    $("#startPeriodInput").datepicker({
        dateFormat: 'dd.mm.yy',
        showStatus: true,
        showWeeks: true,
        highlightWeek: true,
        numberOfMonths: 1,
        showAnim: "fadeIn",
        showOtherMonths: true,
        showOptions: { origin: ["top", "left"] },
        //onClose: function () { $(this).valid(); }
    });


    $("#btnLogin").click(function () {
        $("#modalLogin").removeClass('displaynone');
    });

    $("#modalLogin .close").click(function () {
        $("#modalLogin").addClass('displaynone');
    });

    $("#modalLogin .btnLogin").click(function () {
        var login = $("#modalLogin .login").val();
        var password = $("#modalLogin .password").val();

        $.ajax({
            url: "http://dev.vsemoe.com/user/login",
            type: 'POST',
            dataType: 'JSONP',
            data: { user: login, password: password,lang:"ru" },
            success: function (data) {
                $("#modalLogin .text").html(data.text);
            }
        });
    });

    $("#btnRegister").click(function () {
        $("#modalRegister").removeClass('displaynone');
    });

    $("#modalRegister .close").click(function () {
        $("#modalRegister").addClass('displaynone');
    });

    $("#modalRegister .btnRegister").click(function () {
        var login = $("#modalRegister .login").val();
        var password = $("#modalRegister .password").val();

        $.ajax({
            url: "http://api.vsemoe.com/user/create",
            type: 'POST',
            dataType: 'JSONP',
            data: { user: login, password: password, lang: "ru" },
            success: function (data) {
                $("#modalRegister .text").html(data.text);
            }
        });
    });
/******************/
});

var baseFunction = function (elemId1, elemId2) {
    $("#" + elemId1).bind('click', function () {
        var atr = $("#" + elemId1).attr('atr');
        if (atr == "up") {
            $("#" + elemId2).slideDown();
            $("#" + elemId1).attr('atr', 'down');
        }
        if (atr == "down") {
            $("#" + elemId2).slideUp();
            $("#" + elemId1).attr('atr', 'up');
        }
    })
};
var selectFunctionFordateListCheck = function (id, btnId) {
    var childrenClass = $("#" + id).children().attr('class');
    if (childrenClass == "dateListCheck checkOff") {
        $("#" + id).children(':first-child').attr('class', 'dateListCheck checkin');
        $("#" + btnId).removeClass('none');
    }
    else if (childrenClass == "dateListCheck checkin") {
        $("#" + id).children(':first-child').attr('class', 'dateListCheck checkOff');
        $("#" + btnId).addClass('none');
    }
};