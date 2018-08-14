$(document).ready(function () {

    const slider = $('.js-slider2');
    const sliderWrap = $('.js-slider2-wrap');

    const sliderImage = $('.js-slider2-image');
    const sliderImageWrap = $('.js-slider2-image-wrap');
    const sliderVideo = $('.js-slider2-video');

    const sliderThumbnails = $('.js-slider2-thumbnail');

    var sliderDraggable;
    var viewportWidth;
    var currentThumb;

    if (slider.length) {
        initSlider();

        $(window).resize(function () {
            initSlider();
        });
    }
    function initSlider() {
        viewportWidth = slider.width();
        sliderDraggable = Draggable.create(sliderWrap, {
            dragClickables: true,
            type: 'x',
            lockAxis: true,
            edgeResistance: 0.25,
            dragResistance: 0.35,
            bounds: {
                maxX: viewportWidth / 2,
                minX: viewportWidth - sliderWrap.width()
            }
        });

        triggerThumbnail(sliderThumbnails.first());

        TweenMax.to(sliderDraggable[0].target, 0.3, {
            x: viewportWidth / 2,
        });

        sliderThumbnails.each((index, item) => {
            $(item).click(function () {
                event.preventDefault();
                triggerThumbnail($(this), index);
            })
        });
    }

    function triggerThumbnail(element, index) {
        var dragDistance = countDragDistance(index);

        if (shouldDrag(index)) {
            TweenMax.to(sliderDraggable[0].target, 0.3, {
                x: dragDistance,
            });
        }

        if (!element.hasClass('active')) {

            sliderThumbnails.removeClass('active');
            element.addClass('active');

            if (element.data('type') == 'image') {
                const imageSet = eval(element.data('imageset'));
                sliderImage.attr('src', `${imageSet[0]}`);
                if(imageSet[1]){
                    sliderImage.attr('srcset', `${imageSet[0]} 1x, ${imageSet[1]} 2x`);
                }
                sliderVideo.hide();
                sliderImageWrap.show();

            } else if (element.data('type') == 'video') {
                sliderVideo.attr('height', sliderImage.height());
                sliderVideo.attr('src', parseVideoUrl(element.data('videourl')));
                sliderImageWrap.hide();
                sliderVideo.show();
            }
        }
    }
    function parseVideoUrl(url) {
        return url.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
    }
    function isInViewport(index) {
        if (index >= sliderThumbnails.length) {
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
        var dir = defineDirection(index);
        var x = sliderDraggable[0].x;
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
            if (index + 2 < sliderThumbnails.length) {
                updateCurrentThumb(index + 2);
            } else if (index + 1 < sliderThumbnails.length) {
                updateCurrentThumb(index + 1);
            } else {
                updateCurrentThumb(index);
            }
            return x - (currentThumb.endX - viewportWidth);
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
        currentThumb.element = $(sliderThumbnails.eq(index));
        currentThumb.margin = parseInt(currentThumb.element.css('margin-right') && currentThumb.element.css('margin-right').replace('px', '')) || 0;

        currentThumb.w = currentThumb.element.width() + currentThumb.margin;
        currentThumb.x = sliderDraggable[0].x;

        currentThumb.width = index * currentThumb.w;
        currentThumb.startX = index * currentThumb.w + currentThumb.x;
        currentThumb.endX = index * currentThumb.w + currentThumb.w + currentThumb.x;
    }

    function isRetina() {
        return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    }
});