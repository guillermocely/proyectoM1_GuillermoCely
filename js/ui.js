(function (global) {
    "use strict";

    let messageTimer = null;

    function showMessage(message, duration) {
        const bubble = document.getElementById("feedback");
        if (!bubble) {
            return;
        }

        const timeout = typeof duration === "number" ? duration : 2600;
        bubble.textContent = message;
        bubble.classList.add("is-visible");

        if (messageTimer) {
            clearTimeout(messageTimer);
        }

        messageTimer = setTimeout(function () {
            bubble.classList.remove("is-visible");
        }, timeout);
    }

    function fallbackCopy(text) {
        return new Promise(function (resolve, reject) {
            const area = document.createElement("textarea");
            area.value = text;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.top = "-1000px";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();

            try {
                const copied = document.execCommand("copy");
                document.body.removeChild(area);
                if (copied) {
                    resolve(true);
                } else {
                    reject(new Error("No se pudo copiar"));
                }
            } catch (error) {
                document.body.removeChild(area);
                reject(error);
            }
        });
    }

    function copyText(text) {
        if (navigator.clipboard && global.isSecureContext) {
            return navigator.clipboard.writeText(text).then(function () {
                return true;
            }).catch(function () {
                return fallbackCopy(text);
            });
        }

        return fallbackCopy(text);
    }

    function showCopied(label) {
        copyText(label.value).then(function () {
            showMessage(label.name + " copiado: " + label.value);
        }).catch(function () {
            showMessage("No se pudo copiar. Selecciona el valor manualmente.");
        });
    }

    global.AppUI = {
        showMessage: showMessage,
        copyText: copyText,
        showCopied: showCopied
    };
})(window);
