export function headerFunction() {
    const $header = $(".header");
    const fullHeaderHeight = $header.outerHeight() + $(".additional-nav").outerHeight();

    $(window).scroll(function () {
        if ($(window).scrollTop() >= fullHeaderHeight) {
            if (!$header.hasClass("is-fixed")) {
                $header.addClass("is-fixed");
                $(".language-popup").fadeOut();
            }
        } else {
            $header.removeClass("is-fixed");
        }
    });

}

export function searchHead() {
    let searchLink = document.querySelector('.search-icon');
    let close = document.querySelector('.search-link .close');
    let parentElem = document.querySelector('.additional-info');

    let closeSearch = () => {
        parentElem.classList.remove('active-search');
    };

    let openSearch = () => {
        parentElem.classList.add('active-search');
    };

    close.addEventListener('click', function (e) {
        e.preventDefault();
        closeSearch()
    });

    searchLink.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch()
    });

    document.addEventListener("click", (e) => {
        let target = $(e.target);
        if (!target.closest(".search-icon, .head-search").length) {
            closeSearch();
        }
    });
}