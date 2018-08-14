$(document).ready(function () {
    const calendarTiles = $('.js-calendar-tile');
    const caledarSliders = $('.js-calendar-slider');
    const calendarDots = $('.js-dots');
    const calendarPlacement = $('.js-calendar-placement');

    initTiles();
    initSliders();
    function initTiles() {
        calendarTiles.each((index, item) => {
            if ($(item).hasClass('active')) {
                setTileBg(item, 0)
            }
            $(item).click(function () {
                var currentSlide = $(item).children('.js-calendar-slider-wrap').children('.js-calendar-slider').data('current-slide');
                createPlacement(item, currentSlide)
                setTileBg(item, currentSlide);
                setActiveDot(item, currentSlide);
            });
            setActiveDot(item, 0);
        })
    }
    function initSliders() {
        caledarSliders.each((index, item) => {
            $(item).data('current-slide', 0);
            initSwipes();
        })
    }
    function createPlacement(item, index) {
        var itemPlacement = $(item).clone();
        var bg = getItemBg(item, index);
        console.log(itemPlacement.children('.js-calendar-tile')
            .children('.js-calendar-slider-wrap')
            .children('.js-calendar-slider'))
       
        itemPlacement
            .children('.js-calendar-slider-wrap')
            .children('.js-calendar-slider')
            .each((index, item) => {
                $(item).data('current-slide', 0);
                $(item).width($(item).children().length * 100 + '%');
                var swipeOptions =
                    {
                        swipeLeft: function () {
                            nextTile(item);
                        },
                        swipeRight: function () {
                            previousTile(item);
                        },
                        threshold: 0,
                        allowPageScroll: "auto"
                    };
                $(item).swipe(swipeOptions);
            })

        calendarPlacement.css('background-image', `url(${bg})`);
        calendarPlacement.html(itemPlacement);
    }
    function initSwipes() {
        caledarSliders.each((index, item) => {
            $(item).width($(item).children().length * 100 + '%');
            var swipeOptions =
                {
                    swipeLeft: function () {
                        nextTile(item)
                    },
                    swipeRight: function () {
                        previousTile(item)
                    },
                    threshold: 0,
                    allowPageScroll: "auto"
                };
            $(item).swipe(swipeOptions);
        })
    }
    function previousTile(item) {
        var current = $(item).data('current-slide');
        if (current > 0) {
            current--;
            $(item).data('current-slide', current);
            $(item).css('left', `${-current * 100}%`);
            var tile = $(item).parent().parent();
            setTileBg(tile, current);
            setActiveDot(tile, current);
        }
    }
    function nextTile(item) {
        var current = $(item).data('current-slide');
        var maxLength = $(item).children().length;
        if (current < maxLength - 1) {
            current++;
            $(item).data('current-slide', current);
            $(item).css('left', `${-current * 100}%`);
            var tile = $(item).parent().parent();
            setTileBg(tile, current);
            setActiveDot(tile, current);
        }
    }
    function setTileBg(item, index) {
        unsetAllBg();
        var bg = getItemBg(item, index);
        var placement = $(item).parent('.js-calendar-placement');
        if(placement){
            placement.css('background-image', `url(${bg})`);
        }
        $(item).css('background-image', `url(${bg})`);
        $(item).addClass('active');
    }
    function getItemBg(item, index) {
        return $(item)
            .children('.js-calendar-slider-wrap')
            .children('.js-calendar-slider')
            .children('.js-calendar-content')
            .addClass('selected')
            .eq(index)
            .addClass('selected')
            .data('bg');
    }
    function unsetAllBg() {
        calendarTiles.each((index, item) => {
            $(item).css('background-image', `none`);
            $(item).removeClass('active')
        })
    }
    function setActiveDot(tile, index) {
        $(tile)
            .children('.js-dots')
            .children('.js-dot')
            .removeClass('active')
            .eq(index)
            .addClass('active')
    }
});