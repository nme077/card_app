import lib from './lib.js';

const guestPage = () => {
    const guestCardEdit = window.location.pathname.replace(/\/cards\/guest\//, '').replace(/\/.*$/, '') === 'edit';

    if(guestCardEdit) {
        renderLocal();
        populateLocalPhotos();
    }

    function renderLocal() {
        console.log('local good!')
        lib.cardBg.style.backgroundColor = sessionStorage.getItem('bottomFrontBackgroundColor');
        lib.messages[0].style.color = sessionStorage.getItem('textColor');
        lib.messages[0].value = sessionStorage.getItem('message');
        const photos = sessionStorage.getItem('photos');

        const cardPhotos = document.querySelectorAll('.card-image');

        for(let i = 0; i < cardPhotos.length; i++) {
            if(photos) {
                cardPhotos[i].src = photos.split(',')[i];
            }
        }
    }

    function populateLocalPhotos() {
        const stockPhotos = ['https://i.imgur.com/pDqkHG8.png', 'https://i.imgur.com/Mr5dMY2.png', 'https://i.imgur.com/wLibQF9.png', 'https://i.imgur.com/0KvlfMt.png', 'https://i.imgur.com/3Auo0ZI.png', 'https://i.imgur.com/KjmtAHH.png'];

        for(let photo of stockPhotos) {
            $('#photo-gallery').append(`
                <div class="imageDiv col-4 col-lg-3 col-xl-2">
                    <img class="draggableImage" crossorigin="anonymous" src="${photo}" draggable="true" style="padding: 5px;">
                </div>`);
        }
    }
}



export { guestPage } 