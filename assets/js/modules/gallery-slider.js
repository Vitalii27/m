
export function gallerySlider() {

    var $carousel = $(".slider-full");

    $carousel
        .slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            adaptiveHeight: true,
            asNavFor: ".slider-thumbnail",
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {

                        dots: true,
                    }
                }
            ]
        })
        .magnificPopup({
            type: "image",
            delegate: "a:not(.slick-cloned)",
            closeOnContentClick: false,
            mainClass: "mfp-zoom-in mfp-img-mobile",
            image: {
                verticalFit: true,
            },
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                tCounter: '<span class="mfp-counter">%curr% из %total%</span>', // markup of counte
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            },
            zoom: {
                enabled: true,
                duration: 300
            },
            removalDelay: 300, //delay removal by X to allow out-animation
            callbacks: {
                open: function () {

                    //overwrite default prev + next function. Add timeout for css3 crossfade animation
                    $.magnificPopup.instance.next = function () {
                        var self = this;
                        self.wrap.removeClass("mfp-image-loaded");
                        setTimeout(function () {
                            $.magnificPopup.proto.next.call(self);
                        }, 120);
                    };
                    $.magnificPopup.instance.prev = function () {
                        var self = this;
                        self.wrap.removeClass("mfp-image-loaded");
                        setTimeout(function () {
                            $.magnificPopup.proto.prev.call(self);
                        }, 120);
                    };
                    var current = $carousel.slick("slickCurrentSlide");
                    $carousel.magnificPopup("goTo", current);
                },
                imageLoadComplete: function () {
                    var self = this;
                    setTimeout(function () {
                        self.wrap.addClass("mfp-image-loaded");
                    }, 16);
                },
                beforeClose: function () {
                    $carousel.slick("slickGoTo", parseInt(this.index));
                }
            }
        });
    $(".slider-thumbnail").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: ".slider-full",
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        variableWidth: true,
        responsive: [{
            breakpoint: 1200,
            // settings: "unslick"
        }]
    });


}