export function stickySidebar() {

    var stickyEl = $(".sticky-element");
    var parent = stickyEl.closest(".sticky-parent");

    function setSticky() {
        if (window.innerWidth >= 1200) {

            var itemHeight = stickyEl.innerHeight();
            if ($('body').hasClass('.news-page')) {
                var parentHeight = parent.find('.news-list').innerHeight();

            } else {
                var parentHeight = parent.innerHeight();
            }

            var parentOffsetLeft = parent.offset().left;
            var parentWidth = parent.innerWidth();

            var offsetRight = $("body").width() - (parentWidth + parentOffsetLeft);

            if (parentHeight > itemHeight) {

                parent.css("min-height", itemHeight);

                var scroll = $(window).scrollTop();
                var startPoint = parent.offset().top - 140;
                var endPoint = parent.offset().top + parentHeight - (itemHeight + 140);

                if (scroll < startPoint) {

                    parent.attr("style", "");
                    stickyEl.removeClass("fixed bottom").attr("style", "");
                } else if (scroll >= startPoint && scroll < endPoint) {

                    stickyEl.removeClass("bottom");

                    stickyEl.addClass("fixed").css({
                        right: offsetRight
                    });
                } else {

                    stickyEl.addClass("bottom").attr("style", "");
                }
            }
        } else {
            stickyEl.removeClass("fixed bottom").attr("style", "");
            parent.attr("style", "");
        }
    }

    $(window).on("load scroll resize", setSticky);

}

