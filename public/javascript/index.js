// Resize page to fit window
const page = document.querySelector('.page');

$(document).ready(() => {
    if(page !== null) {
        resize();
    }
});

$(window).resize(() => {
    if(page !== null) {
        resize();
    }
});

function resize() {
    const ratio = 11/8.5; // Standard sheet of paper
    const width = $('.page').css('width').replace(/px/,'');
    const height = Math.floor(width * ratio);

    const fontSize = .04 * width
    $('.page input[type=text').css('font-size', `${fontSize}px`);

    $('.page').css('height', `${height}px`);
};

$('.card-name').bind('contextmenu', () => {
    return false;
});