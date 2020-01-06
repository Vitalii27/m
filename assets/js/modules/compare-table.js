export function additionalTable() {
    let table = $('.main-table tbody').children();
    // let imagesHeight = $('.main-table .images').height();
    $(table).clone().appendTo($('.attr-table tbody'));
    // $('.attr-table').css('margin-top', imagesHeight+'px');
}