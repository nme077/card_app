
// Resize page to fit window
const page = document.querySelector('.page');

$(document).ready(() => {
    if(page !== null) {
        resize();
    }
});

$(window).resize(() => {
    if(page !== null) {
        resize();
    }
});

function resize() {
    const ratio = 11/8.5; // Standard sheet of paper
    const width = $('.page').css('width').replace(/px/,'');
    const height = Math.floor(width * ratio);

    const fontSize = .04 * width
    $('.page input[type=text').css('font-size', `${fontSize}px`);

    $('.page').css('height', `${height}px`);
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
        console.log($form)
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


$('.custom-file-input').change(function() {
    //Update file name in text field
    var file = $('.custom-file-input')[0].files[0].name;
    $(this).next('label').text(file);

    // Show upload button
    if($(this).next('label').text() !== '') {
        $('#upload-img-btn').css('display', 'block')
    }
  });

// Drag and drop image functionality
const draggableImages = document.querySelectorAll('.draggableImage');
const imageContainers = document.querySelectorAll('.dropzone');
let dragged;


for (let image of draggableImages) {
    image.addEventListener('dragstart', dragStart);
    image.addEventListener('dragend', dragEnd);
};


for (let imageContainer of imageContainers) {
    imageContainer.addEventListener('drop', drop);
    imageContainer.addEventListener('dragover', dragOver);
    imageContainer.addEventListener('dragenter', dragEnter);
    imageContainer.addEventListener('dragenter', dragLeave);
};
  
  function dragStart(e) {
    dragged = e.target;
    console.log(dragged)
  };
  
  function dragEnd(e) {
    // Do something
  };
  
  function drop(e) {
    e.preventDefault();

    const imageNodeArr = Array.from(this.childNodes);
    let image;
    
    for(let value of imageNodeArr.values()) {
        if(value.nodeName === 'IMG') {
            image = value;
        }
    }

    image.src = dragged.src;
    //Add image
  };
  
  function dragOver(e) {
    e.preventDefault();
  };

  function dragEnter(e) {

  };

  function dragLeave(e) {

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


// Handle image placeholder
const imageElements = document.querySelectorAll('.card-image');
for(let el of imageElements) {
    const attributes = Object.values(el.attributes);

    if(el.src === '') {
        el.css('background-color', '#c9c9c9')
    }
};

