'use strict';

// Закрываем / показываем меню.
(function () {
    var nav = document.getElementById('nav-doc');

    nav.addEventListener('click', function (event) {
        var target = event.target;
        var subMenu = '';

        function toggleSubmenu() {
            var targetChild = target.closest('li').childNodes;
            for (var i = 0; i < targetChild.length; i++) {
                if (targetChild[i].nodeName.toLowerCase() === 'ul') {
                    subMenu = targetChild[i];
                    break;
                }
            }

            if (!subMenu) {
                return;
            }

            subMenu.classList.toggle('is-close-submenu');
        }
        toggleSubmenu();
    });
})();