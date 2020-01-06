export function burgerFunc() {
    let $header = $(".header");
    let $body = $("body");
    $(".burger").on("click", function () {
        if ($header.hasClass("show-m-menu")) {
            $header.removeClass("show-m-menu");
            $body.removeClass("hide-overflow");
        } else {
            $header.addClass("show-m-menu");
            $body.addClass("hide-overflow");
        }
    });
}