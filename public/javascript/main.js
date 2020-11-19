$(document).ready(() => {

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

// Event listener to require template choice - redundancy to disabled button
const createForm = document.querySelector('#card-content-input');
if(createForm) {
    createForm.addEventListener('submit', (e) => {
        const selectedTemplate = document.querySelector('.selected-template');
        console.log(selectedTemplate)
        if(!selectedTemplate) {
            e.preventDefault();
            alert('Please select a card template');
            return false;
        }
        return true;
    })
}

// Resize page to fit window
const page = document.querySelector('.page');

// Size card on page load and define padding on page container
$(document).ready(() => {
    if(page !== null) {
        resizeCard();
    }
    pagePlacement();
});

// Resize card on window resize
$(window).resize(() => {
    if(page !== null) {
        resizeCard();
        resizePlaceholder();
    }
});

function pagePlacement() {
    const header = document.querySelector('.navbar');
    const container = document.querySelector('.content-wrap');
   
    if(!header) {
        container.style.paddingTop = 0;
    } else {
        container.style.paddingTop = '6.5rem';
    }
};

function resizeCard(printDiv) {
    const ratio = 11/8.5; // Standard sheet of paper
    const width = printDiv ? 816 : $('.page').css('width').replace(/px/,''); // Width of page container
    const height = Math.floor(width * ratio);

    const fontSize = .04 * width
    $('.message').css('font-size', `${fontSize}px`);
    $('#company-credit-logo').css('width', `${.07 * width}px`);
    $('.page').css('height', `${height}px`);
};

function resizePlaceholder() {
    for (let imageContainer of imageContainers) {
        const width = imageContainer.clientWidth * .5;
        $('.placeholder').css('font-size', `${width}px`);
    };
};

// Confirm delete
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

// Action menu on all cards screen

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

function insertFileMenu(e) {
    $(e.target).children('.indexFileMenu').css({display: 'inline-flex', opacity: 0}).animate({
        opacity: 1
    }, 10);
};

function hideFileMenu(e) {
    $(e.target).children('.indexFileMenu').fadeOut(150);
};

function hideAllFileMenus(e) {
    $('.indexFileMenu').fadeOut(10);
}

// Handle toggle of file name input field
$('.edit-btn-index').on('click', (e) => {
    $('.card-name.disabled-card-name').addClass('active-card-name').removeClass('disabled-card-name');
    $('.edit-card-name-input.active-card-name').addClass('disabled-card-name').removeClass('active-card-name');

    const nameText = $(e.target).parent().parent().parent().find('.card-name');
    const nameInput = $(e.target).parent().parent().parent().find('.edit-card-name-input');

    $(nameText).toggleClass('active-card-name');
    $(nameText).toggleClass('disabled-card-name');
    $(nameInput).toggleClass('disabled-card-name');
    $(nameInput).toggleClass('active-card-name');
});

// Handle file input label
$('.custom-file-input').change(function() {
    //Update file name in text field
    var file = $('.custom-file-input')[0].files[0].name;
    $(this).next('label').text(file);

    // Show upload button
    if($(this).next('label').text() !== '') {
        $('#upload-img-btn').css('display', 'block')
    }
  });

/////////////////////////
// Adding images to cards
/////////////////////////

const clickableImages = document.querySelectorAll('.draggableImage');
const imageContainers = document.querySelectorAll('.dropzone');
let selected;

// Event listeners
for (let image of clickableImages) {
    image.addEventListener('click', clickStart);
};

for (let imageContainer of imageContainers) {
    imageContainer.addEventListener('click', clickEnd);
};

function clickStart(e) {
      // Remove styling from any element with class 'selected-img' then add class
    $('.photo-menu').css('display','none');
    $('.selected-img').removeClass('selected-img');
    $('.dropzone').addClass('dropzone-active');
    $(this).addClass('selected-img');
    // Save clicked element
    selected = e.target;

    // Photo menu
    addPhotoOptions(e)
};

function addPhotoOptions(e) {
    const children = e.target.parentNode.childNodes;
    
    for(const child of children) {
        if(child.classList && child.classList.contains('photo-menu'))
        return child.style.display = 'inline'
    };
}

function clickEnd(e) {
    e.preventDefault();
    const imageNodeArr = Array.from(this.childNodes);
    let image;

    for(let value of imageNodeArr.values()) {
        if(value.nodeName === 'IMG') {
            image = value;
        }
    };
    // Add image source when not undefined
    if(selected) {
        image.src = selected.src;
        addPlaceholderImg();
    }

    removeSelection();
};

// Remove image selection when clicking away from photo
window.addEventListener('click', (e) => {
    if(e.target.nodeName !== 'IMG') {
        removeSelection();
    };
});

function removeSelection() {
    selected = '';
    $('.selected-img').removeClass('selected-img');
    $('.dropzone').removeClass('dropzone-active');
    $('.photo-menu').css('display','none');
};

// Handle image placeholder
// Insert placeholder images on load
addPlaceholderImg();

function addPlaceholderImg() {
    const imageElements = document.querySelectorAll('.card-image');
    
    for(let el of imageElements) {
        const src = el.src.replace(/^(.*[\\\/])/,'');
        const parentElement = el.parentElement;

        if(src === 'none' || src === 'edit') {
            // Hide default placeholder
            el.style.display = 'none';
            // Set background style of parent element
            parentElement.style.background = '#c9c9c9';
            parentElement.style.opacity = 0.5;
            // Size the placeholder image
            resizePlaceholder();
        } else {
            // Remove the placeholder image
            removeChildNodeByClass(parentElement, 'placeholder');
            parentElement.style.background = '';
            parentElement.style.opacity = 1;
            el.style.display = '';
        }
    }
};

// Handle save button
$("#save").on('click', async function(e) {
    updateCard(e);
});

function updateCard(e) {
    const id = window.location.pathname.replace(/\/cards\//, '').replace(/\/.*$/, '');
    const images = document.querySelectorAll('.card-image');
    const messagesNodeList = document.querySelectorAll('.message')
    const saveButton = document.querySelector('#save');
    const originalSaveButtonHTML = saveButton.innerHTML;
    const loadingSpinner = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    const saveDialog = document.querySelector('#save-success');
    let imageUrlArr = [];
    let messages = [];
    
    // create array of messages
    for(let message of messagesNodeList) {
        messages.push(message.value);
    }

    // create array of images
    for(let image of images) {
        imageUrlArr.push(image.src.replace(/.*(?=\/uploads)/, ''));
    }

    // Card properties to save
    const cardBg = document.querySelector('.bottomofpage');
    const cardBgColor = cardBg.style.background || '';

    const text = document.querySelector('.message');
    const textColor = text.style.color;

    // Initialize loading indicator
    let isLoading = true;
    loadingIndicator(isLoading, saveButton, originalSaveButtonHTML, loadingSpinner);


    // HTTP request
    axios({
        method: 'POST',
        withCredentials: true,
        credentials: "same-origin",
        url: `/cards/${id}?_method=PUT`,
        data: `card[image]=${imageUrlArr}&card[message]=${messages}&card[bottomFrontBackgroundColor]=${cardBgColor}&card[textColor]=${textColor}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
    }).then((res) => {
        // Remove loading spinner
        isLoading = false;
        loadingIndicator(isLoading, saveButton, originalSaveButtonHTML, loadingSpinner);
        
        // Show save success message
        if(!saveDialog) {
            $(`<div class="container alert-container">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Card Saved!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>	
            </div>`).insertBefore('footer');
            fadeOutFlashMessage();
        }
}).catch((res) => {
        // Show error message
        if(!saveDialog) {
            $(`<div class="container alert-container">
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Error, please try again
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>	
            </div>`).insertBefore('footer');
            fadeOutFlashMessage();
        }
    }); 
}

  // Handle loading indicator
function loadingIndicator(isLoading, outerHTML, originalHTML, loadingHTML) {
    if(isLoading === true) {
        outerHTML.innerHTML = loadingHTML;
    } else {
        outerHTML.innerHTML = originalHTML;
    }
}

function fadeOutFlashMessage() {
    setTimeout(() => {
        $('.alert-container').fadeOut("slow")
    },10000);
}

// Fadeout flash messages
setTimeout(() => {
    $('.alert-container').fadeOut("slow")
},10000);

function removeChildNodeByClass(parent, className) {
    const children = parent.childNodes;
        
    for(let child of children) {
        if(child.className !== undefined && child.className.includes(className)) {
            return parent.removeChild(child);
        }
    }
}

// Print button
$('#print-btn').on('click', (e) => {
    $('.page').removeClass('page-transform');
    $('.page').addClass('page-transform');
    printPDF();
});

function printPDF () {
    const domElement = document.querySelector('.page');
    const fileName = document.querySelector('#card-title').textContent;
    const outerHTML = document.querySelector('#options-button');
    const originalHTML = outerHTML.innerHTML;
    const loadingSpinner = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    var opt = {
        margin: [-8, 0, -9, 0],
        filename:     fileName,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 6, allowTaint : false, useCORS: true, onclone: onClone(true), letterRendering: true},
        jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
      };

    let isLoading = true;
    loadingIndicator(isLoading, outerHTML, originalHTML, loadingSpinner);
    
    html2pdf(domElement, opt).then(() => {
        isLoading = false;
        loadingIndicator(isLoading, outerHTML, originalHTML, loadingSpinner);
        // Resize the card for device after printing
        onClone(false);
    }).catch(() => {
        isLoading = false;
        loadingIndicator(isLoading, outerHTML, originalHTML, loadingSpinner);
        if(!saveDialog) {
            $('<div class="d-inline" id="save-success">Error, try again</div>').insertBefore('#save-button-group');
        }
        setTimeout(() => {
            $('#save-success').fadeOut("slow", () => {$('#save-success').remove()})
        },5000);
    });
};

function onClone(printDiv) {
    resizeCard(printDiv);
    resizePlaceholder();
    changeInputText() 
}

function changeInputText() {
    const $tagName = $('.message').prop("tagName");
    // Select the existing input field
    const $message = $('.message');
    // Create text field from input fields
    const attributes = $('.message')[0].attributes;

    if($tagName !== 'DIV') {
        $message.replaceWith(`<div class="message">${$message.val()}</div>`);
    } else {
        $message.replaceWith(`<input type="text" class="message" value="${$message.val()}">`);
    }

    // Copy attributes of input field
    for(let i = 0; i < attributes.length; i++) {
        const name = attributes[i].name;
        const value = attributes[i].value;

        $('.message').attr(name, value);
    }
}

// Background color selector
if(window.location.pathname.includes('/edit') && window.location.pathname.indexOf('user') !== 1) {
    // Background color selector
    const bgColorList = document.querySelector('.background-color-list').childNodes;
    bgColorList.forEach((node) => {
        const classNames = node.className;
        if(classNames && classNames.includes('bg-color')) {
            node.addEventListener('click', changeCardBackgroundColor);
        }
    });

    // Text color selector
    const textColorList = document.querySelector('.text-color-list').childNodes;

    textColorList.forEach((node) => {
        const classNames = node.className;
        if(classNames && classNames.includes('text-color')) {
            node.addEventListener('click', changeTextColor);
        }
    });
}

function changeTextColor() {
    const color = this.style.color || 'white';
    const text = document.querySelector('.message');

    text.style.color = color;
}


function changeCardBackgroundColor() {
    const color = this.style.color;
    const cardBackground = document.querySelector('.bottomofpage');

    cardBackground.style.background = color;
}

// Rotate collapse icon on click
function rotateIcon() {
    $('.collapse-icon').toggleClass('collapsed-btn')
}

const collapseBtn = document.querySelector('#collapse-btn');
if(collapseBtn) collapseBtn.addEventListener('click', rotateIcon);


});  //Document ready function