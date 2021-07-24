import lib from './lib.js';

const createCard =  function() {
    // Event listeners for card create page
    const templateChoices = document.querySelectorAll('.template-picker');

    templateChoices.forEach(el => {
        el.addEventListener('click', () => {
            const fileName = el.getAttribute('value');
            const image = el.getElementsByTagName('img')[0];
            const createBtn = document.querySelector('#create-btn');
            // Remove selected class from all
            $('.selected-template').removeClass('selected-template');
            // Add selected class
            image.classList.add('selected-template');
            // Set current selection as selected option in hidden select list
            $('#template_list').val(fileName);
            // Allow form submission
            createBtn.disabled = false;
        });
    });

    // Event listener to require template choice (redundancy to disabled button)
    const createForm = document.querySelector('#card-content-input');

    if(createForm) {
        createForm.addEventListener('submit', (e) => {
            const selectedTemplate = document.querySelector('.selected-template');

            if(!selectedTemplate) {
                e.preventDefault();
                alert('Please select a card template');
                return false;
            }
            
            // Handle guest creation
            if(lib.guest) {
                const template = document.querySelector('#template_list').value;
                sessionStorage.setItem('template', template);
            }

            return true;
        })
    }
}

export default createCard