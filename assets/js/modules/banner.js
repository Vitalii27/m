export function changeBg() {
    let bannerImage = $(".banner .content-holder");

    function changeImage() {
        bannerImage.each(function () {
            let mobileBg,
                tabletBg,
                desktopBg;
            if($(this).data('mobilebg') && $(window).width() < 768) {
                mobileBg = $(this).data('mobilebg');
                $(this).css("background-image", "url('"+mobileBg+"')");
            } else if($(this).data('tabletbg') && $(window).width() < 1200){
                tabletBg = $(this).data('tabletbg');
                $(this).css("background-image", "url('"+tabletBg+"')");
            } else {
                desktopBg = $(this).data('desktopbg');
                $(this).css("background-image", "url('"+desktopBg+"')");
            }
        })
    }

    $(document).ready(function() {
        changeImage();
    });

    $(window).resize(function() {
        changeImage();
    });
}