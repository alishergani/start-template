$(document).ready(function () {
    const portraits = $('.js-portraits');
    const portraitsWrap = $('.js-portraits-wrap');
    const portraitsEnabled = false;
    if (portraits.length && portraitsEnabled)  {
        initPortraits();

        $(window).resize(function () {
            initPortraits();
        });
    }

    function initPortraits() {
        portraitsWrap.each((index, item) => {
            $(item).height($(portraits.eq(index)).height());
            $(portraits).css('position', 'absolute');
            var minX = $(item).width() - $(portraits.eq(index)).width();
            if (minX > 0) {
                minX = 0
            }
            Draggable.create($(item), {
                dragClickables: true,
                type: 'x',
                edgeResistance: 0.25,
                dragResistance: 0.35,
                bounds: {
                    maxX: 0,
                    minX: minX
                }
            });
        });
    }
});
