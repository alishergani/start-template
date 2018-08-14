$(document).ready(function () {
    // Gallery
    const gallery = $('.js-gallery');
    const galleryWrap = $('.js-gallery-wrap');

    const galleryModal = $('#galleryModal');

    const galleryThumbnails = $('.js-gallery-thumbnail');

    var galleryDraggable;

    // Modal
    const modalGallery = $('.js-modal-gallery');
    const modalGalleryWrap = $('.js-modal-gallery-wrap');

    const galleryImage = $('.js-gallery-image');
    const galleryVideo = $('.js-gallery-video');

    const galleryModalThumbnails = $('.js-gallery-modal-thumbnail');

    var modalGalleryDraggable;
    var galleryDraggable;
    var viewportWidth;
    var currentThumb;
    var galleryCopy;

    const galleryDraggingEnabled = false;


    if (gallery.length) {
        initGallery();

        $(window).resize(function () {
            initGallery();
        });
    }

    function initGallery() {
        if (galleryDraggingEnabled) {
            galleryDraggable = Draggable.create(galleryWrap, {
                dragClickables: true,
                type: 'x',
                edgeResistance: 0.25,
                dragResistance: 0.35,
                bounds: {
                    maxX: 0,
                    minX: gallery.width() - galleryWrap.width()
                }
            });
        }

        galleryThumbnails.each((index, item) => {
            $(item).click(function () {
                event.preventDefault();
                openModal(item, index);
            })
        });
    }

    function openModal(item, index) {
        galleryModal.modal();
        var modalThumbnail = findModalThumbnail(item);
        initModalGallery($(modalThumbnail), index);
    }
    function findModalThumbnail(triggerElement) {
        var result = triggerElement;
        galleryModalThumbnails.each((index, item) => {
            if ($(item).data('index') == $(triggerElement).data('index')) {
                result = item;
            }
        })
        return result;
    }
    function initModalGallery(item, index) {
        viewportWidth = modalGallery.width();
        if (galleryDraggingEnabled) {
            modalGalleryDraggable = Draggable.create(modalGalleryWrap, {
                dragClickables: true,
                type: 'x',
                edgeResistance: 0.25,
                dragResistance: 0.35,
                bounds: {
                    maxX: 0,
                    minX: modalGallery.width() - modalGalleryWrap.width()
                }
            });
        }
        galleryModalThumbnails.each((index, item) => {
            $(item).click(function () {
                event.preventDefault();
                triggerThumbnail($(this), index);
            })
        });
        triggerThumbnail(item, index);
    }

    function triggerThumbnail(element, index) {
        if (galleryDraggingEnabled) {
            var dragDistance = countDragDistance(index);
        }

        if (shouldDrag(index) && false && galleryDraggingEnabled) {
            TweenMax.to(modalGalleryDraggable[0].target, 0.3, {
                x: dragDistance,
            });
        }

        if (!element.hasClass('active')) {

            galleryModalThumbnails.removeClass('active');
            element.addClass('active');

            if (element.data('type') == 'image') {
                const imageSet = eval(element.data('imageset'));
                galleryImage.css('background-image', `url(${imageSet[0]}`);
                if (isRetina()) {
                    galleryImage.css('background-image', `url(${imageSet[1]}`);
                }
                galleryVideo.hide();
                galleryImage.show();

            } else if (element.data('type') == 'video') {
                galleryVideo.attr('height', galleryImage.height());
                generateIframe(parseVideoUrl(element.data('videourl')));
                galleryImage.hide();
                galleryVideo.show();
            }
        }
    }
    function parseVideoUrl(url) {
        return url.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
    }
    function isInViewport(index) {
        if (index >= galleryModalThumbnails.length) {
            return true;
        }
        updateCurrentThumb(index);
        return currentThumb.startX >= 0
            && currentThumb.startX <= viewportWidth
            && currentThumb.endX >= 0
            && currentThumb.endX <= viewportWidth;
    }
    function shouldDrag(index) {
        return !isInViewport(index) || !isInViewport(index + 1) || !isInViewport(index + 2);
    }
    function countDragDistance(index) {
        if (modalGalleryDraggable && modalGalleryDraggable[0]) {
            var dir = defineDirection(index);
            var x = modalGalleryDraggable[0].x;
            var result = 0;
            if (dir > 0) {
                if (index - 2 >= 0) {
                    updateCurrentThumb(index - 2);
                } else if (index - 1 >= 0) {
                    updateCurrentThumb(index - 1);
                } else {
                    updateCurrentThumb(index);
                }
                return -currentThumb.width;
            } else {
                if (index + 2 < galleryModalThumbnails.length) {
                    updateCurrentThumb(index + 2);
                } else if (index + 1 < galleryModalThumbnails.length) {
                    updateCurrentThumb(index + 1);
                } else {
                    updateCurrentThumb(index);
                }
                return x - (currentThumb.endX - viewportWidth);
            }
        }
    }
    function defineDirection(index) {
        if (!isInViewport(index)) {
            updateCurrentThumb(index);

            if (currentThumb.startX < 0) {
                return 1;
            } else {
                return -1;
            }
        }
        return -1;
    }
    function updateCurrentThumb(index) {
        currentThumb = {};
        currentThumb.index = index;
        currentThumb.element = $(galleryModalThumbnails.eq(index));
        currentThumb.margin = parseInt(currentThumb.element.css('margin-right') && currentThumb.element.css('margin-right').replace('px', '')) || 0;

        currentThumb.w = currentThumb.element.width() + currentThumb.margin;
        if(modalGalleryDraggable && modalGalleryDraggable[0]){
            currentThumb.x = modalGalleryDraggable[0].x;
        }

        currentThumb.width = index * currentThumb.w;
        currentThumb.startX = index * currentThumb.w;
        currentThumb.endX = index * currentThumb.w + currentThumb.w;
    }

    function isRetina() {
        return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    }

    function generateIframe(videoUrl) {
        var iframe = `<iframe width="100%" height="742" src="${videoUrl}" frameborder="0"
            allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        galleryVideo.html(iframe);
    }
});