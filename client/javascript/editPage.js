import lib from './lib.js'

const editPage = () => {
    if(window.location.pathname.includes('/edit') && !window.location.pathname.includes('/user')) {
        // Make default font selection
        const cardFont = document.querySelector('.font-option.active');
        if(!cardFont) document.querySelector('.font-option').classList.add('active');

        const cardTitleOnEditPage = document.querySelector('#card-title');

        cardTitleOnEditPage ? cardTitleOnEditPage.addEventListener('click', changeTitleText) : '';

        // Handle change of input field to regular text to save as pdf
        function changeTitleText() {
            let saveTimeout;
            
            const $tagName = $('#card-title').prop("tagName");
            // Select the existing input field
            const $titleDiv = $('#card-title');
            // Create text field from input fields

            if($tagName !== 'H3') {
                const $title = $titleDiv.val();
                $titleDiv.replaceWith(`<h3 id="card-title"><strong>${$title}</strong></h3>`);
                document.querySelector('#card-title').addEventListener('click', changeTitleText);
            } else {
                const $title = $titleDiv.text();
                // Replace title with input field
                $titleDiv.replaceWith(`<input type="text" id="card-title" value="${$title}" style="width: ${($title.length) * 18}px; margin-top: 0 !important; font-size: 1.75rem;">`);
                // Add event listener to save on enter key press
                window.addEventListener('keydown', saveEvent);
                window.addEventListener('click', saveEvent);
            }

            // Copy attributes to new element
            const attributes = $('#card-title')[0].attributes;

            for(let i = 0; i < attributes.length; i++) {
                const name = attributes[i].name;
                const value = attributes[i].value;

                if(name !== 'value') { // exclude value 
                    $('#card-title').attr(name, value);
                }
            }


            function saveEvent(e) {
                const cardTitle = document.querySelector('#card-title').value;
                if(e.key === 'Enter' && cardTitle || e.target.id !== 'card-title' && e.target.parentElement.id !== 'card-title') {
                    save();
                    changeTitleText();
                    window.removeEventListener('keydown', saveEvent);
                    window.removeEventListener('click', saveEvent);
                }
            };

            function save() {
                if(saveTimeout) clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    lib.updateCard();
                }, 2000);
            }
        };

        handleDropdown();

        function handleDropdown() {
            $('.custom-select-wrapper').on('click', () => {
                $('.custom-select-options').hasClass('custom-select-open') ?
                    $('.custom-select-options').removeClass('custom-select-open') :
                    $('.custom-select-options').addClass('custom-select-open')
            })
        }
    }
}

export default editPage