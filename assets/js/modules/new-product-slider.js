export function newProductSlider() {
    const slider = $(".new-product-list");
    let scrollWidth = window.innerWidth - document.documentElement.clientWidth;

    let initSlider = () =>{
        slider.slick({
            arrows: false,
            infinite: true,
            dots: true,
            adaptiveHeight: true
        });
    };


    if ($(window).innerWidth() <= 1199 - scrollWidth) {
        initSlider()
    }
    $(window).on('resize', function () {
        if ($(window).innerWidth() <= 1199 - scrollWidth && !$('.new-product-list').hasClass('slick-initialized') ) {
            initSlider()

        }
        if ($(window).innerWidth() > 1199 - scrollWidth && $('.new-product-list').hasClass('slick-initialized')){
            slider.slick('unslick');

        }
    })
}