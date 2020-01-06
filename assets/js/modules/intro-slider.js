export function introSlider() {
    const slider = $(".intro-slider");
    if (!$('body').hasClass('mgnl-edit-mode')) {
        slider.slick({
            arrows: true,
            infinite: true,
            dots: true,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        arrows: false,
                        dots: true,
                    }
                }
            ]
        });
    }
}