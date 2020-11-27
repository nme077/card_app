$(document).ready(() => {

document.cookie = "SameSite=Secure";

// Variables
const cardBg = document.querySelector('.bottomofpage');
const text = document.querySelector('.message');
const clickableImages = document.querySelectorAll('.draggableImage');
const imageContainers = document.querySelectorAll('.dropzone');
let selected;

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
        return true;
    })
}

// Resize page to fit window
const page = document.querySelector('.page');

// Size card on page load and define padding on page container
if(page !== null) {
    resizeCard();
}
pagePlacement();
// Insert placeholder images on load
addPlaceholderImg();

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
    const ratio = printDiv ? 11/8.5 : (11/2) / 8.5; // Standard sheet of paper (half height for client view)
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


// Adding images to cards
// Event listeners
for (let image of clickableImages) {
    image.addEventListener('click', clickStart);
};

for (let imageContainer of imageContainers) {
    imageContainer.addEventListener('click', clickEnd);
};

// Handle click of photo in library
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

// Render options on selected photo
function addPhotoOptions(e) {
    const children = e.target.parentNode.childNodes;
    
    for(const child of children) {
        if(child.classList && child.classList.contains('photo-menu'))
        return child.style.display = 'inline'
    };
}

// Handle click on image container (on card)
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
        // Autosave
        updateCard();
    }

    removeSelection();
};

// Remove image selection when clicking away from photo
window.addEventListener('click', (e) => {
    if(e.target.nodeName !== 'IMG') {
        removeSelection();
    };
});

// Handle photo selection removal
function removeSelection() {
    selected = '';
    $('.selected-img').removeClass('selected-img');
    $('.dropzone').removeClass('dropzone-active');
    $('.photo-menu').css('display','none');
};

// Handle image placeholder
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

// Auto save messages
const messages = document.querySelectorAll('.message');

for(let message of messages) {
    message.addEventListener('change', (e) => {
        updateCard();
    })
};

// Handle update of card (update route)
function updateCard() {
    const id = window.location.pathname.replace(/\/cards\//, '').replace(/\/.*$/, '');
    const images = document.querySelectorAll('.card-image');
    const messagesNodeList = document.querySelectorAll('.message')
    const saveButton = document.querySelector('#print-btn');
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
    const cardBgColor = cardBg.style.background;

    const textColor = text.style.color;


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

// Handle fadeout of flash messages
function fadeOutFlashMessage() {
    setTimeout(() => {
        $('.alert-container').fadeOut("slow")
    },10000);
}

// Fadeout flash messages
setTimeout(() => {
    $('.alert-container').fadeOut("slow")
},10000);

// remove child node by class
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

// Handle pdf saving
function printPDF () {
    const domElement = document.querySelector('.page');
    const fileName = document.querySelector('#card-title').textContent;
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

    // Show loading indicator
    let isLoading = true;
    loadingIndicator(isLoading, outerHTML, originalHTML, loadingSpinner);

    html2pdf().from(domElement).set(opt).save().then(() => {
        // Hide loading indicator
        isLoading = false;
        loadingIndicator(isLoading, outerHTML, originalHTML, loadingSpinner);
        printing = false;

        // Resize the card for device after printing
        onClone(false);
    }).catch(() => {
        // Hide loading indicator
        isLoading = false;
        loadingIndicator(isLoading, outerHTML, originalHTML, loadingSpinner);
        printing = false;

        if(!saveDialog) {
            $('<div class="d-inline" id="save-success">Error, try again</div>').insertBefore('#save-button-group');
        }
        setTimeout(() => {
            $('#save-success').fadeOut("slow", () => {$('#save-success').remove()})
        },5000);
    });
};

function onClone(printDiv) {
    // Unhide top of page
    unhideTopPage(printDiv);
    // Replace input with text div
    changeInputText();
    // Resize entire card
    resizeCard(printDiv);
    // Resize placeholders
    resizePlaceholder();
}

function unhideTopPage(printDiv) {
    if(printDiv) {
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
}

// is Mobile
function isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// Only show save as pdf when not on mobile
if(isMobile() && document.querySelector('#print-btn')) {
    document.querySelector('#print-btn').disabled = true;
    document.querySelector('#print-btn').style.cursor = 'not-allowed';
}

// Handle change of input field to regular text to save as pdf
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

    // Copy attributes to new element
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
            if(node.type !== 'color') {
                node.addEventListener('click', changeCardBackgroundColor);    
            }
            node.addEventListener('change', changeCardBackgroundColor);
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

// Handle text color selector
function changeTextColor() {
    const color = this.style.color || 'white';
    const text = document.querySelector('.message');

    text.style.color = color;

    // auto save
    updateCard();
}

// Handle background color selection
function changeCardBackgroundColor() {
    const color = this.style.color || this.value;
    const cardBackground = document.querySelector('.bottomofpage');

    cardBackground.style.background = color;

    // auto save
    updateCard()
}

// Rotate collapse icon on click
function rotateIcon() {
    $('.collapse-icon').toggleClass('collapsed-btn')
}

const collapseBtn = document.querySelector('#collapse-btn');
if(collapseBtn) collapseBtn.addEventListener('click', rotateIcon);

// Back button
const backButton = document.querySelector('.back-btn-link');
if(backButton) {
    backButton.addEventListener('click', () => {
        console.log(history.back(-1));
        history.back(-1);
    });
};

// Card tooltips
cardBg.addEventListener('mouseover', () => {
    $('.bottomofpage').tooltip();
})



});  //Document ready function