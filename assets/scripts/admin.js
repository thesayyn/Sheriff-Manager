$(function () {

    $(document).on('click', 'button.toggle', function (e) {
        var id = $(this).closest('.box').attr('id');
        $(this).parent().next().toggle();
        if ($('.fa', this).hasClass('fa-caret-up')) {
            $('.fa', this).removeClass('fa-caret-up').addClass('fa-caret-down');
            if (id != 'undefined') {
                localStorage.setItem('box_' + id, true);
            }
        } else {
            $('.fa', this).removeClass('fa-caret-down').addClass('fa-caret-up');
            if (id != 'undefined') {
                delete localStorage['box_' + id];
            }
        }
        e.preventDefault();
    });
    $(document.body).on('mouseenter', '.sidebar >ul >li:not(.line)' , function (e) {
        if (!$('.sub-menu:visible', this).length) {
            $('.dropdown-menu', this).show();
            $(this).addClass('hover');
        }
    });
    $(document.body).on('mouseleave', '.sidebar >ul >li:not(.line)' ,function (e) {
        $('.dropdown-menu', this).hide();
        $(this).removeClass('hover');
    });
    $(document.body).on('mouseenter', '[dropdown] >li' , function (e) {
        $('ul', this).show();
        $(this).addClass('active');
    });
    $(document.body).on('mouseleave', '[dropdown] >li' ,function (e) {
        $('ul', this).hide();
        $(this).removeClass('active');
    });
    $(document.body).on('click', '.collapse-menu' , function (e) {
        $('.sidebar').toggleClass('fix');
        if ($('.fa', this).hasClass('fa-arrow-circle-left')) {
            $('.sidebar >ul >li.active .sub-menu').hide();
            $('.fa', this).removeClass('fa-arrow-circle-left').addClass('fa-arrow-circle-right');
            localStorage.setItem('sidebar', true);
        } else {
            $('.fa', this).removeClass('fa-arrow-circle-right').addClass('fa-arrow-circle-left');
            $('.sidebar >ul >li.active .sub-menu').show();
            delete localStorage['sidebar'];
        }
        e.preventDefault();
    });
});
