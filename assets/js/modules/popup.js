export function sharePopup() {
    let popupLink = document.querySelectorAll(".modal-link");
    let popupBlock = document.querySelectorAll(".modal-block");
    let popupClose = document.querySelectorAll(".close");
    let body = document.querySelector("body");

    let openPopup = (elem) => {
        elem.classList.add("visible");
        body.classList.add("overlay");
    };

    let closePopup = () => {
        [...popupBlock].forEach((elem) => {
            elem.classList.remove("visible");
        });
        body.classList.remove("overlay");
    };

    [...popupLink].forEach((elem) => {
        elem.addEventListener("click", function (e) {
            e.preventDefault();
            [...popupBlock].forEach((elem) => {
                if (elem.getAttribute('data-id') === this.getAttribute('data-id')) {
                    openPopup(elem);
                }
            })
        });
    });

    [...popupClose].forEach((elem) => {
        elem.addEventListener("click", (e) => {
            e.preventDefault();
            closePopup();
        });
    });


    document.addEventListener("click", (e) => {
        if (!$(e.target).closest(".modal-link,.modal-block").length) {
            closePopup();
        }
    });
}

