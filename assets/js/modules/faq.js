export function faqAccordion() {
    $(document).on('click', '.accordion-title', function (e) {

        e.preventDefault();

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).siblings(".accordion-body").slideUp();
        } else {
            $(this).addClass('active');
            $(this).siblings(".accordion-body").slideDown();
        }
        // $('.accordion-title').removeClass('active')
        // $('.accordion-body').css('display', 'none')
    })

    $('.faq-folder').each(function (i, el) {
        if ($(el).find('.current-page')[0]) {
            $(el).find('.current-page').parents('.accordion-body').css('display', 'block')
            $(el).find('.current-page').parents('.accordion-body').siblings(".accordion-title").addClass('active')
        }
    })
}