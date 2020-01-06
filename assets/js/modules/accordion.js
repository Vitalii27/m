export function accordion() {
    let $accrodions = $(".accordion");
    let $accrodion = $accrodions.find(".item");
    let closeClass = "is-close";
    let speed = 200;
    let isClose = false;

    function openAccordion() {
        closeAll();
        $(this).removeClass(closeClass);
        $(this).find(".content-hidden").slideDown(speed);
    }

    function closeAccordion() {
        $(this).addClass(closeClass);
        $(this).find(".content-hidden").slideUp(speed);

    }

    function closeAll() {
        $accrodion.each(function (i, el) {
            closeAccordion.call(el);
        });
    }

    if ($accrodion.length) {
        $accrodion.each(function (i, el) {
            let btn = $(el).find(".switch");

            if (!isClose) {
                closeAccordion.call(el);
            }

            btn.on("click", function (e) {
                if ($(el).hasClass(closeClass)) {
                    openAccordion.call(el);
                } else {
                    closeAccordion.call(el);
                }
            });
        });// end .each()
    }
}