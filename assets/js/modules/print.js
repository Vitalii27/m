export function printHandler() {
    let printBtn = $(".print");

    if (printBtn) {
        printBtn.on("click", function (e) {
            e.preventDefault();
            window.print();
        });
    }
    ;

};