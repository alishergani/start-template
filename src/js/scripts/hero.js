$(document).ready(function () {
    const heroWrap = $('.js-hero');
    const header = $('.js-header');
    const hero = $('.js-hero-slider');
    const heroOverlay = $('.js-hero-overlay');
    const heroBar = $('.js-hero-bar');
    const heroProgress = $('.js-hero-progress');
    const heroBarWrap = $('.js-hero-bar-wrap');
    const heroItems = $('.js-hero-item');
    const windowWidth = $(window).width();

    const heroPrevButton = $('.js-hero-prev');
    const heroNextButton = $('.js-hero-next');

    let isAnimating = false;
    let currentSlide = 0;

    const interval = 7000;
    const easing = Sine.easeOut;

    if (heroWrap.length) {
        initBgs();
        initDraggable();
    }

    function initDraggable() {
        var swipeOptions =
            {
                swipeLeft: function () {
                    nextSlide();
                },
                swipeRight: function () {
                    prevSlide();
                },
                threshold: 50,
                allowPageScroll: "auto"
            };
        heroItems.each((index) => {
            var barItem = $('<div>');
            barItem.html(`0${index + 1}`);
            barItem.addClass('hero__bar-item');
            heroBarWrap.append(barItem);
        })
        heroPrevButton.click((event) => {
            event.preventDefault();
            prevSlide();
        })
        heroNextButton.click((event) => {
            event.preventDefault();
            nextSlide();
        })
        hero.swipe(swipeOptions);
        heroWrap.addClass('hero--loaded');
        TweenLite.fromTo(header, 2, {
            y: '-100%',
            autoAlpha: 0,
            delay: 1,
        }, {
                y: '0%',
                autoAlpha: 1,
            })
        setSlide(0, 0);
        setInterval(function() {
            nextSlide();
        }, interval)
    }

    function nextSlide() {
        if (!isAnimating) {
            if (currentSlide < heroItems.length - 1) {
                setSlide(currentSlide, currentSlide + 1);
            } else {
                setSlide(currentSlide, 0);
            }
        }
    }

    function prevSlide() {
        if (!isAnimating) {
            if (currentSlide > 0) {
                setSlide(currentSlide, currentSlide - 1);
            } else {
                setSlide(currentSlide, heroItems.length - 1);
            }
        }
    }

    function setSlide(current, next) {
        isAnimating = true;
        currentSlide = next;

        const progressDuration = 2;

        const timeline = new TimelineLite();
        timeline.to(heroOverlay, progressDuration, {
            x: '-100%',
            autoAlpha: 0
        });
        timeline.to(heroOverlay, progressDuration, {
            x: '0%',
            autoAlpha: .3
        });
        if (next >= current) {
            slideOut(current);
            slideIn(next);
        } else {
            slideOutReversed(current);
            slideInReversed(next);
        }


        TweenLite.to(heroProgress, progressDuration, {
            width: `${(next + 1) * (100 / heroItems.length)}%`,
            onUpdate: function () {
                heroBarWrap.children().each((index, item) => {
                    var tileWidth = $(item).width() * index;
                    if (tileWidth <= heroProgress.width()) {
                        $(item).addClass('hero__bar-item--passed')
                    } else {
                        $(item).removeClass('hero__bar-item--passed')
                    }
                })
            },
            onComplete: function () {
                isAnimating = false;
            }
        }, 0);

    }

    function slideIn(index) {
        const item = heroItems.eq(index);
        const content = heroItems.eq(index).find('.js-hero-content')[0];

        const itemDuration = 2;
        const itemFromParams = {
            autoAlpha: 0,
            x: '100%',
            scale: 0.8,
            transformOrigin: "100% 0%",
            ease: easing
        }
        const itemToParams = {
            autoAlpha: 1,
            x: '0%',
            scale: 1,
            ease: easing,
            zIndex: 10
        }

        const contentDuration = 0.8;
        const contentDelay = 1.5;
        const contentFromParams = {
            autoAlpha: 0,
            scale: 0.9,
            transformOrigin: "100% 50%",
            ease: easing
        }
        const contentToParams = {
            autoAlpha: 1,
            delay: contentDelay,
            scale: 1,
            ease: easing
        }

        TweenLite.fromTo(item, itemDuration, itemFromParams, itemToParams);
        TweenLite.fromTo(content, contentDuration, contentFromParams, contentToParams);
    }

    function slideOut(index) {
        const item = heroItems.eq(index);
        const content = heroItems.eq(index).find('.js-hero-content')[0];

        const itemDuration = 1.5;
        const itemFromParams = {
            autoAlpha: 1,
            scale: 1,
            transformOrigin: "0% 0%",
            ease: easing
        }
        const itemToParams = {
            autoAlpha: 0,
            scale: 0.75,
            ease: easing
        }

        const contentDuration = 0.8;
        const contentFromParams = {
            autoAlpha: 1,
            scale: 1,
            transformOrigin: "100% 50%",
            ease: easing
        }
        const contentToParams = {
            autoAlpha: 0,
            scale: 0.9,
            ease: easing
        }

        TweenLite.fromTo(item, itemDuration, itemFromParams, itemToParams);
        TweenLite.fromTo(content, contentDuration, contentFromParams, contentToParams);
    }

    function slideInReversed(index) {
        const item = heroItems.eq(index);
        const content = heroItems.eq(index).find('.js-hero-content')[0];

        const itemDuration = 2;
        const itemFromParams = {
            autoAlpha: 0,
            x: '-100%',
            scale: 0.8,
            ease: easing
        }
        const itemToParams = {
            autoAlpha: 1,
            x: '0%',
            scale: 1,
            transformOrigin: "0% 100%",
            ease: easing
        }

        const contentDuration = 0.8;
        const contentDelay = 1.5;
        const contentFromParams = {
            autoAlpha: 0,
            scale: 0.9,
            transformOrigin: "100% 50%",
            ease: easing
        }
        const contentToParams = {
            autoAlpha: 1,
            delay: contentDelay,
            scale: 1,
            ease: easing
        }

        TweenLite.fromTo(item, itemDuration, itemFromParams, itemToParams);
        TweenLite.fromTo(content, contentDuration, contentFromParams, contentToParams);
    }

    function slideOutReversed(index) {
        const item = heroItems.eq(index);
        const content = heroItems.eq(index).find('.js-hero-content')[0];

        const itemDuration = 1.5;
        const itemFromParams = {
            autoAlpha: 1,
            scale: 1,
            x: '0%',
            transformOrigin: "100% 0%",
            ease: easing
        }
        const itemToParams = {
            x: '0%',
            autoAlpha: 0,
            scale: 0.75,
            ease: easing
        }

        const contentDuration = 0.8;
        const contentFromParams = {
            autoAlpha: 1,
            scale: 1,
            transformOrigin: "100% 50%",
            ease: easing
        }
        const contentToParams = {
            autoAlpha: 0,
            scale: 0.9,
            ease: easing
        }

        TweenLite.fromTo(item, itemDuration, itemFromParams, itemToParams);
        TweenLite.fromTo(content, contentDuration, contentFromParams, contentToParams);
    }

    function initBgs() {
        heroItems.each(
            (index, item) => {
                const bgImage = $(item).data('bg');
                $(item).css('background-image', `url(${bgImage})`);
            });
    }
});