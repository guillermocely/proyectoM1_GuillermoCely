(function (global) {
    "use strict";

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function wrapHue(hue) {
        return ((hue % 360) + 360) % 360;
    }

    function normalizeHex(hex) {
        if (typeof hex !== "string") {
            return "#000000";
        }

        let value = hex.trim().replace(/^#/, "");

        if (value.length === 3) {
            value = value.split("").map(function (char) {
                return char + char;
            }).join("");
        }

        if (!/^[0-9a-f]{6}$/i.test(value)) {
            return "#000000";
        }

        return "#" + value.toLowerCase();
    }

    function hexToRgb(hex) {
        const normalized = normalizeHex(hex);
        return {
            r: parseInt(normalized.slice(1, 3), 16),
            g: parseInt(normalized.slice(3, 5), 16),
            b: parseInt(normalized.slice(5, 7), 16)
        };
    }

    function rgbToHex(red, green, blue) {
        const r = Math.round(clamp(red, 0, 255));
        const g = Math.round(clamp(green, 0, 255));
        const b = Math.round(clamp(blue, 0, 255));
        return "#" + [r, g, b].map(function (channel) {
            return channel.toString(16).padStart(2, "0");
        }).join("");
    }

    function rgbToHsl(red, green, blue) {
        const r = clamp(red, 0, 255) / 255;
        const g = clamp(green, 0, 255) / 255;
        const b = clamp(blue, 0, 255) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        let hue = 0;
        let saturation = 0;
        const lightness = (max + min) / 2;

        if (delta !== 0) {
            saturation = lightness > 0.5
                ? delta / (2 - max - min)
                : delta / (max + min);

            if (max === r) {
                hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
            } else if (max === g) {
                hue = ((b - r) / delta + 2) / 6;
            } else {
                hue = ((r - g) / delta + 4) / 6;
            }
        }

        return {
            h: wrapHue(hue * 360),
            s: saturation * 100,
            l: lightness * 100
        };
    }

    function hslToRgb(hue, saturation, lightness) {
        const h = wrapHue(hue) / 360;
        const s = clamp(saturation, 0, 100) / 100;
        const l = clamp(lightness, 0, 100) / 100;

        if (s === 0) {
            const channel = Math.round(l * 255);
            return { r: channel, g: channel, b: channel };
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        function hueToChannel(t) {
            let value = t;
            if (value < 0) value += 1;
            if (value > 1) value -= 1;
            if (value < 1 / 6) return p + (q - p) * 6 * value;
            if (value < 1 / 2) return q;
            if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
            return p;
        }

        return {
            r: Math.round(hueToChannel(h + 1 / 3) * 255),
            g: Math.round(hueToChannel(h) * 255),
            b: Math.round(hueToChannel(h - 1 / 3) * 255)
        };
    }

    function hexToHsl(hex) {
        const rgb = hexToRgb(hex);
        return rgbToHsl(rgb.r, rgb.g, rgb.b);
    }

    function hslToHex(hue, saturation, lightness) {
        const rgb = hslToRgb(hue, saturation, lightness);
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    function formatColor(hex) {
        const normalized = normalizeHex(hex);
        const rgb = hexToRgb(normalized);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        return {
            hex: normalized,
            rgb: "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")",
            hsl: "hsl(" + Math.round(hsl.h) + ", " + Math.round(hsl.s) + "%, " + Math.round(hsl.l) + "%)",
            h: hsl.h,
            s: hsl.s,
            l: hsl.l
        };
    }

    function relativeLuminance(hex) {
        const rgb = hexToRgb(hex);
        const channels = [rgb.r, rgb.g, rgb.b].map(function (channel) {
            const value = channel / 255;
            return value <= 0.03928
                ? value / 12.92
                : Math.pow((value + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }

    function contrastRatio(first, second) {
        const a = relativeLuminance(first);
        const b = relativeLuminance(second);
        const lighter = Math.max(a, b);
        const darker = Math.min(a, b);
        return (lighter + 0.05) / (darker + 0.05);
    }

    function getContrastColor(hex) {
        const normalized = normalizeHex(hex);
        const dark = "#10121c";
        const light = "#ffffff";
        return contrastRatio(normalized, light) >= contrastRatio(normalized, dark) ? light : dark;
    }

    function hexFromGradient(value) {
        if (typeof value !== "string") {
            return "#ffffff";
        }

        const match = value.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
        return match ? normalizeHex(match[0]) : "#ffffff";
    }

    function hueDistance(first, second) {
        const raw = Math.abs(wrapHue(first) - wrapHue(second));
        return Math.min(raw, 360 - raw);
    }

    global.AppColor = {
        clamp: clamp,
        wrapHue: wrapHue,
        normalizeHex: normalizeHex,
        hexToRgb: hexToRgb,
        rgbToHex: rgbToHex,
        rgbToHsl: rgbToHsl,
        hslToRgb: hslToRgb,
        hexToHsl: hexToHsl,
        hslToHex: hslToHex,
        formatColor: formatColor,
        relativeLuminance: relativeLuminance,
        contrastRatio: contrastRatio,
        getContrastColor: getContrastColor,
        hexFromGradient: hexFromGradient,
        hueDistance: hueDistance
    };
})(window);
