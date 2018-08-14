$(document).ready(function () {

    const showsItems = $('.js-shows-item');
    const showsWrap = $('.js-shows-wrap');
    const showsList = $('.js-shows-list');

    const showsDots = $('.js-shows-dots');
    const showsNextArrow = $('.js-shows-next');
    const showsPrevArrow = $('.js-shows-prev');

    let draggable;
    let windowWidth;
    let currentSlide = 0;
    let isAnimating = false;
    var maxShift;
    var maxIndex;


    initBg();
    initSlider();

    $(window).resize(function () {
        initSlider();
    });

    function initBg() {
        showsItems.each((index, item) => {
            const imageSet = eval($(item).data('bg'));
            const image = $(item).find('.js-shows-image');
            if (isRetina()) {
                image.css('background-image', `url(${imageSet[1]})`);
            } else {
                image.css('background-image', `url(${imageSet[0]})`);
            }
        })
    }
    function initSlider() {
        windowWidth = $(window).width();
        resetList();
        if (windowWidth < 576) {
            initCarousel();
        } else {
            initDraggable();
        }
        showsNextArrow.click((event) => {
            event.preventDefault();
            nextSlide();
        });
        showsPrevArrow.click((event) => {
            event.preventDefault();
            prevSlide();
        });
    }
    function resetList() {
        showsList.width('auto');
        showsList.swipe("destroy");
        if (draggable) {
            draggable[0].disable();
        }
    }
    function countItemsWidth() {
        let result = 0;
        showsItems.each((index, item) => {
            result += $(item).width();
        });
        return result;
    }
    function initDraggable() {
        var padding = parseInt(showsList.css('padding-left'));
        var margin = parseInt(showsList.css('margin-left'));
        var minX = windowWidth - (countItemsWidth() + margin + padding + showsItems.eq(0).width());

        if (minX > 0) {
            minX = 0
        }
        var margin = parseInt(showsList.css('margin-left') && showsList.css('margin-left').replace('px', '')) || 0;
        var padding = parseInt(showsList.css('padding-left') && showsList.css('padding-left').replace('px', '')) || 0;
        maxShift = ((showsList.width() - windowWidth + margin + padding) / showsList.width()) * 100;
        console.log(maxShift);

        // draggable = Draggable.create(showsList, {
        //     dragClickables: true,
        //     type: 'x',
        //     edgeResistance: 0.25,
        //     dragResistance: 0.35,
        //     bounds: {
        //         maxX: 0,
        //         minX: minX
        //     }
        // });
    }
    function initCarousel() {
        showsList.width(`${showsItems.length * 100}%`);
        maxShift = ((showsList.width() - windowWidth + margin + padding) / showsList.width()) * 100;
        console.log(maxShift);
        var swipeOptions =
            {
                swipeLeft: function () {
                    nextSlide()
                },
                swipeRight: function () {
                    prevSlide()
                },
                threshold: 0,
                allowPageScroll: "auto"
            };
        showsList.swipe(swipeOptions);
        showsDots.html('');
        showsItems.each((index, item) => {
            var dotItem = $('<div>');
            dotItem.addClass('shows__dot');
            showsDots.append(dotItem);
        });
        setSlide(0, 0);
    }

    function nextSlide() {
        if (currentSlide < showsItems.length - 1 && !isAnimating) {
            setSlide(currentSlide, currentSlide + 1);
        }
    }
    function prevSlide() {
        if (currentSlide > 0 && !isAnimating) {
            setSlide(currentSlide, currentSlide - 1);
        }
    }

    function setSlide(current, next) {
        isAnimating = true;
        if(maxIndex && next > maxIndex){
            currentSlide = current;
        }else{
            currentSlide = next;
        }

        var shift = currentSlide * (100 / showsItems.length);
        var slideDuration = 0.5;
        var easing = Power4.easeInOut;

        if (shift > maxShift && next > current) {
            shift = maxShift;
            maxIndex = currentSlide;
        } 

        var slideParams = {
            x: `-${shift}%`,
            ease: easing,
            onComplete: function () {
                isAnimating = false;
            }
        }

        TweenLite.to(showsList, slideDuration, slideParams);
        showsDots.children().removeClass('active');
        showsDots.children().eq(next).addClass('active');
    }

    function isRetina() {
        return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    }

});