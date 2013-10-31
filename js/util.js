var
    hashes = {
        "login": 0,
        "register": 1,
        "restore": 2,
        "congratulations": 3,
        "changepass": 4
    },
    urls = {
        checkExistEmail: "/user/exist/"
    },
    //dataProcessUrl = "http://dev.vsemoe.com",
    session = {
        token: null,
        email: null,
        password: null,
       // repassword: null,
        errors: {
            email: 0,
            pass: 0,
            maxPass: 3
        }
    },
    //rpc = new easyXDM.Rpc({
    //    remote: "http://dev.vsemoe.com/xdm/src/cors/index.html", // наш провайдер на удаленном сервере
    //    swf: 'http://dev.vsemoe.com/xdm/src/easyxdm.swf'
    //}, {
    //    remote: {
    //        request: {}
    //    }
    //}),
    checkData = function (data) {
        //var data= jQuery.parseJSON(data);

        if (data && data.status == 1)
            return true;
        return false;
    };
    //ProvideData = function (successFunc) {
    //    return function (arr, form, options) {
    //        var s = successFunc;
    //        var json = {};
    //        for (var i = 0; i < arr.length; i++) {
    //            // преобразуем сериализованные данные формы в нормальный объект js готовый к нашей сериализации (сама форма их передает в весьма странном виде)
    //            json[arr[i].name] = arr[i].value;
    //        }
    //        //debugger;
    //        GetData(options.url, json, s);
    //        return false; //останавливаем нативный ajax запрос от jQ

    //    }
    //},
    //GetData = function (url, data, succFunc, type) {
    //    type = type || "POST";
    //    rpc.request({ // шлем кросс доменный запрос, подставляя наши параметры
    //        url: getUrl(url),
    //        method: type,
    //        data: data
    //    }, function (response) {

    //        switch (response.status) { // разбираем ответ
    //            case 200:
    //                var data = {};
    //                $(JSON.parse(response.data)).each(function (index, elem) {
    //                    for (k in elem) {
    //                        data[k] = elem[k];
    //                    }
    //                });
    //                succFunc(data);//showResponse(JSON.parse(response.data), response.status, arr, form)
    //                break;
    //            default:
    //                alert("Error: " + response.status);
    //                break;
    //        }
    //    });
    //},
  var  validateOptions = {
        onkeyup: false,
        errorElement: "p",
        errorPlacement: function(error, element) {
            error.appendTo('.allErrors');
        },
        rules: {
            password: {
                required: true,
              //  minlength: 5,
                analisyEmailPass: true
            },
           // repassword: {
             //   required: true,
               // minlength: 5,
             //   equalTo: "#password"
           // },
            newpassword: {
                required: true,
              //  minlength: 5,
                analisyEmailPass: true
            },
            renewpassword: {
                required: true,
              //  minlength: 5,
                equalTo: "#newpassword"
            },
            user: {
                required: true,
                email: true,
                existEmail: true,
                existEmailRegister: true
            }
        },
        messages: {
            password: {
                required: "Пожалуйста, введите пароль",
               // minlength: "Ваш пароль должен содержать больше 5 символов"
            },
           // repassword: {
           //     required: "Пожалуйста, введите пароль",
               // minlength: "Ваш пароль должен содержать больше 5 символов",
              //  equalTo: "Введеные вами пароли не совпадают"
         //   },
            newpassword: {
                required: "Пожалуйста, введите пароль",
                //minlength: "Ваш пароль должен содержать больше 5 символов"
            },
            renewpassword: {
                required: "Пожалуйста, введите пароль",
              //  minlength: "Ваш пароль должен содержать больше 5 символов",
                equalTo: "Введеные вами пароли не совпадают"
            },
            user: {
                email: "Пожалуйста, введите корректный Email",
                required: "Пожалуйста, введите логин"
            },
            passed: "Email и пароль не соотвествуют друг другу"
        },
        success: function (label) {
            label.closest("div").find("img.error").addClass("hidden");
        },
        showErrors: function (errorMap, errorList) {
            if (errorList[0] && errorList[0].element)
                $(errorList[0].element).closest("div").find("img.error").removeClass("hidden");
            this.defaultShowErrors();
        }
    };
    //getUrl = function (url) {
    //    return dataProcessUrl + url;
    //};


//$.extend({
//    getUrlVars: function () {
//        var vars = [], hash;
//        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
//        for (var i = 0; i < hashes.length; i++) {
//            hash = hashes[i].split('=');
//            vars.push(hash[0]);
//            if (hash[1] && hash[1].length)
//                vars[hash[0]] = hash[1].split("#")[0];
//        }
//        return vars;
//    },
//    getUrlVar: function (name) {
//        return $.getUrlVars()[name];
//    }
//});