export function sliderRange() {
    let range = $(".slider-range");
    let min = range.data('min');
    let max = range.data('max');
    let values = range.data('values').split(',').map((item) => {
        return +item;
    });

    range.slider({
        range: true,
        min: min,
        max: max,
        values: values,
        slide: function (event, ui) {
            $(".min").val(ui.values[0]);
            $(".max").val(ui.values[1]);
        }
    });

    $(".min").val(range.slider("values", 0));
    $(".max").val(range.slider("values", 1))
}