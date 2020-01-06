export function smoothScroll() {
    let heightTop = 100;

    if ($('.text-content').length === 1 || $('.text-template').length === 1 || $('#faq-anchor').length === 1) {
        heightTop = 130
    }

    $('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            // prevent conflict with tabs and other script used hash

            if ($(this).data("ignore-scroll")) return;

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            if (target.length) {
                $("html, body").animate({
                    scrollTop: target.offset().top - heightTop
                }, 800);
                return false;
            }
        }
    });
}