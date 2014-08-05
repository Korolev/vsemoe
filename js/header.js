// Load current user info
$(function () {
    var usr = new UserViewModel();
    var namespace = window.__namespace !== undefined ? window.__namespace : document.getElementsByTagName('header')[0];
    ko.applyBindings(usr, namespace);

    usr.getLoginFromServer(function () {
        $('header').css({ 'opacity': '1' });
    });
});

function showPartnerForm(){
    showIframeDialog('/partner');
}