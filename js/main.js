jQuery.validator.addMethod("analisyEmailPass", function (value, element) {
    return !$(element).data("loggined");
}, "Email и пароль не соотвествуют друг другу");

jQuery.validator.addMethod("existEmail", function (value, element) {
    return !$(element).data("emailnotexist");
}, "Данный email не зарегестрирован в системе");

jQuery.validator.addMethod("existEmailRegister", function (value, element) {
    return !$(element).data("emailexist");
}, "Данный email уже зарегестрирован в системе");
var userToken = 0;
var dataProcessUrl = __processUrl || "http://dev.vsemoe.com";
$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            if (hash[1] && hash[1].length)
                vars[hash[0]] = hash[1].split("#")[0];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});
var getUrl = function (url) {
    //console.log("Get "+dataProcessUrl + url);
    return dataProcessUrl + url;
};
GetData = function (url, data, succFunc, type) {
    //console.log("Get data: "+url+" "+type);
    type = type || "POST";
    $.ajax({
        type: type,
        url: getUrl(url),
        //async: false,
        cache: false,
        dataType: 'JSONP',
        data: data,
        success: function (response) {
            //console.log ("responce status " + response.status+"responce data"+response.data);
            if (response.status == 1 && response.data != undefined) {
                //console.log("call for succ");
                succFunc(response);
            }
            else {
                $(".errortext").removeClass("hidden");
                $("img.error").removeClass("hidden");
            }
        }
    });
};
var ProvideData = function (successFunc) {
    return function (arr, form, options) {
        var s = successFunc;
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            json[arr[i].name] = arr[i].value;
        }
        json["lang"] = "ru";
        GetData(options.url, json, s);
        return false; //останавливаем нативный ajax запрос от jQ
    }
};
var loadFunction = function (token, user) {
    if (token.length > 0 && token != 0) {
        //  console.log("token", token);
            $(".emailAccount").html(user);
        account.init(token);
    }
};
$(function () {

    var token = $.getUrlVar('token'),
        email = $.getUrlVar('email');
    if (token && token.length)
        $("input[name='token']").val(token);
    if (email && email.length) {
        $("[name='user']").val(email).text(email);
        session.email = email;
    }
    var $formtab = $("#formtab");
    $formtab.tabs();
    var changeTab = function (tabindex) {
        $formtab.tabs({active: tabindex});
        var form = $("div.form:visible").find("form");
        form.validate();
        if (session.email)
            form.find("[name='user']").val(session.email).text(session.email);
    };
    $(window).bind('hashchange', function () {
        if (window.location.hash == "")
            window.location.href = "#login";
        else {
            var hash = window.location.hash,
                id = hashes[hash.split("#")[1]];
            if (id || id >= 0)
                changeTab(id);
        }
    });
    $("body").off("tab").on("tab", function (e, tabindex) {
        changeTab(tabindex);
    });
// bug: wher user just type login and not enter password, why we should show them error?

//    $("input[name='user'].login").off("focusout").on("focusout", function () {
//        var $this = $(this);
//        $(".loginpassword").addClass("hidden");
//        if ($this.val().length) {
//            GetData(urls.checkExistEmail + $this.val(), {}, function (data) {
//                session.email = $this.val();
//                if (checkData(data)) {
//                    $this.data("emailnotexist", false);
//                } else {                    
//					session.errors.email++;
//                    $this.data("emailnotexist", true);
//                }
//                $this.valid();
//                if (session.errors.email >= session.errors.maxPass) {
//                    session.errors.email = 0;
//                    window.location.hash = "#register";
//                }
//            }, "POST");
//        }
//    });

    $("input[name='password'].login").off("focus").on("focus", function () {
        $(".loginpassword").addClass("hidden");
    });
    $("input[name='user'].register").off("focusout").on("focusout", function () {
        var $this = $(this);
        if ($this.val().length) {
            GetData(urls.checkExistEmail, {user: $this.val()}, function (data) {
                session.email = $this.val();
                if (!checkData(data)) {
                    $this.data("emailexist", false);
                } else {
                    session.errors.email++;
                    $this.data("emailexist", true);
                }
                $this.valid();
                if (session.errors.email >= session.errors.maxPass) {
                    session.errors.email = 0;
                    window.location.hash = "#restore";
                }

            }, "POST");
        }
    });
    $("input").off("keydown").on("keydown", function () {
        var $this = $(this);
        if ($this.val().length >= 0) {
            if ($this.attr('type') === 'password') {
                $(".resetBoxPassword").removeClass("hiddenImp");
                $("div a.hiddenToggle").addClass("hiddenImp");
            }
            else {
                $this.parent().find(".resetBox").removeClass("hiddenImp");
            }
            // $this.siblings("input[type='reset']").removeClass("hidden");
        } else {
            if ($this.attr('type') === 'password') {
                $("div a.hiddenToggle").removeClass("hiddenImp");
                $(".resetBoxPassword").addClass("hiddenImp");
            }
            else {
                $this.parent().find(".resetBox").addClass("hiddenImp");
            }

        }

    });

    $(".resetBox").each(function () {
        var $this = $(this);
        $this.on("click", function () {
            var a = $(this);
            $(a).parent().find("input").val('');
            $(a).parent().find(".resetBox").addClass("hiddenImp");

        })
    });
    $(".resetBoxPassword").on("click", function () {
        $("input[name='password']").val('');
        $(".resetBoxPassword").addClass("hiddenImp");
        $(".resetBoxPassword").addClass("hiddenImp");
        $("div a.hiddenToggle").removeClass("hiddenImp");
    })

    $("input[name='password']").off("click").on("click", function () {
        $(this).data("loggined", false);
    });
    $("form.login").validate(validateOptions);
    $("form.register").validate(validateOptions);
    $("form.restore").validate(validateOptions);
    $("form.changepass").validate(validateOptions);

    $("form").submit(function () {
        var $this = $(this);
        $(".loginpassword").addClass("hidden");
        if ($this.valid()) {
            var user = $this.find("input[name='user']").val();
            session.email = user;
            session.password = $this.find("input[name='password']").val();
            //  session.repassword=$this.find("input[name='repassword']").val();
            var successFunc = function (data) {
                if ($this.hasClass("login")) {
                    if (checkData(data)) {
                        $this.find("input[name='password']").data("loggined", false);
                        $this.valid();
                        token = data.data.token;
                        userToken = token;
                        $("#loginDiv").addClass('hidden');
                        $("#accountDiv").removeClass('hidden');
                        loadFunction(userToken, user);
                    } else {
                        if (session.errors.pass < session.errors.maxPass) {
                            $this.find("input[name='password']").data("loggined", true);
                            $this.valid();
                            session.errors.pass++;
                            if (session.errors.pass >= session.errors.maxPass) {
                                session.errors.pass = 0;
                                window.location.hash = "#restore";
                            }
                        } else {
                            changeTab(hashes.restore);
                        }
                    }
                }
                else if ($this.hasClass("register")) {
                    if (checkData(data)) {
                        changeTab(hashes.login);
                    } else {
                        $this.valid();
                    }
                } else if ($this.hasClass("restore")) {

                    if (checkData(data)) {

                        $this.find("input[name='user']").data("emailnotexist", false);
                        $this.valid();
                        window.location.hash = "#congratulations";
                        //changeTab(hashes.congratulations);
                    } else {
                        $this.find("input[name='user']").data("emailnotexist", true);
                        $this.valid();
                        session.errors.email++;
                        if (session.errors.email >= session.errors.maxPass)
                            window.location.hash = "#register";
                    }
                }
            }
            $this.ajaxSubmit({
                beforeSubmit: ProvideData(successFunc),
                success: successFunc
            });

        }
        return false;
    });
});
