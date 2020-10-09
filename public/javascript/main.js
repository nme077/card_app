// Resize page to fit window
const page = document.querySelector('.page');

$(document).ready(() => {
    if(page !== null) {
        resizeCard();
    }
});

$(window).resize(() => {
    if(page !== null) {
        resizeCard();
        resizePlaceholder();
    }
});

function resizeCard() {
    const ratio = 11/8.5; // Standard sheet of paper
    const width = $('.page').css('width').replace(/px/,'');
    const height = Math.floor(width * ratio);

    const fontSize = .04 * width
    $('.page input[type=text]').css('font-size', `${fontSize}px`);
    $('.page').css('height', `${height}px`);
};

function resizePlaceholder() {
    for (let imageContainer of imageContainers) {
        const width = imageContainer.clientWidth * .5;
        $('.placeholder').css('font-size', `${width}px`);
    };
};

$('.card-name').bind('contextmenu', () => {
    return false;
});

// Confirm delete
$('#delete_button').on('click', (e) => {
    const $form = $('#delete_form');
    e.preventDefault();
    $('#deleteModal')
    .on('click', '#confirm', () => {
        $form.submit();
    });
    $('#cancel').on('click', (e) => {
        e.preventDefault();
    })
});

// Print button
$('#print-btn').on('click', (e) => {
    $('.page').removeClass('page-transform');
    $('.page').addClass('page-transform');
    window.print();
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

const draggableImages = document.querySelectorAll('.draggableImage');
const imageContainers = document.querySelectorAll('.dropzone');
let dragged;

// Event listeners
for (let image of draggableImages) {
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
    dragged = e.target;

    // Photo menu
    const children = e.target.parentNode.childNodes;
    
    for(const child of children) {
        if(child.classList && child.classList.contains('photo-menu'))
        return child.style.display = 'inline'
    };
};

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
    if(dragged) {
        image.src = dragged.src;
        addPlaceholderImg();
    }

    removeSelection();
};

// Remove image selection if clicking away
window.addEventListener('click', (e) => {
    if(e.target.nodeName !== 'IMG') {
        removeSelection();
    };
});

function removeSelection() {
    dragged = '';
    $('.selected-img').removeClass('selected-img');
    $('.dropzone').removeClass('dropzone-active');
    $('.photo-menu').css('display','none');
};

// Handle image placeholder

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
  $("#save").on('click', function(e) {
    const id = window.location.pathname.replace(/\/cards\//, '').replace(/\/.*$/, '');
    const images = document.querySelectorAll('.card-image');
    const messagesNodeList = document.querySelectorAll('.message');
    
    let messages = [];
    for(let message of messagesNodeList) {
        messages.push(message.value);
    }

    let imageUrlArr = [];
    
    for(let image of images) {
        imageUrlArr.push(image.src.replace(/.*(?=\/uploads)/, ''));
    }

   axios({
        method: 'POST',
        withCredentials: true,
        credentials: "same-origin",
        url: `/cards/${id}?_method=PUT`,
        data: `card[image]=${imageUrlArr}&card[message]=${messages}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
    });
  });


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