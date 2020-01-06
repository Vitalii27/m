export function jcfInit() {
    $(function () {
      jcf.setOptions("Select", {
        wrapNative: false,
        maxVisibleItems: 9,
        flipDropToFit: false,
        wrapNativeOnMobile: true,

      });
      jcf.replaceAll();
    });

    document.addEventListener("mouseover", (e) => {
        if (!$(e.target).closest(".jcf-list-content").length) {
            $('.jcf-option').removeClass('jcf-hover')
        }
    });
}