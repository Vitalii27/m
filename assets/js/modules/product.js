export function changeColor() {
    $(document).on("click", ".product .product-color-item .variety .item", function (e) {
        e.preventDefault();
        let productColorItem = $(this).parents(".product").find($(".product-color-item"));
        if (productColorItem.length > 1) {
            let index = $(this).index();
            productColorItem.removeClass("active");
            productColorItem.eq(index).addClass("active");
        }
    });
}