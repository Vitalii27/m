import "babel-polyfill";
import "./libs/jcf";
import "./libs/jcf.select";
import "./libs/jcf.scrollable";
import "./libs/slick";
import "./libs/magnific";
import "./libs/prettySocials";
// dont't remove slider - used in VUE
import "./libs/jquery-ui";
import "./libs/append-polyfill";


import {binder, fwa} from "./libs/binder";
import {jcfInit as customSelect} from "./modules/custom-select";
import {burgerFunc} from "./modules/burger";
import {constants} from "./modules/module";
import {accordion} from "./modules/accordion";
import {resizeBlock} from "./modules/resize-social-share";
import {sharePopup} from "./modules/popup";
import {introSlider} from "./modules/intro-slider";
import {customVideo} from "./modules/video";
import {productSlider} from "./modules/faetured-product-slider";
import {newProductSlider} from "./modules/new-product-slider";
import {showLangPopup} from "./modules/langPopup";
import {gallerySlider} from "./modules/gallery-slider";
import {smoothScroll} from "./modules/smooth-scroll";
import {headerFunction, searchHead} from "./modules/header";
import {changeColor} from "./modules/product";
import {changeBg} from "./modules/banner";
import {showRating} from "./modules/rating";
import {faqAccordion} from "./modules/faq";
import {additionalTable} from "./modules/compare-table";
import {printHandler} from "./modules/print";
import {socialSharing} from "./modules/sharing";
import {datepickerFunc} from "./modules/datapicker";
import {stickySidebar} from "./modules/sticky-sidebar";
import {seeMore} from "./modules/see-more";


binder({
    bounds: {
        "html": constants,
        ".header": [introSlider, burgerFunc, showLangPopup, headerFunction],
        "select": customSelect,
        ".accordion": accordion,
        ".social-share-list": resizeBlock,
        ".social-share, .description-block": sharePopup,
        ".video": customVideo,
        ".featured-new-product": productSlider,
        ".new-product-list": newProductSlider,
        ".gallery": gallerySlider,
        ".product-details, .text-template, .text-content, .faq": smoothScroll,
        ".product-color-item": changeColor,
        ".banner": changeBg,
        ".rating": showRating,
        ".faq, .filter-sidebar": faqAccordion,
        ".print": printHandler,
        ".prettySocial": socialSharing,
        ".compare-table": additionalTable,
        "#datepicker": datepickerFunc,
        ".sticky-sidebar, .sticky-element": stickySidebar,
        ".see-more": seeMore,
        ".head-search": searchHead,

    },
    runTests: false
});