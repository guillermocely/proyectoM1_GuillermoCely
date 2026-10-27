(function (global) {
    "use strict";

    const Color = global.AppColor;
    const Store = global.AppStore;
    const UI = global.AppUI;

    const HARMONIES = {
        aleatorio: {
            hint: "Matiz base aleatorio con una ventana limitada para que la paleta no se disperse.",
            offsets: null,
            window: 78,
            tolerance: 6
        },
        monocromatico: {
            hint: "Un solo matiz con variaciones de luz y saturación.",
            offsets: [0],
            tolerance: 2
        },
        analogo: {
            hint: "Matices vecinos en la rueda, dentro de una ventana de 60 grados.",
            offsets: [-30, -15, 0, 15, 30],
            tolerance: 4
        },
        complementario: {
            hint: "El color base y su complemento, separados 180 grados.",
            offsets: [0, 180],
            tolerance: 6
        },
        "complementario-dividido": {
            hint: "El color base y los dos vecinos de su complemento, a 150 y 210 grados.",
            offsets: [0, 150, 210],
            tolerance: 5
        },
        triadico: {
            hint: "Tres familias separadas 120 grados en la rueda.",
            offsets: [0, 120, 240],
            tolerance: 4
        },
        tetradico: {
            hint: "Cuatro familias en rectángulo: 0, 60, 180 y 240 grados.",
            offsets: [0, 60, 180, 240],
            tolerance: 4
        },
        cuadrado: {
            hint: "Cuatro familias separadas 90 grados.",
            offsets: [0, 90, 180, 270],
            tolerance: 3
        }
    };

    const LIGHTNESS_STEPS = {
        1: [50],
        2: [40, 64],
        3: [34, 50, 66],
        4: [28, 42, 56, 70],
        5: [26, 36, 46, 56, 68],
        6: [24, 34, 44, 54, 64, 74],
        7: [22, 30, 38, 46, 54, 62, 70],
        8: [20, 28, 36, 44, 52, 60, 68, 76],
        9: [18, 26, 34, 42, 50, 58, 66, 74, 82]
    };

    let elements = null;
    let currentPalette = [];
    let selected = new Set();
    let showingFavorites = false;

    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function buildLightnessSteps(total) {
        if (total <= 1) {
            return [50];
        }

        const steps = [];
        for (let index = 0; index < total; index += 1) {
            steps.push(20 + (index / (total - 1)) * 60);
        }
        return steps;
    }

    function uniqueColor(hue, saturation, lightness, used, tolerance) {
        const maxHueShift = Math.max(tolerance, 2) + 3;

        for (let attempt = 0; attempt < 80; attempt += 1) {
            const direction = attempt % 2 === 0 ? 1 : -1;
            const hueShift = direction * Math.min(maxHueShift, Math.ceil(attempt / 2) * 0.7);
            const saturationShift = ((attempt % 5) - 2) * 1.6;
            const lightnessShift = ((attempt % 7) - 3) * 1.3;
            const h = Color.wrapHue(hue + hueShift);
            const s = Color.clamp(saturation + saturationShift, 48, 98);
            const l = Color.clamp(lightness + lightnessShift, 18, 88);
            const hex = Color.hslToHex(h, s, l);

            if (!used.has(hex)) {
                used.add(hex);
                return { hex: hex, h: h, s: s, l: l };
            }
        }

        let fallbackHue = Color.wrapHue(hue + 12);
        let fallbackHex = Color.hslToHex(fallbackHue, saturation, lightness);
        let guard = 0;

        while (used.has(fallbackHex) && guard < 360) {
            fallbackHue = Color.wrapHue(fallbackHue + 1);
            fallbackHex = Color.hslToHex(fallbackHue, saturation, lightness);
            guard += 1;
        }

        used.add(fallbackHex);
        return { hex: fallbackHex, h: fallbackHue, s: saturation, l: lightness };
    }

    function buildSlots(count, groupCount) {
        const totals = new Array(groupCount).fill(0);
        const groupOf = [];

        for (let index = 0; index < count; index += 1) {
            const group = index % groupCount;
            groupOf.push(group);
            totals[group] += 1;
        }

        const counters = new Array(groupCount).fill(0);
        return groupOf.map(function (group) {
            const local = counters[group];
            counters[group] += 1;
            return { group: group, local: local, total: totals[group] };
        });
    }

    function generatePalette(count, harmonyKey) {
        const config = HARMONIES[harmonyKey] || HARMONIES.aleatorio;
        const baseHue = randomBetween(0, 360);
        const baseSaturation = randomBetween(72, 92);
        const used = new Set();
        const colors = [];
        let slots;

        if (config.offsets) {
            slots = buildSlots(count, config.offsets.length);
        } else {
            const windowSize = randomBetween(58, 84);
            slots = [];
            for (let index = 0; index < count; index += 1) {
                const ratio = count <= 1 ? 0.5 : index / (count - 1);
                slots.push({
                    group: 0,
                    local: index,
                    total: count,
                    randomHue: baseHue - windowSize / 2 + ratio * windowSize
                });
            }
        }

        slots.forEach(function (slot) {
            let hue;
            let saturation;
            let lightness;

            if (config.offsets) {
                const offset = config.offsets[slot.group];
                hue = Color.wrapHue(baseHue + offset + randomBetween(-config.tolerance, config.tolerance));
                saturation = baseSaturation + randomBetween(-5, 5);
            } else {
                hue = Color.wrapHue(slot.randomHue + randomBetween(-3, 3));
                saturation = randomBetween(68, 94);
            }

            if (harmonyKey === "monocromatico") {
                saturation = randomBetween(56, 92);
            }

            const steps = LIGHTNESS_STEPS[slot.total] || buildLightnessSteps(slot.total);
            lightness = Color.clamp(steps[slot.local] + randomBetween(-1.4, 1.4), 18, 86);
            saturation = Color.clamp(saturation, 52, 98);

            colors.push(uniqueColor(hue, saturation, lightness, used, config.tolerance));
        });

        colors.sort(function (first, second) {
            if (Math.abs(first.h - second.h) > 0.001) {
                return first.h - second.h;
            }
            return first.l - second.l;
        });

        return colors.map(function (color) {
            const formatted = Color.formatColor(color.hex);
            return {
                hex: formatted.hex,
                rgb: formatted.rgb,
                hsl: formatted.hsl,
                h: formatted.h,
                s: formatted.s,
                l: formatted.l
            };
        });
    }

    function getSelectedFormat() {
        return elements && elements.formato ? elements.formato.value : "hex";
    }

    function updateFormatHighlight() {
        if (!elements) {
            return;
        }

        const format = getSelectedFormat();
        elements.grid.querySelectorAll(".format-row").forEach(function (row) {
            const isPrimary = row.dataset.format === format;
            row.classList.toggle("is-primary", isPrimary);
            row.setAttribute("aria-current", isPrimary ? "true" : "false");
        });
    }

    function updateHarmonyHint() {
        if (!elements) {
            return;
        }

        const config = HARMONIES[elements.armonia.value] || HARMONIES.aleatorio;
        elements.hint.textContent = config.hint;
    }

    function updateGhostColor() {
        if (!currentPalette.length) {
            return;
        }

        const index = Math.floor(currentPalette.length / 2);
        document.documentElement.style.setProperty("--ghost-color", currentPalette[index].hex);
    }

    function createPaletteCard(color, index, previousBackground, animate) {
        const card = document.createElement("article");
        const isSelected = selected.has(color.hex);
        const contrast = Color.getContrastColor(color.hex);

        card.className = "palette-card";
        card.dataset.bg = color.hex;
        card.style.color = contrast;
        card.style.backgroundColor = animate && previousBackground ? previousBackground : color.hex;

        card.innerHTML =
            '<div class="palette-card-top">' +
                '<span class="palette-index">' + String(index + 1).padStart(2, "0") + "</span>" +
                '<button class="icon-btn" type="button" data-action="select" data-hex="' + color.hex + '" aria-pressed="' + String(isSelected) + '" aria-label="Guardar ' + color.hex + ' en favoritos">★</button>' +
            "</div>" +
            '<div class="palette-formats">' +
                '<button class="format-row" type="button" data-action="copy" data-format="hex" data-name="HEX" data-value="' + color.hex + '"><span>HEX</span><strong>' + color.hex + "</strong></button>" +
                '<button class="format-row" type="button" data-action="copy" data-format="hsl" data-name="HSL" data-value="' + color.hsl + '"><span>HSL</span><strong>' + color.hsl + "</strong></button>" +
                '<button class="format-row" type="button" data-action="copy" data-format="rgb" data-name="RGB" data-value="' + color.rgb + '"><span>RGB</span><strong>' + color.rgb + "</strong></button>" +
            "</div>";

        return card;
    }

    function renderCards(colors, animate) {
        if (!elements) {
            return;
        }

        const previous = Array.from(elements.grid.querySelectorAll(".palette-card")).map(function (card) {
            return card.dataset.bg;
        });

        elements.grid.innerHTML = "";

        colors.forEach(function (color, index) {
            const card = createPaletteCard(color, index, previous[index], animate);
            elements.grid.appendChild(card);

            if (animate) {
                const delay = index * 65;

                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        if (!document.body.contains(card)) {
                            return;
                        }

                        card.style.transitionDelay = delay + "ms";
                        card.classList.add("is-animating");
                        card.style.backgroundColor = color.hex;

                        setTimeout(function () {
                            card.style.transitionDelay = "";
                            card.classList.remove("is-animating");
                        }, 560 + delay);
                    });
                });
            }
        });

        updateFormatHighlight();
    }

    function renderPalette(animate) {
        if (!elements) {
            return;
        }

        const count = parseInt(elements.tamaño.value, 10) || 6;
        const harmony = elements.armonia.value;
        currentPalette = generatePalette(count, harmony);
        showingFavorites = false;
        elements.title.textContent = "Colores generados";
        elements.count.textContent = count + " colores";
        elements.favoritosButton.textContent = "Favoritos";
        elements.favoritosButton.classList.remove("is-active-view");
        renderCards(currentPalette, Boolean(animate));
        updateFormatHighlight();
        updateGhostColor();
    }

    function renderFavorites() {
        if (!elements) {
            return;
        }

        const favorites = Store.getFavorites();
        showingFavorites = true;
        elements.title.textContent = "Favoritos";
        elements.count.textContent = favorites.length + (favorites.length === 1 ? " guardado" : " guardados");
        elements.favoritosButton.textContent = "Volver a la paleta";
        elements.favoritosButton.classList.add("is-active-view");
        elements.grid.innerHTML = "";

        if (!favorites.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "Aún no hay colores guardados. Marca la estrella de un color y pulsa Guardar seleccionados.";
            elements.grid.appendChild(empty);
            return;
        }

        favorites.forEach(function (favorite, index) {
            const formatted = Color.formatColor(favorite.hex);
            const card = document.createElement("article");
            card.className = "palette-card favorite-card";
            card.dataset.bg = formatted.hex;
            card.style.color = Color.getContrastColor(formatted.hex);
            card.style.backgroundColor = formatted.hex;

            card.innerHTML =
                '<div class="palette-card-top">' +
                    '<span class="palette-index">FAV ' + String(index + 1).padStart(2, "0") + "</span>" +
                    '<button class="icon-btn" type="button" data-action="remove" data-hex="' + formatted.hex + '" aria-label="Eliminar ' + formatted.hex + ' de favoritos">×</button>' +
                "</div>" +
                '<div class="palette-formats">' +
                    '<button class="format-row is-primary" type="button" data-action="copy" data-format="hex" data-name="HEX" data-value="' + formatted.hex + '"><span>HEX</span><strong>' + formatted.hex + "</strong></button>" +
                    '<button class="format-row" type="button" data-action="copy" data-format="hsl" data-name="HSL" data-value="' + formatted.hsl + '"><span>HSL</span><strong>' + formatted.hsl + "</strong></button>" +
                    '<button class="format-row" type="button" data-action="copy" data-format="rgb" data-name="RGB" data-value="' + formatted.rgb + '"><span>RGB</span><strong>' + formatted.rgb + "</strong></button>" +
                "</div>" +
                '<div class="favorite-actions">' +
                    '<button class="btn btn-ghost btn-sm" type="button" data-action="copy" data-name="HEX" data-value="' + formatted.hex + '">Copiar</button>' +
                "</div>";

            elements.grid.appendChild(card);
        });
    }

    function toggleSelected(hex) {
        if (selected.has(hex)) {
            selected.delete(hex);
            UI.showMessage("Color quitado de la selección");
        } else {
            selected.add(hex);
            UI.showMessage("Color agregado a la selección");
        }

        elements.grid.querySelectorAll('[data-action="select"]').forEach(function (button) {
            if (button.dataset.hex === hex) {
                button.setAttribute("aria-pressed", String(selected.has(hex)));
            }
        });
    }

    function saveSelected() {
        if (!selected.size) {
            UI.showMessage("Marca al menos un color con la estrella");
            return;
        }

        const colors = Array.from(selected).map(function (hex) {
            return { hex: hex };
        });
        const added = Store.addFavorites(colors);

        selected.clear();
        elements.grid.querySelectorAll('[data-action="select"]').forEach(function (button) {
            button.setAttribute("aria-pressed", "false");
        });

        if (added > 0) {
            UI.showMessage(added === 1 ? "1 color guardado en favoritos" : added + " colores guardados en favoritos");
        } else {
            UI.showMessage("Esos colores ya estaban en favoritos");
        }
    }

    function handleGridClick(event) {
        const button = event.target.closest("[data-action]");
        if (!button || !elements.grid.contains(button)) {
            return;
        }

        const action = button.dataset.action;

        if (action === "copy") {
            UI.showCopied({
                name: button.dataset.name || "Color",
                value: button.dataset.value || ""
            });
            return;
        }

        if (action === "select") {
            toggleSelected(button.dataset.hex);
            return;
        }

        if (action === "remove") {
            const removed = Store.removeFavorite(button.dataset.hex);
            if (removed) {
                renderFavorites();
                UI.showMessage("Color eliminado de favoritos");
            }
        }
    }

    function bindEvents() {
        elements.generar.addEventListener("click", function () {
            renderPalette(true);
            UI.showMessage("Nueva paleta generada");
        });

        elements.guardar.addEventListener("click", saveSelected);

        elements.favoritosButton.addEventListener("click", function () {
            if (showingFavorites) {
                renderPalette(false);
            } else {
                renderFavorites();
            }
        });

        elements.grid.addEventListener("click", handleGridClick);

        elements.tamaño.addEventListener("change", function () {
            renderPalette(true);
            UI.showMessage("Tamaño: " + elements.tamaño.value + " colores");
        });

        elements.formato.addEventListener("change", function () {
            updateFormatHighlight();
            UI.showMessage("Formato activo: " + elements.formato.value.toUpperCase());
        });

        elements.armonia.addEventListener("change", function () {
            updateHarmonyHint();
            renderPalette(true);
            const option = elements.armonia.options[elements.armonia.selectedIndex];
            UI.showMessage("Armonía: " + option.text);
        });
    }

    function init() {
        elements = {
            tamaño: document.getElementById("selectorTamaño"),
            formato: document.getElementById("selectorFormato"),
            armonia: document.getElementById("selectorArmonia"),
            generar: document.getElementById("botonGenerar"),
            guardar: document.getElementById("botonGuardar"),
            favoritosButton: document.getElementById("botonVerFavoritos"),
            grid: document.getElementById("gridColores"),
            title: document.getElementById("paletteTitle"),
            count: document.getElementById("paletteCount"),
            hint: document.getElementById("harmonyHint")
        };

        if (!elements.grid || !elements.tamaño || !elements.armonia) {
            elements = null;
            return;
        }

        selected = new Set();
        showingFavorites = false;
        updateHarmonyHint();
        bindEvents();
        renderPalette(false);
    }

    global.addEventListener("favorites:changed", function () {
        if (elements && showingFavorites && document.body.contains(elements.grid)) {
            renderFavorites();
        }
    });

    global.AppPalette = {
        init: init,
        generate: generatePalette,
        getHarmonies: function () {
            return Object.keys(HARMONIES).map(function (key) {
                return { key: key, hint: HARMONIES[key].hint, offsets: HARMONIES[key].offsets };
            });
        }
    };
})(window);
