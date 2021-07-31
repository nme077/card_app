import lib from './lib.js'

const printHandler = () => {
    // Print button
    $('#print-btn').on('click', (e) => {
        $('.page').removeClass('page-transform');
        $('.page').addClass('page-transform');
        printPDF();
    });
}

// Handle pdf saving
function printPDF () {
    const domElement = document.querySelector('.page');
    const fileName = document.querySelector('#card-title').textContent || 'Card';
    const outerHTML = document.querySelector('#print-btn');
    const originalHTML = outerHTML.innerHTML;
    const saveDialog = document.querySelector('#save-success');
    const loadingSpinner = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    var opt = {
        margin: [-8, 0, -9, 0],
        filename:     fileName,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 6, allowTaint : false, useCORS: true, onclone: onClone(true), letterRendering: true},
        jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(domElement).set(opt).save().then(() => {
        // Resize the card for device after printing
        onClone(false);
    }).catch(() => {
        if(!saveDialog) {
            $(`<div class="container alert-container">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Error, please try again
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>	
        </div>`).insertBefore('footer');
        }
        setTimeout(() => {
            $('#save-success').fadeOut("slow", () => {$('#save-success').remove()})
        },5000);
    });
};

function onClone(printDiv) {
    // Scroll to top to hide transitions
    window.scrollTo(0, 0);
    // Show loading screen
    printingScreen(printDiv);
    // Unhide top of page
    unhideTopPage(printDiv);
    // Replace input with text div
    changeInputText();
    // Resize entire card
    lib.resizeCard(printDiv);
    // Resize placeholders
    lib.resizePlaceholder();
}

function printingScreen(printing) {
    if(printing) {
        document.querySelector('.content-wrap').style.paddingTop = 0;
        document.querySelector('.loading-print').classList.remove('d-none');
        document.querySelector('.loading-print').classList.add('d-flex');
    } else {
        document.querySelector('.content-wrap').style.paddingTop = '6.5rem';
        document.querySelector('.loading-print').classList.add('d-none');
        document.querySelector('.loading-print').classList.remove('d-flex');
    }
}

// Unhide top half of card
function unhideTopPage(printing) {
    if(printing) {
        // Set display to block
        document.querySelector('.topofpage').style.display = 'block';
        // make top and bottom of page height 50%
        document.querySelector('.topofpage').style.height = '50%';
        document.querySelector('.bottomofpage').style.height = '50%';
    } else {
        // Set display to block
        document.querySelector('.topofpage').style.display = 'none';
        // make top and bottom of page height 50%
        document.querySelector('.bottomofpage').style.height = '100%';
    }
};

// Handle change of input field to regular text to save as pdf
function changeInputText() {
    const $tagName = $('.message').prop("tagName");
    // Select the existing input field
    const $messageDiv = $('.message');
    // Create text field from input fields
    const attributes = $('.message')[0].attributes;

    if($tagName !== 'DIV') {
        const $message = $messageDiv.val();
        $messageDiv.replaceWith(`<div class="message">${$message}</div>`);
    } else {
        const $message = $messageDiv.text();
        $messageDiv.replaceWith(`<input type="text" class="message" value="${$message}">`);
    }

    // Copy attributes to new element
    for(let i = 0; i < attributes.length; i++) {
        const name = attributes[i].name;
        const value = attributes[i].value;

        if(name !== 'value') { // exclude value 
            $('.message').attr(name, value);
        }
    }
};

export default printHandler