(function (global) {
    "use strict";

    const STORAGE_KEY = "favoritosColores";
    let favorites = null;

    function normalizeColor(color) {
        if (!color || typeof color.hex !== "string") {
            return null;
        }

        const hex = global.AppColor.normalizeHex(color.hex);
        if (!/^#[0-9a-f]{6}$/.test(hex)) {
            return null;
        }

        return { hex: hex };
    }

    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
            return false;
        }
        return true;
    }

    function notify() {
        global.dispatchEvent(new CustomEvent("favorites:changed", {
            detail: { favorites: getFavorites() }
        }));
    }

    function load() {
        if (favorites !== null) {
            return getFavorites();
        }

        favorites = [];

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            if (Array.isArray(parsed)) {
                const seen = new Set();
                favorites = parsed.map(normalizeColor).filter(function (color) {
                    if (!color || seen.has(color.hex)) {
                        return false;
                    }
                    seen.add(color.hex);
                    return true;
                });
            }
        } catch (error) {
            favorites = [];
        }

        return getFavorites();
    }

    function getFavorites() {
        if (favorites === null) {
            return load();
        }
        return favorites.map(function (color) {
            return { hex: color.hex };
        });
    }

    function hasFavorite(hex) {
        const normalized = global.AppColor.normalizeHex(hex);
        return getFavorites().some(function (color) {
            return color.hex === normalized;
        });
    }

    function addFavorites(colors) {
        load();
        const seen = new Set(favorites.map(function (color) {
            return color.hex;
        }));
        let added = 0;

        (colors || []).forEach(function (color) {
            const normalized = normalizeColor(color);
            if (normalized && !seen.has(normalized.hex)) {
                seen.add(normalized.hex);
                favorites.push(normalized);
                added += 1;
            }
        });

        if (added > 0) {
            persist();
            notify();
        }

        return added;
    }

    function removeFavorite(hex) {
        load();
        const normalized = global.AppColor.normalizeHex(hex);
        const before = favorites.length;
        favorites = favorites.filter(function (color) {
            return color.hex !== normalized;
        });

        if (favorites.length !== before) {
            persist();
            notify();
            return true;
        }

        return false;
    }

    function clearFavorites() {
        favorites = [];
        persist();
        notify();
    }

    global.AppStore = {
        load: load,
        getFavorites: getFavorites,
        hasFavorite: hasFavorite,
        addFavorites: addFavorites,
        removeFavorite: removeFavorite,
        clearFavorites: clearFavorites
    };
})(window);
