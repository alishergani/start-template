$(document).ready(function () {

    const starsItems = $('.js-stars-item');
    const starsWrap = $('.js-stars-wrap');
    const starsCarousel = $('.js-stars-carousel');
    const container = $('.js-container');
    const progress = $("#progress");

    breakpoint = 971;

    let windowWidth;
    let currentSlide = 0;
    let isAnimating = false;

    var slideDuration = 0.15;
    var contentDuration = 0.15;
    var easing = Sine.easeOut;

    var contentParamsFrom = {
        fontSize: 18,
        color: '#1b1b1d',
        ease: easing
    }
    
    var contentParamsTo = {
        fontSize: 24,
        color: '#997f52',
        ease: easing
    }

    var bgParamsFrom = {
        autoAlpha: 0,
        width: '0',
        ease: easing,
        transformOrigin: "0% 50%",
    }

    var bgParamsTo = {
        autoAlpha: 1,
        width: getActiveWidth() - 100,
        ease: easing
    }
    
    initSlider();

    $(window).resize(function () {
        initSlider();
    });

    function getContentParamsTo(){
        windowWidth = $(document).width();
        var result = contentParamsTo;
        if (windowWidth < breakpoint) {
            result.autoAlpha = 1;
        }
        return result;
    }
    function getContentParamsFrom(){
        windowWidth = $(document).width();
        var result = contentParamsFrom;
        if (windowWidth < breakpoint) {
            result.autoAlpha = 0;
        }
        return result;
    }

    function initSlider() {
        windowWidth = $(document).width();
        progress.slider({
            max: starsItems.length - 1,
            value: 0
        });
        progress.on("slidestop", function (event, ui) {
            const next = progress.slider('value');
            if (isAnimating) {
                progress.slider('value', currentSlide);
            }
            else {
                setSlide(currentSlide, next);
            }
        });


        starsItems.each((index, item) => {
            $(item).removeClass('active');
            $(item).width(getBlurredWidth());
            $(item).click(() => {
                setSlide(currentSlide, index);
            });

            var content = $(item).find('.js-stars-content');
            TweenLite.set(content, contentParamsFrom);
        });
        initCarousel();
    }

    function initCarousel() {
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
        starsWrap.swipe(swipeOptions);
        setSlide(0, 0);
    }
    function getActiveWidth() {
        windowWidth = $(document).width();
        if (windowWidth < breakpoint) {
            return 220;
        }
        return 300;
    }
    function getBlurredWidth() {
        windowWidth = $(document).width();
        if (windowWidth < breakpoint) {
            return 110;
        }
        return 262;
    }
    function nextSlide() {
        if (currentSlide < starsItems.length - 1) {
            setSlide(currentSlide, currentSlide + 1);
        }
    }
    function prevSlide() {
        if (currentSlide > 0) {
            setSlide(currentSlide, currentSlide - 1);
        }
    }

    function setSlide(current, next) {
        if (!isAnimating) {
            isAnimating = true;
            currentSlide = next;
            progress.slider('value', currentSlide);

            windowWidth = $(document).width();

            var widthSmall = getBlurredWidth();
            var widthLarge = getActiveWidth();

            var shift = + (windowWidth - widthLarge) / 2 - currentSlide * widthSmall;
            // var shift = -currentSlide * widthSmall;
            var maxShift = windowWidth - starsCarousel.width();
            if(shift < maxShift){
                shift = maxShift;
            } else if(shift > 0){
                shift = 0;
            }
            starsItems.eq(current).removeClass('active');

            var slideParams = {
                x: shift,
                ease: easing,
            }

            var currentContent = starsItems.eq(current).find('.js-stars-content');
            var content = starsItems.eq(next).find('.js-stars-content');

            TweenLite.to(currentContent, contentDuration, contentParamsFrom, `-=${contentDuration}`);
            TweenLite.to(starsItems.eq(current), slideDuration, {
                width: widthSmall,
                onComplete: function () {
                    starsItems.eq(current).removeClass('active');
                }
            })
            if(starsCarousel.width() > windowWidth){
                TweenLite.to(starsCarousel, slideDuration, slideParams);
            }else{
                var defaultShift = (windowWidth - starsCarousel.width())/2
                var defaultParams = {
                    x: defaultShift,
                    ease: easing,
                }
                TweenLite.to(starsCarousel, slideDuration, defaultParams);
            }
            TweenLite.to(starsItems.eq(next), slideDuration, {
                width: widthLarge,
                onComplete: function () {
                    starsItems.eq(next).addClass('active');
                    isAnimating = false;
                }
            })
            TweenLite.to(content, contentDuration, contentParamsTo, `-=${contentDuration}`);
        }
    }
});