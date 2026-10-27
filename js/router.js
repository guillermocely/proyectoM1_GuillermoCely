(function (global) {
    "use strict";

    const routes = {
        inicio: { template: "tpl-inicio", title: "Inicio" },
        espacio: { template: "tpl-espacio", title: "Área de trabajo" },
        acerca: { template: "tpl-acerca", title: "Acerca de" }
    };

    let app = null;
    let menuToggle = null;
    let mainNav = null;
    let firstRender = true;

    function parseHash() {
        const raw = (global.location.hash || "").replace(/^#\/?/, "");
        const parts = raw.split("/").filter(Boolean);
        let route = parts[0] || "inicio";

        if (!routes[route]) {
            route = "inicio";
        }

        return {
            route: route,
            sub: parts[1] || ""
        };
    }

    function setActiveNav(route) {
        if (!mainNav) {
            return;
        }

        mainNav.querySelectorAll("[data-nav]").forEach(function (link) {
            const isActive = link.dataset.nav === route;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function closeMenu() {
        if (!mainNav || !menuToggle) {
            return;
        }

        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    }

    function setupSkipLink() {
        const skipLink = document.querySelector(".skip-link");

        if (!skipLink || !app) {
            return;
        }

        skipLink.addEventListener("click", function (event) {
            event.preventDefault();
            app.focus({ preventScroll: true });
            app.scrollIntoView({ block: "start" });
        });
    }

    function setupMenu() {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        });

        mainNav.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                closeMenu();
            }
        });

        document.addEventListener("click", function (event) {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    function setupTabs(activeTab) {
        const tabs = Array.from(app.querySelectorAll("[data-tab]"));
        const panels = Array.from(app.querySelectorAll("[data-panel]"));

        if (!tabs.length || !panels.length) {
            return;
        }

        function updateTabHash(tabName) {
            const target = tabName === "simulador" ? "#/espacio/simulador" : "#/espacio";

            if (global.location.hash === target) {
                return;
            }

            try {
                global.history.replaceState(null, "", target);
            } catch (error) {
                global.location.hash = target;
            }
        }

        function activate(tabName, focusTab, syncHash) {
            tabs.forEach(function (tab) {
                const isActive = tab.dataset.tab === tabName;
                tab.classList.toggle("is-active", isActive);
                tab.setAttribute("aria-selected", String(isActive));
                tab.tabIndex = isActive ? 0 : -1;

                if (isActive && focusTab) {
                    tab.focus();
                }
            });

            panels.forEach(function (panel) {
                const isActive = panel.dataset.panel === tabName;
                panel.classList.toggle("is-active", isActive);
                panel.hidden = !isActive;
            });

            if (syncHash) {
                updateTabHash(tabName);
            }
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener("click", function () {
                activate(tab.dataset.tab, false, true);
            });

            tab.addEventListener("keydown", function (event) {
                let nextIndex = null;

                if (event.key === "ArrowRight") {
                    nextIndex = (index + 1) % tabs.length;
                } else if (event.key === "ArrowLeft") {
                    nextIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (event.key === "Home") {
                    nextIndex = 0;
                } else if (event.key === "End") {
                    nextIndex = tabs.length - 1;
                }

                if (nextIndex !== null) {
                    event.preventDefault();
                    activate(tabs[nextIndex].dataset.tab, true, true);
                }
            });
        });

        activate(activeTab === "simulador" ? "simulador" : "paleta", false, false);
    }

    function render() {
        if (!app) {
            return;
        }

        const parsed = parseHash();
        const config = routes[parsed.route];
        const template = document.getElementById(config.template);

        if (!template) {
            return;
        }

        app.innerHTML = "";
        app.appendChild(template.content.cloneNode(true));
        document.title = config.title + " | Paleta de Colores";
        setActiveNav(parsed.route);
        closeMenu();

        if (parsed.route === "espacio") {
            setupTabs(parsed.sub);
            if (global.AppPalette) {
                global.AppPalette.init();
            }
            if (global.AppSimulator) {
                global.AppSimulator.init();
            }
        }

        window.scrollTo(0, 0);

        if (!firstRender) {
            app.focus({ preventScroll: true });
        }

        firstRender = false;
    }

    function normalizeHash() {
        const hash = global.location.hash;
        const firstSegment = hash.replace(/^#\/?/, "").split("/")[0];

        if (!hash || hash === "#" || hash.indexOf("#/") !== 0 || !routes[firstSegment]) {
            try {
                global.history.replaceState(null, "", "#/inicio");
            } catch (error) {
                global.location.hash = "#/inicio";
            }
        }
    }

    function start() {
        app = document.getElementById("app");
        menuToggle = document.getElementById("menuToggle");
        mainNav = document.getElementById("mainNav");

        if (!app || !menuToggle || !mainNav) {
            return;
        }

        setupMenu();
        setupSkipLink();
        normalizeHash();
        global.addEventListener("hashchange", render);
        render();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})(window);
