$(function() {

    var adminNav = $('.admin-nav');

    adminNav.find('li').on('click', function() {
        var li = $(this);
        if(!li.hasClass('active')) {
            var page = li.html().toLowerCase();
            window.open(page + ".php", '_self');
        }
    });
});