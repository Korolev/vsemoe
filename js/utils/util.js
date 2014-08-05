function parseMathString(string) {
    try {
        var res = 0,
            elems = [],
            parts = string.split('='),
            func;

        if (parts[0].length) {
            res = (new Function('', 'return ' + parts[0]))();
        }

        return res;
    } catch (e) {
        console.log(e);
    }
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options) {
    options = options || {};

    options.path = options.path ? options.path : '/';

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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function showIframeDialog(url, options) {
    var
        body = $('body'),
        dialogHolder = $('<div class="dialogHolder"></div>'),
        dialogBody = $('<div class="dialogBody"></div>'),
        dialogClose = $('<div class="dialogClose"></div>');
    dialogClose.appendTo(dialogBody);
    dialogHolder.appendTo(body);
    dialogBody.appendTo(body);

    var ifrm = $('<iframe id="your-iframe-id" />').attr('src', url).appendTo(dialogBody);

    var style = {
        width:'872px',
        height: '2100px'
    };
    dialogBody.css(style);
    ifrm.css(style);

    dialogClose.on('click',function(){
        dialogBody.remove();
        dialogHolder.remove();
    });


    ifrm.load(function () {
        setTimeout(iResize, 100);
        // Safari and Opera need a kick-start.
//        document.getElementById('your-iframe-id').src = '';
//        document.getElementById('your-iframe-id').src = url;
    });
    function iResize() {
        var style = {
            width:'872px',
            height: (document.getElementById('your-iframe-id').contentWindow.document.body.offsetHeight+2)+'px'
        };
        dialogBody.css(style);
        ifrm.css(style);
    }


//    console.log(ifrm[0].window.document.outerWidth);
}

