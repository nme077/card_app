import lib from './lib.js'

const handlePhotos = () => {
    const clickableImages = document.querySelectorAll('.draggableImage');
    let selected;
    
    // Remove image selection when clicking away from photo
    window.addEventListener('click', (e) => {
        if(e.target.nodeName !== 'IMG') {
            removeSelection();
        };
    });

    // Event listeners
    for (let image of clickableImages) {
        image.addEventListener('click', clickStart);

        // Drag and drop
        image.addEventListener('dragstart', dragStart);
        image.addEventListener('dragend', dragEnd);
    };

    for (let imageContainer of lib.imageContainers) {
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
            node.childNodes.forEach(child => {
                if(child.nodeName === 'IMG') {
                    image = child;
                }
            })
        });
    
        // Reset opacities
        selected.style.opacity = 1;
        e.target.style.opacity = 1;
        // Add image source, add placeholder if needed, then save card
        if(selected) {
            image.src = selected.src;
            lib.addPlaceholderImg();
            // Autosave
            lib.updateCard();
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
            if(node.childNodes !== null) {
                node.childNodes.forEach((childNode) => {
                    if(childNode.nodeName === 'IMG') {
                        return image = childNode;
                    }
                })
            }
        });
    
        // Add image source when not undefined
        if(selected) {
            image.src = selected.src;
            lib.addPlaceholderImg();
            // Autosave
            lib.updateCard();
        }
    
        removeSelection();
    };
    
    // Handle photo selection removal
    function removeSelection() {
        selected = '';
        $('.selected-img').removeClass('selected-img');
        $('.dropzone').removeClass('dropzone-active');
        $('.photo-menu').css('display','none');
        $('.click-prompt').remove();
    };
}

export { handlePhotos }