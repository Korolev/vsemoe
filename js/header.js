// Load current user info
$(function(){
    var usr = new UserViewModel();

    ko.applyBindings(usr, document.getElementsByTagName('header')[0]);

    usr.getLoginFromServer(function() {
      $('header').css({ 'opacity': '1' });
    });
});
