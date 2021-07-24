const mainCardsMenu = () => {
    $('.card').on('mouseenter', (e) => {
        hideAllFileMenus(e);
        insertFileMenu(e);
    });

    $('.card').on('mouseleave', (e) => {
        hideFileMenu(e);
    });

    $('.delete-btn-index').on('click', (e) => {
        hideAllFileMenus(e);
    });

    // Handle show options on photos
    function insertFileMenu(e) {
        $(e.target).children('.indexFileMenu').css({display: 'inline-flex', opacity: 0}).animate({
            opacity: 1
        }, 10);
    };

    // Handle hide options on photos
    function hideFileMenu(e) {
        $(e.target).children('.indexFileMenu').fadeOut(15);
    };

    // Hide options on all photos
    function hideAllFileMenus() {
        $('.indexFileMenu').fadeOut(5);
    };
}

export default mainCardsMenu