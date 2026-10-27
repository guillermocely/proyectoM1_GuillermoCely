(function (global) {
    "use strict";

    const STORAGE_KEY = "tema";
    const DARK_THEME_COLOR = "#080b16";
    const LIGHT_THEME_COLOR = "#f7f8ff";
    const root = document.documentElement;
    let toggleButton = null;
    let systemQuery = null;

    function normalize(theme) {
        return theme === "light" ? "light" : "dark";
    }

    function getStoredTheme() {
        try {
            const stored = global.localStorage.getItem(STORAGE_KEY);
            return stored === "light" || stored === "dark" ? stored : null;
        } catch (error) {
            return null;
        }
    }

    function getSystemTheme() {
        return global.matchMedia && global.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }

    function updateMeta(theme) {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", theme === "light" ? LIGHT_THEME_COLOR : DARK_THEME_COLOR);
        }
    }

    function updateButton(theme) {
        if (!toggleButton) {
            return;
        }

        const label = theme === "light" ? "Cambiar a tema oscuro" : "Cambiar a tema claro";
        toggleButton.setAttribute("aria-label", label);
        toggleButton.setAttribute("title", label);
    }

    function applyTheme(theme, persist) {
        const normalized = normalize(theme);
        root.setAttribute("data-theme", normalized);
        updateButton(normalized);
        updateMeta(normalized);

        if (persist) {
            try {
                global.localStorage.setItem(STORAGE_KEY, normalized);
            } catch (error) {
                return;
            }
        }
    }

    function toggleTheme() {
        const current = normalize(root.getAttribute("data-theme"));
        applyTheme(current === "light" ? "dark" : "light", true);
    }

    function init() {
        toggleButton = document.getElementById("themeToggle");
        applyTheme(root.getAttribute("data-theme") || getStoredTheme() || getSystemTheme(), false);

        if (toggleButton) {
            toggleButton.addEventListener("click", toggleTheme);
        }

        if (global.matchMedia) {
            systemQuery = global.matchMedia("(prefers-color-scheme: light)");
            const handleSystemChange = function (event) {
                if (!getStoredTheme()) {
                    applyTheme(event.matches ? "light" : "dark", false);
                }
            };

            if (typeof systemQuery.addEventListener === "function") {
                systemQuery.addEventListener("change", handleSystemChange);
            } else if (typeof systemQuery.addListener === "function") {
                systemQuery.addListener(handleSystemChange);
            }
        }
    }

    global.AppTheme = {
        apply: function (theme) {
            applyTheme(theme, true);
        },
        current: function () {
            return normalize(root.getAttribute("data-theme"));
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})(window);
