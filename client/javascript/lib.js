// library object - use for widely used functions
const lib = {};

lib.imageContainers = document.querySelectorAll('.dropzone');
lib.cardBg = document.querySelector('.bottomofpage');
lib.messages = document.querySelectorAll('.message');
const guest = window.location.pathname.replace(/\/cards\//, '').replace(/\/.*$/, '') === 'guest';

if(guest) {
    lib.guest = true;
} else {
    lib.guest = false;
}

// is Mobile
lib.isMobile = function () {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// Handle loading indicator
lib.loadingIndicator = function(isLoading, outerHTML, originalHTML, loadingHTML) {
    if(isLoading === true) {
        outerHTML.innerHTML = loadingHTML;
    } else {
        outerHTML.innerHTML = originalHTML;
    }
};

// remove child node by class
lib.removeChildNodeByClass = function(parent, className) {
    const children = parent.childNodes;
        
    for(let child of children) {
        if(child.className !== undefined && child.className.includes(className)) {
            return parent.removeChild(child);
        }
    }
};

// Handle fadeout of flash messages
lib.fadeOutFlashMessage = function() {
    setTimeout(() => {
        $('.alert-container').fadeOut("slow")
    },10000);
};

// Handle image placeholder
lib.addPlaceholderImg = function() {
    const imageElements = document.querySelectorAll('.card-image');
    
    for(let el of imageElements) {
        const src = el.src.replace(/^(.*[\\\/])/,'');
        const parentElement = el.parentElement;
        
        if(src === '' || src === 'edit' || src === 'undefined' || src === ':0') {
            // Hide default placeholder
            el.style.display = 'none';
            // Set background style of parent element
            parentElement.style.background = '#c9c9c9';
            parentElement.style.opacity = 0.5;
            // Size the placeholder image
            this.resizePlaceholder();
        } else {
            // Remove the placeholder image
            this.removeChildNodeByClass(parentElement, 'placeholder');
            parentElement.style.background = '';
            parentElement.style.opacity = 1;
            el.style.display = '';
        }
    }
};

// Save changes to card to database
lib.updateCard = function() {
    const id = window.location.pathname.replace(/\/cards\//, '').replace(/\/.*$/, '');
    const images = document.querySelectorAll('.card-image');
    const saveDialog = document.querySelector('#save-success');
    let imageUrlArr = [];
    let messageArr = [];
    
    // create array of messages
    for(let message of this.messages) {
        messageArr.push(message.value);
    }

    // create array of images
    for(let image of images) {
        imageUrlArr.push(image.src.replace(/.*(?=\/uploads)/, ''));
    }

    // Card properties to save
    const cardBgColor = this.cardBg.style.backgroundColor || "white";

    const messageColor = this.messages[0].style.color;

    const cardTitle = document.querySelector('#card-title').value || document.querySelector('#card-title').textContent;

    const cardFont = document.querySelector('.font-option.active').textContent;

    // HTTP request
    axios({
        method: 'POST',
        withCredentials: true,
        credentials: "same-origin",
        url: `/cards/${id}?_method=PUT`,
        data: `card[image]=${imageUrlArr}&card[message]=${messageArr}&card[bottomFrontBackgroundColor]=${cardBgColor}&card[textColor]=${messageColor}&card[name]=${cardTitle}&card[font]=${cardFont}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
    }).then((res) => {        
        // Show save success message
        if(!saveDialog && !this.guest) {
            $(`<div class="container alert-container">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Card Saved!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>	
            </div>`).insertBefore('footer');
            this.fadeOutFlashMessage();
        }
    }).catch((res) => {
        // Show error message
        if(!saveDialog && !this.guest) {
            $(`<div class="container alert-container">
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Error, please try again
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>	
            </div>`).insertBefore('footer');
            this.fadeOutFlashMessage();
        }
    }); 
};

lib.resizePlaceholder = function() {
    for (let imageContainer of this.imageContainers) {
        const width = imageContainer.clientWidth * .5;
        $('.placeholder').css('font-size', `${width}px`);
    };
};

lib.resizeCard = function(printDiv) {
    const ratio = printDiv ? 11/8.5 : (11/2) / 8.5; // Standard sheet of paper (half height for client view)
    const width = printDiv ? 816 : $('.page').css('width').replace(/px/,''); // Width of page container
    const height = Math.floor(width * ratio);

    const fontSize = .04 * width
    $('.message').css('font-size', `${fontSize}px`);
    $('#company-credit-logo').css('width', `${.07 * width}px`);
    $('.page').css('height', `${height}px`);
};

lib.uploadField = function() {
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
}

lib.autoSave = () => {
    let saveTimeout;

    // Auto-save message on change
    for(let message of lib.messages) {
        message.addEventListener('change', (e) => {
            save();
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

        const fontList = document.querySelectorAll('.font-option');

        fontList.forEach(el => {
            el.addEventListener('click', changeCardFont);
        })
    }

    // Handle text color selector
    function changeTextColor() {
        const color = this.style.color || "white";

        for(let message of lib.messages) {
            message.style.color = color;
        }

        // auto save
        save();
    }

    // Handle background color selection
    function changeCardBackgroundColor() {
        const color = this.style.color || this.value;
        
        const cardBackground = document.querySelector('.bottomofpage');

        cardBackground.style.background = color || 'white';

        // auto save
        save();
    }

    function changeCardFont() {
        document.querySelector('.page').style.fontFamily = this.style.fontFamily;
        const currentActiveClass = document.querySelector('.font-option.active');

        if(currentActiveClass) currentActiveClass.classList.remove('active');

        this.classList.add('active');

        // auto save
        save();
    }

    function save() {
        if(saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            lib.updateCard();
        }, 2000);
    }
}

export { lib as default};