export function resizeBlock() {
    let list = document.querySelector(".social-share-list");
    let $list = $(".social-share-list");
    var init = $list.attr('data-init-slider', '0');
    var socialsShareBlock = $(".top-info");
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var scrollWidth = window.innerWidth - document.documentElement.clientWidth;

    if ($('body').hasClass('mgnl-edit-mode')) {
        return;
    }

    let initSlider = () => {
        if ($(window).innerWidth() <= 1200 - scrollWidth) {
            socialsShareBlock.prependTo($(".social-share"));
        } else {
            socialsShareBlock.prependTo($list);
        }
        $list.slick({
            arrows: false,
            infinite: true,
            dots: true,
            adaptiveHeight: true,
        });
    };


    let changeHeightList = () => {
        let [...item] = list.querySelectorAll(".item");
        if ($(window).innerWidth() >= 1200 - scrollWidth) {
            let heightParentBlock = item[4].offsetHeight + item[6].offsetHeight + 30;
            list.style.height = heightParentBlock + 'px';
        }
    };

    if ($(window).innerWidth() >= 1199 - scrollWidth) {
        window.addEventListener("resize", changeHeightList);

    }
    window.addEventListener("load", changeHeightList);

    if ($(window).innerWidth() <= 1199 - scrollWidth) {
        initSlider();
        if ($('body').hasClass('no-touch')) {
            $list.attr('data-init-slider', '1');

        }
        $(window).on("resize", function () {
            $list.slick("resize");
        });
    }
    if (list) {
        $(window).on("orientationchange", function () {
            if ($(window).innerWidth() >= 1024) {
                location.reload(true);

            }
            if ($(window).innerWidth() >= 768) {
                if (/android/i.test(userAgent)) {
                    location.reload(true);
                }
            }

        });
    }
    $(window).on('resize', function () {
        if ($(window).innerWidth() <= 1199 - scrollWidth && $('body').hasClass('no-touch')) {
            if ($list.attr('data-init-slider') != 1) {
                socialsShareBlock.prependTo($(".social-share"));
                $list.slick({
                    arrows: false,
                    infinite: true,
                    dots: true,
                    adaptiveHeight: true,
                });
                $list.attr('data-init-slider', '1');
                list.style.height = 'auto'
            }
        } else {

            if ($list.attr('data-init-slider') == 1) {
                $list.slick('unslick');
                socialsShareBlock.prependTo($list);
                $list.attr('data-init-slider', '0');

                changeHeightList()


            }
        }
    })

}