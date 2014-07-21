// Load current user info
$(function () {
    var usr = new UserViewModel();
    var namespace = window.__namespace !== undefined ? window.__namespace : document.getElementsByTagName('header')[0];
    ko.applyBindings(usr, namespace);

    usr.getLoginFromServer(function () {
        $('header').css({ 'opacity': '1' });
    });
});

var _ues = {
    host: 'vsemoe.userecho.com',
    forum: '31891',
    lang: 'ru',
    tab_corner_radius: 5,
    tab_font_size: 20,
    tab_image_hash: '0L7RgdGC0LDQstC40YLRjCDQvtGC0LfRi9Cy',
    tab_chat_hash: '0YfQsNGC',
    tab_alignment: 'left',
    tab_text_color: '#FFFFFF',
    tab_text_shadow_color: '#00000055',
    tab_bg_color: '#B6C1C6',
    tab_hover_color: '#76A2CA'
};

(function () {
    var _ue = document.createElement('script');
    _ue.type = 'text/javascript';
    _ue.async = true;
    _ue.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.userecho.com/js/widget-1.4.gz.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(_ue, s);
})();