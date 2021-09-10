import lib from './lib.js'
import { guestPage } from './guestPage.js'
import { pageFormat } from './pageFormat.js'
import createCard from './createCardForm.js'
import mainCardsMenu from './mainCardsMenu.js'
import { handlePhotos } from './card.js'
import editPage from './editPage.js'
import printHandler from './print.js'


$(document).ready(() => {
    document.cookie = "SameSite=Secure";

    // Handle confirm delete
    $('.delete_button, .delete-btn-index').on('click', (e) => {
        const $form = $(e.target).closest('form');
        // Add text in modal
        if($form[0].action.includes('image')) {
            $('#item-to-delete').text('photo')
        } else {
            $('#item-to-delete').text('card')
        }

        e.preventDefault();

        $('#deleteModal')
        .on('click', '#confirm', () => {
            $form.submit();
        });
        $('#cancel').on('click', (e) => {
            e.preventDefault();
        })
    });

    // Handle upload file field
    lib.uploadField();

    // Run guest page logic if user type is guest
    if(lib.guest) {
        guestPage();
    }

    // Run page formatting
    pageFormat();

    // CREATE CARD 
    createCard();


    // Action menu on all cards screen
    mainCardsMenu();


    // Adding images to cards
    handlePhotos();


    // UPDATE TITLE OF CARD ON EDIT PAGE
    editPage();


    // PDF PRINTING
    printHandler();



    // HANDLE AUTO-SAVE
    lib.autoSave();


    // Various UI functions
    (function() {
        // Only show save as pdf when not on mobile
        if(lib.isMobile() && document.querySelector('#print-btn')) {
            document.querySelector('#print-btn').disabled = true;
            document.querySelector('#print-btn').style.cursor = 'not-allowed';
        };

        // Rotate collapse icon on click
        function rotateIcon() {
            $('.close-icon').toggleClass('d-none');
            $('.open-icon').toggleClass('d-none');
        }

        const collapseBtn = document.querySelector('#collapse-btn');

        if(collapseBtn) collapseBtn.addEventListener('click', rotateIcon);

        // Back button
        const backButton = document.querySelector('.back-btn-link');
        if(backButton) {
            backButton.addEventListener('click', () => {
                history.back(-1);
            });
        };

        // Card tooltips
        if(lib.cardBg) {
            lib.cardBg.addEventListener('mouseover', () => {
                $('.bottomofpage').tooltip();
            })
        };

        // Fadeout flash messages
        setTimeout(() => {
            $('.alert-container').fadeOut("slow")
        },10000);
    }());

});  //Document ready function