'use strict';

define('app', ['jquery', 'fastclick'], function ($, FastClick) {
    'use strict';

    FastClick.attach(document.body);

    require(['app/counters']);

    (function ($substrate) {
        if (!$substrate.length) {
            return;
        }

        $(function () {
            require(['apartments/app'], function (app) {
                app.run(window.location.pathname);
            });
        });
    })($('#substrate'));

    (function ($forms) {
        if (!$forms.length) {
            return;
        }

        var initForms = function initForms(Form) {
            $forms.each(function () {
                var form = new Form($(this));
                form.init();
            });
        };

        require(['app/form'], initForms);
    })($('form').filter(':not([data-noinit])'));

    //Подключение попапа
    (function ($popupLinks) {
        if (!$popupLinks.length) {
            return;
        }

        var hash = window.location.hash;

        require(['app/popup'], function (Popup) {
            $popupLinks.each(function () {
                var popup = new Popup($(this));
                popup.initPopup();

                if ($(this).attr('href') === hash) {
                    popup.showPopup($(this));
                }
            });
        });
    })($('.j-popup'));

    // Подключение галерей
    (function ($gallerys) {
        if (!$gallerys.length) {
            return;
        }

        require(['app/gallery'], function (Gallery) {
            $gallerys.each(function () {
                return new Gallery($(this));
            });
        });
    })($('.j-gallery'));

    //Анимированный label
    (function ($animLabels) {
        if (!$animLabels.length) {
            return;
        }

        require(['app/animated-label'], function (AnimatedLabel) {
            $animLabels.each(function () {
                var label = new AnimatedLabel($(this));
                label.init();
            });
        });
    })($('.j-anim-label'));

    // Стилизация селекта
    (function ($selects) {
        if (!$selects.length) {
            return;
        }

        require(['select'], function () {
            $selects.each(function () {
                var $select = $(this);
                $select.selectric({
                    disableOnMobile: false
                });
            });
        });
    })($('select'));

    // Табы
    (function ($tabContainer) {
        if (!$tabContainer.length) {
            return;
        }

        require(['app/tabs'], function (Tabs) {
            return new Tabs($tabContainer);
        });
    })($('.j-tabs'));

    //Инициализация карты
    (function ($maps) {
        if (!$maps.length) {
            return;
        }

        require(['app/map'], function (Map) {
            $maps.each(function () {
                return new Map($(this));
            });
        });
    })($('.j-map'));

    // Ход строительства
    (function ($constructionProgress) {
        if (!$constructionProgress.length) {
            return;
        }

        require(['app/construction-progress'], function (ConstructionsProgress) {
            return new ConstructionsProgress($constructionProgress);
        });
    })($('.j-construction-progress'));

    // Range slider
    (function ($sliders) {
        if (!$sliders.length) {
            return;
        }

        require(['app/range-slider'], function (RangeSlider) {
            $sliders.each(function () {
                return new RangeSlider($(this));
            });
        });
    })($('.j-range-sliders'));

    // Страница поиска
    (function ($search) {
        if (!$search.length) {
            return;
        }

        require(['app/search-filter'], function (SearchFilter) {
            return new SearchFilter($search);
        });
    })($('.j-search-filter'));

    // Результаты поиска
    (function ($searchResult) {
        if (!$searchResult.length) {
            return;
        }

        require(['app/search-result'], function (SearchResult) {
            return new SearchResult($searchResult);
        });
    })($('.j-search-result'));

    // Ипотека
    (function ($mortgage) {
        if (!$mortgage.length) {
            return;
        }

        require(['app/mortgage'], function (Mortgage) {
            return new Mortgage($mortgage);
        });
    })($('.j-mortgage'));

    // Избранное
    (function ($favorite) {
        if (!$favorite.length) {
            return;
        }

        require(['app/favorite'], function (Favorite) {
            return new Favorite();
        });
    })($('.j-favorite'));

    (function ($showBtnUp) {
        if (!$showBtnUp.length) {
            return;
        }

        var didScroll;
        var lastScrollTop = 0;
        var delta = 10; // Когда скролл не считается
        var showPos = 60; // when btn is show. offset of top window
        var scrollUp = 'is-nav-up';

        $showBtnUp.click(function () {
            $('body, html').animate({ scrollTop: 0 }, 'slow');
        });

        $(window).scroll(function () {
            // jshint ignore:line
            didScroll = true;
        });

        function hasScrolled() {
            var curPos = $(window).scrollTop();
            if (Math.abs(lastScrollTop - curPos) <= delta) {
                return; // Return the absolute value of a number
            }
            // если упирается вниз, то появляется кнопка
            if (curPos + $(window).height() + showPos >= $(document).height()) {
                $showBtnUp.addClass(scrollUp);
            } else if (curPos > lastScrollTop || curPos < showPos) {
                // Скролл вниз
                $showBtnUp.removeClass(scrollUp);
            } else {
                //Скролл вверх
                if (curPos + $(window).height() < $(document).height()) {
                    $showBtnUp.addClass(scrollUp);
                }
            }
            lastScrollTop = curPos;
        }

        // Функция проверки скроллинга каждые 250ms, уменьшает
        // нагрузку, как если бы при проверки каждого пикселя.
        setInterval(function () {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 150);
    })($('.j-show-up'));

    return {};
});