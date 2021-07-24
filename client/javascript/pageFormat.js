import lib from './lib.js';

function pageFormat() {
    // Determine page placement on each page
    pagePlacement();
    // Insert placeholder on page load
    lib.addPlaceholderImg();

    function pagePlacement() {
        const header = document.querySelector('.navbar');
        const container = document.querySelector('.content-wrap');

        if(!header) {
            container.style.paddingTop = 0;
        } else {
            container.style.paddingTop = '6.5rem';
        }
    };

    // CARD EDIT PAGE SIZING

    // Resize card/page to fit window
    const page = document.querySelector('.page');

    // Size card on page load and define padding on page container
    if(page !== null) {
        lib.addPlaceholderImg();
        lib.resizeCard();
    }

    // Resize card on window resize
    $(window).resize(() => {
        if(page !== null) {
            lib.resizeCard();
            lib.resizePlaceholder();
        }
    });
}

export { pageFormat }