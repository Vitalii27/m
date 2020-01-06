export function showLangPopup() {
    $(".current-lang").on("click", function (e) {
        e.preventDefault();
        $(".language-popup").fadeIn();
    });
    $(".language-popup .cross").on("click", function (e) {
        e.preventDefault();
        $(".language-popup").fadeOut();
    });
}