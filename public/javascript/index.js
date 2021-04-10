$(document).ready(() => {

document.cookie = "SameSite=Secure";

// Public Variables
const imageContainers = document.querySelectorAll('.dropzone');
const cardBg = document.querySelector('.bottomofpage');
const messages = document.querySelectorAll('.message');

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

// POPULATE PHOTO LIBRARY FOR GUEST PAGE
(function() {
    const guestOrId = window.location.pathname.replace(/\/cards\//, '').replace(/\/.*$/, '');
    const guestCardEdit = window.location.pathname.replace(/\/cards\/guest\//, '').replace(/\/.*$/, '');

    if(guestOrId === 'guest' && guestCardEdit === 'edit') {
        renderLocal();
        populateLocalPhotos();
    }

    function renderLocal() {
        cardBg.style.backgroundColor = sessionStorage.getItem('bottomFrontBackgroundColor');
        messages[0].style.color = sessionStorage.getItem('textColor');
        messages[0].value = sessionStorage.getItem('message');
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
}());


// DETERMINE PADDING ON PAGE BASED ON HEADER
(function() {
    // Determine page placement on each page
    pagePlacement();

    function pagePlacement() {
        const header = document.querySelector('.navbar');
        const container = document.querySelector('.content-wrap');
    
        if(!header) {
            container.style.paddingTop = 0;
        } else {
            container.style.paddingTop = '6.5rem';
        }
    };
}());


// CREATE CARD 
(function() {
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
            if(!currentUser) {
                const template = document.querySelector('#template_list').value;
                sessionStorage.setItem('template', template);
            }

            return true;
        })
    }
}());


// CARD EDIT PAGE SIZING
(function() {
    // Insert placeholder on page load
    addPlaceholderImg();
    // Resize card/page to fit window
    const page = document.querySelector('.page');

    // Size card on page load and define padding on page container
    if(page !== null) {
        addPlaceholderImg();
        resizeCard();
    }

    // Resize card on window resize
    $(window).resize(() => {
        if(page !== null) {
            resizeCard();
            resizePlaceholder();
        }
    });
}());


// Action menu on all cards screen
(function() {
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
        $(e.target).children('.indexFileMenu').fadeOut(150);
    };

    // Hide options on all photos
    function hideAllFileMenus(e) {
        $('.indexFileMenu').fadeOut(10);
    };
}());


// Adding images to cards
(function() {
    const clickableImages = document.querySelectorAll('.draggableImage');

    let selected;
    // Event listeners
    for (let image of clickableImages) {
        image.addEventListener('click', clickStart);

        // Drag and drop
        image.addEventListener('dragstart', dragStart);
        image.addEventListener('dragend', dragEnd);
    };

    for (let imageContainer of imageContainers) {
        imageContainer.addEventListener('click', clickEnd);

        // Drag and drop
        imageContainer.addEventListener('dragover', dragOver);
        imageContainer.addEventListener('drop', drop);
        imageContainer.addEventListener('dragenter', dragEnter);
        imageContainer.addEventListener('dragleave', dragLeave);
    };

    function dragStart(e) {
        styleSelectedPhoto(e);
        selected = e.target;
        selected.style.opacity = .5;
        e.dataTransfer.setDragImage(selected, 100, 100);
    }

    function dragOver(e) {
        e.preventDefault()
    }

    function dragEnter(e) {
        e.target.style.opacity = .5;
    }

    function dragLeave(e) {
        e.target.style.opacity = 1;
    }

    function dragEnd(e) {
        e.preventDefault();
        // Reset opacities
        e.target.style.opacity = 1;
        removeSelection();
    }

    function drop(e) {
        // Allow drop
        e.preventDefault();

        let image;
        // Insert image source from selected photo
        this.childNodes.forEach(node => {
            if(node.nodeName === 'IMG') {
                image = node;
            }
        });

        // Reset opacities
        selected.style.opacity = 1;
        e.target.style.opacity = 1;
        // Add image source, add placeholder if needed, then save card
        if(selected) {
            image.src = selected.src;
            addPlaceholderImg();
            // Autosave
            updateCard();
        }

        removeSelection();
    }

    // Handle click of photo in library
    function clickStart(e) {
        styleSelectedPhoto(e);
        // Save clicked element
        selected = e.target;

        // Show click prompt on image drop zones
        const dropzoneArr = document.querySelectorAll('.dropzone');

        $('.click-prompt').remove();
        dropzoneArr.forEach((el) => {
            const dropzoneHeight = el.clientHeight;
            $(el).append(`<p class="click-prompt" style="top: -${dropzoneHeight / 1.7}px; position: relative; font-size: ${dropzoneHeight / 8}px; color: black; text-shadow: 2px 2px 8px #5f5f5f; z-index: 2;">Click to insert</p>`);
        });

        // Photo menu
        addPhotoOptions(e)
    };

    function styleSelectedPhoto(e) {
        // Remove styling from any element with class 'selected-img' then add class
        $('.photo-menu').css('display','none');
        $('.selected-img').removeClass('selected-img');
        $('.dropzone').addClass('dropzone-active');
        $(e.target).addClass('selected-img');
    }

    // Render options on selected photo
    function addPhotoOptions(e) {
        const children = e.target.parentNode.childNodes;
        
        for(const child of children) {
            if(child.classList && child.classList.contains('photo-menu')) {
                child.style.display = 'inline';
            }
        };
    }

    // Handle click on image container (on card)
    function clickEnd(e) {
        e.preventDefault();
        
        let image;
        // Insert image source from selected photo
        this.childNodes.forEach(node => {
            if(node.nodeName === 'IMG') {
                image = node;
            }
        });

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
        $('.click-prompt').remove();
    };
}());


// UPDATE TITLE OF CARD ON EDIT PAGE
(function() {
    const cardTitleOnEditPage = document.querySelector('#card-title');

    cardTitleOnEditPage ? cardTitleOnEditPage.addEventListener('click', changeTitleText) : '';

    // Handle change of input field to regular text to save as pdf
    function changeTitleText() {
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
                updateCard();
                changeTitleText();
                window.removeEventListener('keydown', saveEvent);
                window.removeEventListener('click', saveEvent);
            }
        };
    };
}());


// PDF PRINTING
(function() {
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
        // Unhide top of page
        unhideTopPage(printDiv);
        // Replace input with text div
        changeInputText(printDiv);
        // Resize entire card
        resizeCard(printDiv);
        // Resize placeholders
        resizePlaceholder();
    }

    // Unhide top half of card
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
    };

    // Handle change of input field to regular text to save as pdf
    function changeInputText(printDiv) {
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
}());



// HANDLE AUTO-SAVE
(function() {
    // Auto-save message on change
    for(let message of messages) {
        message.addEventListener('change', (e) => {
            updateCard();
        })
    };

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
        const color = this.style.color || "white";

        for(let message of messages) {
            message.style.color = color;
        }

        // auto save
        updateCard();
    }

    // Handle background color selection
    function changeCardBackgroundColor() {
        const color = this.style.color || this.value;
        
        const cardBackground = document.querySelector('.bottomofpage');

        cardBackground.style.background = color || 'white';

        // auto save
        updateCard();
    }
}());



// Various UI functions
(function() {
    // Only show save as pdf when not on mobile
    if(isMobile() && document.querySelector('#print-btn')) {
        document.querySelector('#print-btn').disabled = true;
        document.querySelector('#print-btn').style.cursor = 'not-allowed';
    };

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
            history.back(-1);
        });
    };

    // Card tooltips
    if(cardBg) {
        cardBg.addEventListener('mouseover', () => {
            $('.bottomofpage').tooltip();
        })
    };

    // Fadeout flash messages
    setTimeout(() => {
        $('.alert-container').fadeOut("slow")
    },10000);
}());


// PUBLIC FUNCTIONS

// is Mobile
function isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// Handle loading indicator
function loadingIndicator(isLoading, outerHTML, originalHTML, loadingHTML) {
    if(isLoading === true) {
        outerHTML.innerHTML = loadingHTML;
    } else {
        outerHTML.innerHTML = originalHTML;
    }
};

// remove child node by class
function removeChildNodeByClass(parent, className) {
    const children = parent.childNodes;
        
    for(let child of children) {
        if(child.className !== undefined && child.className.includes(className)) {
            return parent.removeChild(child);
        }
    }
};

// Handle fadeout of flash messages
function fadeOutFlashMessage() {
    setTimeout(() => {
        $('.alert-container').fadeOut("slow")
    },10000);
};

// Handle image placeholder
function addPlaceholderImg() {
    const imageElements = document.querySelectorAll('.card-image');
    
    for(let el of imageElements) {
        const src = el.src.replace(/^(.*[\\\/])/,'');
        const parentElement = el.parentElement;

        if(src === '' || src === 'edit' || src === 'undefined') {
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

// Save changes to card to database
function updateCard() {
    const id = window.location.pathname.replace(/\/cards\//, '').replace(/\/.*$/, '');
    const images = document.querySelectorAll('.card-image');
    const saveDialog = document.querySelector('#save-success');
    let imageUrlArr = [];
    let messageArr = [];
    
    // create array of messages
    for(let message of messages) {
        messageArr.push(message.value);
    }

    // create array of images
    for(let image of images) {
        imageUrlArr.push(image.src.replace(/.*(?=\/uploads)/, ''));
    }

    // Card properties to save
    const cardBgColor = cardBg.style.backgroundColor || "white";

    const messageColor = messages[0].style.color;

    const cardTitle = document.querySelector('#card-title').value || document.querySelector('#card-title').textContent;

    // HTTP request
    axios({
        method: 'POST',
        withCredentials: true,
        credentials: "same-origin",
        url: `/cards/${id}?_method=PUT`,
        data: `card[image]=${imageUrlArr}&card[message]=${messageArr}&card[bottomFrontBackgroundColor]=${cardBgColor}&card[textColor]=${messageColor}&card[name]=${cardTitle}`,
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
};

function resizePlaceholder() {
    for (let imageContainer of imageContainers) {
        const width = imageContainer.clientWidth * .5;
        $('.placeholder').css('font-size', `${width}px`);
    };
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

// Handle file upload field label on card screen
$('.custom-file-input').change(function() {
    //Update file name in text field
    var file = $('.custom-file-input')[0].files[0].name;
    $(this).next('label').text(file);

    // Show upload button
    if($(this).next('label').text() !== '') {
        $('#upload-img-btn').css('display', 'block')
    }
});

});  //Document ready function