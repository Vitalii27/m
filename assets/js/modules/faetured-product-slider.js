export function productSlider() {
    const slider = $(".featured-new-product .preview-holder");
    if ($(window).width() < 1200) {
        slider.slick({
            arrows: true,
            infinite: false
        });
    }


}