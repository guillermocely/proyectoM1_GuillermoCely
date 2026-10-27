(function (global) {
    "use strict";

    const Color = global.AppColor;
    const Store = global.AppStore;
    const UI = global.AppUI;

    let elements = null;
    let selected = [];
    let currentBackground = null;
    let lastSection = null;

    function getSectionElement(section) {
        if (!elements || !elements.preview) {
            return null;
        }

        const selectors = {
            navbar: ".barra-navegacion-previa",
            aside: ".barra-lateral-previa",
            content: ".contenido-previo",
            footer: ".pie-pagina-previo"
        };

        return elements.preview.querySelector(selectors[section] || selectors.navbar);
    }

    function getSectionLabel(section) {
        const labels = {
            navbar: "la barra de navegación",
            aside: "la barra lateral",
            content: "el contenido",
            footer: "el pie de página"
        };
        return labels[section] || "la sección";
    }

    function getFilterString() {
        if (!elements) {
            return "none";
        }

        const contrast = parseInt(elements.contraste.value, 10) / 100;
        const brightness = parseInt(elements.luminosidad.value, 10) / 100;
        const saturation = parseInt(elements.intensidad.value, 10) / 100;
        return "contrast(" + contrast + ") brightness(" + brightness + ") saturate(" + saturation + ")";
    }

    function updateFilterLabels() {
        if (!elements) {
            return;
        }

        elements.contrasteValue.textContent = elements.contraste.value + "%";
        elements.luminosidadValue.textContent = elements.luminosidad.value + "%";
        elements.intensidadValue.textContent = elements.intensidad.value + "%";
    }

    function resetFilterValues() {
        if (!elements) {
            return;
        }

        elements.contraste.value = 100;
        elements.luminosidad.value = 100;
        elements.intensidad.value = 100;
        updateFilterLabels();
    }

    function renderFavorites() {
        if (!elements) {
            return;
        }

        const favorites = Store.getFavorites();
        const validHexes = new Set(favorites.map(function (favorite) {
            return favorite.hex;
        }));
        selected = selected.filter(function (hex) {
            return validHexes.has(hex);
        });

        elements.favoritesGrid.innerHTML = "";

        if (!favorites.length) {
            const empty = document.createElement("p");
            empty.className = "empty-state";
            empty.textContent = "Todavía no hay favoritos. Genera una paleta y guarda los colores que te gusten.";
            elements.favoritesGrid.appendChild(empty);
            return;
        }

        favorites.forEach(function (favorite) {
            const button = document.createElement("button");
            const isSelected = selected.indexOf(favorite.hex) !== -1;

            button.type = "button";
            button.className = "favorite-swatch" + (isSelected ? " is-selected" : "");
            button.dataset.hex = favorite.hex;
            button.style.setProperty("--swatch", favorite.hex);
            button.style.color = Color.getContrastColor(favorite.hex);
            button.setAttribute("aria-pressed", String(isSelected));
            button.setAttribute("aria-label", "Seleccionar color " + favorite.hex);
            button.innerHTML = "<span>" + favorite.hex + "</span>";

            elements.favoritesGrid.appendChild(button);
        });
    }

    function syncSelectionButtons() {
        if (!elements) {
            return;
        }

        elements.favoritesGrid.querySelectorAll(".favorite-swatch").forEach(function (button) {
            const isSelected = selected.indexOf(button.dataset.hex) !== -1;
            button.classList.toggle("is-selected", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });
    }

    function setCanvasBackground(background) {
        if (!elements) {
            return;
        }

        elements.canvas.style.filter = "none";
        elements.canvas.style.background = "";
        elements.canvas.style.backgroundColor = "";

        if (!background) {
            elements.canvas.style.background = "rgba(255, 255, 255, 0.07)";
            const placeholder = document.createElement("p");
            placeholder.className = "placeholder";
            placeholder.textContent = "Selecciona colores y genera CSS";
            elements.canvas.innerHTML = "";
            elements.canvas.appendChild(placeholder);
            return;
        }

        const placeholder = elements.canvas.querySelector(".placeholder");
        if (placeholder) {
            placeholder.remove();
        }

        elements.canvas.style.background = background.canvasBackground;
        elements.canvas.style.filter = getFilterString();
    }

    function setTextColors(element, baseHex) {
        if (!element) {
            return;
        }

        const contrast = Color.getContrastColor(baseHex);
        element.querySelectorAll("h1, h2, h3, p, a, li, span").forEach(function (node) {
            node.style.color = contrast;
        });
    }

    function applyElementBackground(element, background) {
        if (!element) {
            return;
        }

        element.style.background = "";
        element.style.backgroundColor = "";
        element.style.backgroundImage = "";

        if (background.type === "combined") {
            element.style.backgroundColor = background.color;
            element.style.backgroundImage = background.image;
        } else {
            element.style.background = background.value;
        }

        element.style.filter = getFilterString();
        setTextColors(element, background.baseHex);
    }

    function applyToSection() {
        if (!currentBackground || !lastSection) {
            return;
        }

        applyElementBackground(getSectionElement(lastSection), currentBackground);
    }

    function toggleFavorite(hex) {
        const index = selected.indexOf(hex);

        if (index === -1) {
            selected.push(hex);
            UI.showMessage("Color seleccionado");
        } else {
            selected.splice(index, 1);
            UI.showMessage("Color quitado de la selección");
        }

        syncSelectionButtons();
        resetFilterValues();

        if (selected.length) {
            setCanvasBackground({
                type: "solid",
                value: selected[0],
                canvasBackground: selected[0],
                baseHex: selected[0]
            });
            currentBackground = null;
            lastSection = elements.seccion.value;
            document.documentElement.style.setProperty("--ghost-color", selected[0]);
        } else {
            currentBackground = null;
            setCanvasBackground(null);
        }
    }

    function buildGradient() {
        const stops = selected.join(", ");
        const direction = elements.gradiente.value;

        if (direction === "radial") {
            return "radial-gradient(circle, " + stops + ")";
        }

        return "linear-gradient(" + direction + ", " + stops + ")";
    }

    function applySelection() {
        if (!selected.length) {
            UI.showMessage("Selecciona al menos un color favorito");
            return;
        }

        const type = elements.tipo.value;
        const baseHex = selected[0];
        const gradient = buildGradient();
        let background;

        if (type === "gradiente") {
            background = {
                type: "gradient",
                value: gradient,
                canvasBackground: gradient,
                baseHex: baseHex
            };
        } else if (type === "combinado") {
            background = {
                type: "combined",
                color: baseHex,
                image: gradient,
                canvasBackground: gradient,
                baseHex: baseHex
            };
        } else {
            background = {
                type: "solid",
                value: baseHex,
                canvasBackground: baseHex,
                baseHex: baseHex
            };
        }

        currentBackground = background;
        lastSection = elements.seccion.value;
        setCanvasBackground(background);
        applyToSection();
        document.documentElement.style.setProperty("--ghost-color", baseHex);
        UI.showMessage("Color aplicado a " + getSectionLabel(lastSection));
    }

    function updateFilters() {
        if (!elements) {
            return;
        }

        updateFilterLabels();

        if (currentBackground) {
            elements.canvas.style.filter = getFilterString();
            applyToSection();
        }
    }

    function resetFilters() {
        resetFilterValues();
        if (currentBackground) {
            elements.canvas.style.filter = getFilterString();
            applyToSection();
        }
        UI.showMessage("Filtros restablecidos");
    }

    function generateCSS() {
        if (!selected.length) {
            UI.showMessage("Selecciona al menos un color favorito");
            return;
        }

        const type = elements.tipo.value;
        const section = elements.seccion.value;
        const baseHex = selected[0];
        const gradient = buildGradient();
        const filter = getFilterString();
        const hasFilter = elements.contraste.value !== "100" ||
            elements.luminosidad.value !== "100" ||
            elements.intensidad.value !== "100";
        let css = "/* " + section + " */\n";

        if (type === "gradiente") {
            css += "background: " + gradient + ";";
        } else if (type === "combinado") {
            css += "background-color: " + baseHex + ";\n";
            css += "background-image: " + gradient + ";";
        } else {
            css += "background: " + baseHex + ";";
        }

        if (hasFilter) {
            css += "\nfilter: " + filter + ";";
        }

        elements.code.textContent = css;
        openModal();
    }

    function openModal() {
        if (!elements || !elements.modal) {
            return;
        }

        elements.modal.classList.add("is-open");
        elements.modal.setAttribute("aria-hidden", "false");
        elements.modalClose.focus();
    }

    function closeModal() {
        if (!elements || !elements.modal) {
            return;
        }

        elements.modal.classList.remove("is-open");
        elements.modal.setAttribute("aria-hidden", "true");
    }

    function updateGradientField() {
        if (!elements) {
            return;
        }

        const show = elements.tipo.value === "gradiente" || elements.tipo.value === "combinado";
        elements.gradientGroup.hidden = !show;
    }

    function copyCss() {
        if (!elements) {
            return;
        }

        UI.copyText(elements.code.textContent).then(function () {
            UI.showMessage("CSS copiado al portapapeles");
        }).catch(function () {
            UI.showMessage("No se pudo copiar el CSS");
        });
    }

    function handleFavoritesClick(event) {
        const button = event.target.closest(".favorite-swatch");
        if (!button || !elements.favoritesGrid.contains(button)) {
            return;
        }

        toggleFavorite(button.dataset.hex);
    }

    function bindEvents() {
        elements.applyColor.addEventListener("click", applySelection);
        elements.codeButton.addEventListener("click", generateCSS);
        elements.applyFilters.addEventListener("click", function () {
            updateFilters();
            UI.showMessage("Filtros aplicados");
        });
        elements.resetButton.addEventListener("click", resetFilters);
        elements.favoritesGrid.addEventListener("click", handleFavoritesClick);

        elements.preview.addEventListener("click", function (event) {
            const link = event.target.closest("a");
            if (!link || !elements.preview.contains(link)) {
                return;
            }
            event.preventDefault();
            UI.showMessage("Vista previa: los enlaces son decorativos");
        });

        elements.contraste.addEventListener("input", updateFilters);
        elements.luminosidad.addEventListener("input", updateFilters);
        elements.intensidad.addEventListener("input", updateFilters);

        elements.tipo.addEventListener("change", updateGradientField);

        elements.gradiente.addEventListener("change", function () {
            if (currentBackground && currentBackground.type !== "solid") {
                const baseHex = currentBackground.baseHex;
                const gradient = buildGradient();
                currentBackground = {
                    type: elements.tipo.value === "combinado" ? "combined" : "gradient",
                    color: baseHex,
                    image: gradient,
                    value: gradient,
                    canvasBackground: gradient,
                    baseHex: baseHex
                };
                setCanvasBackground(currentBackground);
                applyToSection();
            }
        });

        elements.modalClose.addEventListener("click", closeModal);
        elements.copyButton.addEventListener("click", copyCss);

        elements.modal.addEventListener("click", function (event) {
            if (event.target === elements.modal) {
                closeModal();
            }
        });
    }

    function init() {
        elements = {
            tipo: document.getElementById("tipoGeneracion"),
            gradiente: document.getElementById("tipoGradiente"),
            gradientGroup: document.getElementById("grupoGradiente"),
            seccion: document.getElementById("seccionSeleccion"),
            applyColor: document.getElementById("btnAplicarColor"),
            codeButton: document.getElementById("btnVerCodigo"),
            resetButton: document.getElementById("btnReiniciar"),
            favoritesGrid: document.getElementById("favoritosGrid"),
            canvas: document.getElementById("canvas"),
            preview: document.getElementById("paginaPreview"),
            contraste: document.getElementById("contraste"),
            luminosidad: document.getElementById("luminosidad"),
            intensidad: document.getElementById("intensidad"),
            contrasteValue: document.getElementById("contrasteValue"),
            luminosidadValue: document.getElementById("luminosidadValue"),
            intensidadValue: document.getElementById("intensidadValue"),
            applyFilters: document.getElementById("btnAplicarModificaciones"),
            modal: document.getElementById("modalCSS"),
            modalClose: document.getElementById("modalClose"),
            code: document.getElementById("codigoCSS"),
            copyButton: document.getElementById("btnCopiarCSS")
        };

        if (!elements.favoritesGrid || !elements.canvas || !elements.modal) {
            elements = null;
            return;
        }

        selected = [];
        currentBackground = null;
        lastSection = elements.seccion.value || "navbar";
        resetFilterValues();
        updateGradientField();
        renderFavorites();
        bindEvents();
    }

    global.addEventListener("favorites:changed", function () {
        if (!elements || !document.body.contains(elements.favoritesGrid)) {
            return;
        }

        renderFavorites();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && elements && elements.modal && elements.modal.classList.contains("is-open")) {
            closeModal();
        }
    });

    global.AppSimulator = {
        init: init
    };
})(window);
