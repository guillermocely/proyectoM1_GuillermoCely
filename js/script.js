// ========================
// SELECCIONAR ELEMENTOS DEL HTML
// ========================
const selectorTamaño = document.getElementById('selectorTamaño');
const selectorFormato = document.getElementById('selectorFormato');
const selectorArmonia = document.getElementById('selectorArmonia');
const botonGenerar = document.getElementById('botonGenerar');
const botonGuardar = document.getElementById('botonGuardar');
const botonVerFavoritos = document.getElementById('botonVerFavoritos');
const botonSimulador = document.getElementById('botonSimulador');
const gridColores = document.getElementById('gridColores');
const feedback = document.getElementById('feedback');

let paletaActual = [];
let coloresSeleccionados = [];

// ========================
// FUNCIÓN: GENERAR UN COLOR ALEATORIO EN HEX Y HSL
// ========================
function generarColorAleatorio() {
    // Números aleatorios del 0 al 255
    const rojo = Math.floor(Math.random() * 256);
    const verde = Math.floor(Math.random() * 256);
    const azul = Math.floor(Math.random() * 256);

    // Convertir a HEX
    const hexRojo = rojo.toString(16).padStart(2, '0');
    const hexVerde = verde.toString(16).padStart(2, '0');
    const hexAzul = azul.toString(16).padStart(2, '0');
    const hex = '#' + hexRojo + hexVerde + hexAzul;

    // Convertir a HSL
    const r = rojo / 255;
    const g = verde / 255;
    const b = azul / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

    return { hex, hsl };
}

// ========================
// FUNCIÓN: GENERAR COLORES SEGÚN ARMONÍA
// ========================
function generarColoresArmonia(cantidad, armonia) {
    const colores = [];
    const colorBase = generarColorAleatorio();
    
    if (armonia === 'aleatorio') {
        while (colores.length < cantidad) {
            const nuevoColor = generarColorAleatorio();
            if (!colores.some(c => c.hex === nuevoColor.hex)) {
                colores.push(nuevoColor);
            }
        }
    } else if (armonia === 'complementario') {
        colores.push(colorBase);
        const complementario = generarComplementario(colorBase);
        for (let i = 1; i < cantidad; i++) {
            const color = i % 2 === 0 ? colorBase : complementario;
            if (!colores.some(c => c.hex === color.hex)) {
                colores.push(color);
            } else {
                const nuevoColor = generarColorAleatorio();
                if (!colores.some(c => c.hex === nuevoColor.hex)) {
                    colores.push(nuevoColor);
                }
            }
        }
    } else if (armonia === 'analogo') {
        const hslBase = hexToHsl(colorBase.hex);
        for (let i = 0; i < cantidad; i++) {
            const h = (hslBase.h + i * 30) % 360;
            const nuevoColor = hslToHex(h, hslBase.s, hslBase.l);
            if (!colores.some(c => c.hex === nuevoColor.hex)) {
                colores.push(nuevoColor);
            } else {
                const colorAlt = generarColorAleatorio();
                if (!colores.some(c => c.hex === colorAlt.hex)) {
                    colores.push(colorAlt);
                }
            }
        }
    } else if (armonia === 'triadico') {
        const hslBase = hexToHsl(colorBase.hex);
        for (let i = 0; i < cantidad; i++) {
            const h = (hslBase.h + i * 120) % 360;
            const nuevoColor = hslToHex(h, hslBase.s, hslBase.l);
            if (!colores.some(c => c.hex === nuevoColor.hex)) {
                colores.push(nuevoColor);
            } else {
                const colorAlt = generarColorAleatorio();
                if (!colores.some(c => c.hex === colorAlt.hex)) {
                    colores.push(colorAlt);
                }
            }
        }
    } else if (armonia === 'monocromatico') {
        const hslBase = hexToHsl(colorBase.hex);
        for (let i = 0; i < cantidad; i++) {
            const l = Math.max(10, Math.min(90, hslBase.l + (i - cantidad/2) * 15));
            const nuevoColor = hslToHex(hslBase.h, hslBase.s, l);
            if (!colores.some(c => c.hex === nuevoColor.hex)) {
                colores.push(nuevoColor);
            } else {
                const colorAlt = generarColorAleatorio();
                if (!colores.some(c => c.hex === colorAlt.hex)) {
                    colores.push(colorAlt);
                }
            }
        }
    }
    
    return colores;
}

function generarComplementario(color) {
    const hsl = hexToHsl(color.hex);
    const h = (hsl.h + 180) % 360;
    return hslToHex(h, hsl.s, hsl.l);
}

function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    const hex = `#${f(0)}${f(8)}${f(4)}`;
    
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h_hsl, s_hsl, l_hsl = (max + min) / 2;
    
    if (max === min) {
        h_hsl = s_hsl = 0;
    } else {
        const d = max - min;
        s_hsl = l_hsl > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h_hsl = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h_hsl = ((b - r) / d + 2) / 6; break;
            case b: h_hsl = ((r - g) / d + 4) / 6; break;
        }
    }
    
    const hsl = `hsl(${Math.round(h_hsl * 360)}, ${Math.round(s_hsl * 100)}%, ${Math.round(l_hsl * 100)}%)`;
    
    return { hex, hsl };
}

// ========================
// FUNCIÓN: CREAR ARRAY DE COLORES
// ========================
function crearArrayColores(cantidad) {
    const armonia = selectorArmonia.value;
    return generarColoresArmonia(cantidad, armonia);
}

// ========================
// FUNCIÓN: MOSTRAR COLORES EN LA PÁGINA
// ========================
function mostrarColores() {
    // Limpiar colores anteriores
    gridColores.innerHTML = '';

    // Obtener el tamaño seleccionado
    const tamaño = parseInt(selectorTamaño.value);

    // Obtener el formato seleccionado
    const formato = selectorFormato.value;

    // Crear array de colores aleatorios
    paletaActual = crearArrayColores(tamaño);

    // Mostrar cada color del array
    for (let i = 0; i < paletaActual.length; i++) {
        const colorActual = paletaActual[i];

        // Crear tarjeta para cada color
        const tarjeta = document.createElement('div');
        tarjeta.className = 'resultado-card';
        tarjeta.style.backgroundColor = colorActual.hex;

        // Mostrar solo el formato seleccionado
        let codigoColor = '';
        if (formato === 'hex') {
            codigoColor = `<p class="hex"><strong>HEX:</strong> ${colorActual.hex}</p>`;
        } else if (formato === 'hsl') {
            codigoColor = `<p class="hsl"><strong>HSL:</strong> ${colorActual.hsl}</p>`;
        } else {
            codigoColor = `<p class="rgb"><strong>RGB:</strong> ${hexToRgb(colorActual.hex)}</p>`;
        }

        tarjeta.innerHTML = `
            <div class="resultado-info">
                <p class="mezcla-titulo"><strong>Color ${i + 1}</strong></p>
                ${codigoColor}
                <button onclick="copiarColor('${colorActual.hex}')">Copiar</button>
                <button onclick="seleccionarColor('${colorActual.hex}', '${colorActual.hsl}', this)">★</button>
            </div>
        `;

        gridColores.appendChild(tarjeta);
    }
       const tarjetas = gridColores.querySelectorAll('.resultado-card');
    const total = tarjetas.length;
    const sobran = total % 3;

    if (sobran === 0) {
        // 9, 6, 3 → perfecto, 3 columnas normales
        gridColores.style.gridTemplateColumns = 'repeat(3, 1fr)';
        tarjetas.forEach(t => t.style.gridColumn = '');
    } else {
        // 8, 7, 5, 4 → 6 columnas internas
        gridColores.style.gridTemplateColumns = 'repeat(6, 1fr)';
        tarjetas.forEach(t => t.style.gridColumn = 'span 2');
        const spanSobrante = 6 / sobran;
        for (let i = total - sobran; i < total; i++) {
            tarjetas[i].style.gridColumn = `span ${spanSobrante}`;
        }
    }
    // Microfeedback en el fantasma
    feedback.textContent = "paleta de color generado";
    feedback.style.display = 'block';
    setTimeout(() =>{
        feedback.textContent = "";
        feedback.style.display = 'none';
    }, 3000); 
}

// ========================
// FUNCIÓN: COPIAR COLOR AL PORTAPAPELES
// ========================
function copiarColor(color) {
    navigator.clipboard.writeText(color).then(() => {
        feedback.textContent = "Color copiado";
        feedback.style.display = 'block';
        setTimeout(() =>{
            feedback.textContent = "";
            feedback.style.display = 'none';
        }, 3000);
    });
}

// ========================
// FUNCIÓN: HEX A RGB
// ========================
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

// ========================
// FUNCIÓN: SELECCIONAR COLOR
// ========================
function seleccionarColor(hex, hsl, boton) {
    const index = coloresSeleccionados.findIndex(c => c.hex === hex);
    
    if (index === -1) {
        coloresSeleccionados.push({ hex, hsl });
        boton.style.backgroundColor = '#ff4444';
        boton.textContent = '✓';
        feedback.textContent = "Color seleccionado";
    } else {
        coloresSeleccionados.splice(index, 1);
        boton.style.backgroundColor = '';
        boton.textContent = '★';
        feedback.textContent = "Color deseleccionado";
    }
    
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.textContent = "";
        feedback.style.display = 'none';
    }, 2000);
}

// ========================
// FUNCIÓN: GUARDAR COLORES SELECCIONADOS
// ========================
function guardarPaleta() {
    if (coloresSeleccionados.length === 0) {
        feedback.textContent = "Selecciona colores primero";
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.textContent = "";
            feedback.style.display = 'none';
        }, 3000);
        return;
    }

    const favoritosColores = JSON.parse(localStorage.getItem('favoritosColores')) || [];
    coloresSeleccionados.forEach(color => {
        const colorExistente = favoritosColores.find(c => c.hex === color.hex);
        if (!colorExistente) {
            favoritosColores.push(color);
        }
    });
    localStorage.setItem('favoritosColores', JSON.stringify(favoritosColores));
    
    coloresSeleccionados = [];
    feedback.textContent = "Colores agregados a favoritos";
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.textContent = "";
        feedback.style.display = 'none';
    }, 3000);
}

// ========================
// FUNCIÓN: VER FAVORITOS
// ========================
function verFavoritos() {
    gridColores.innerHTML = '';
    const favoritosColores = JSON.parse(localStorage.getItem('favoritosColores')) || [];
    
    if (favoritosColores.length === 0) {
        feedback.textContent = "No hay colores en favoritos";
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.textContent = "";
            feedback.style.display = 'none';
        }, 3000);
        return;
    }

    favoritosColores.forEach((color, index) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'resultado-card';
        tarjeta.style.backgroundColor = color.hex;
        tarjeta.style.width = '150px';
        tarjeta.style.height = '150px';
        tarjeta.style.display = 'flex';
        tarjeta.style.flexDirection = 'column';
        tarjeta.style.justifyContent = 'center';
        tarjeta.style.alignItems = 'center';
        tarjeta.style.padding = '10px';

        tarjeta.innerHTML = `
            <p style="color: white; text-shadow: 1px 1px 2px black; margin: 5px;">${color.hex}</p>
            <button onclick="copiarColor('${color.hex}')" style="margin: 5px; padding: 5px 10px; cursor: pointer;">Copiar</button>
            <button onclick="eliminarColorFavorito(${index})" style="margin: 5px; padding: 5px 10px; background: #ff4444; color: white; border: none; cursor: pointer;">Eliminar</button>
        `;

        gridColores.appendChild(tarjeta);
    });
}

// ========================
// FUNCIÓN: ELIMINAR COLOR DE FAVORITOS
// ========================
function eliminarColorFavorito(index) {
    const favoritosColores = JSON.parse(localStorage.getItem('favoritosColores')) || [];
    favoritosColores.splice(index, 1);
    localStorage.setItem('favoritosColores', JSON.stringify(favoritosColores));
    verFavoritos();
    feedback.textContent = "Color eliminado";
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.textContent = "";
        feedback.style.display = 'none';
    }, 3000);
}

// ========================
// FUNCIÓN: LIMPIAR TODOS LOS FAVORITOS
// ========================
function limpiarFavoritos() {
    localStorage.removeItem('favoritosColores');
    localStorage.removeItem('favoritos');
    gridColores.innerHTML = '';
    feedback.textContent = "Favoritos limpiados";
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.textContent = "";
        feedback.style.display = 'none';
    }, 3000);
}

// ========================
// EVENTO: CUANDO HACE CLIC EN EL BOTÓN GENERAR
// ========================
botonGenerar.addEventListener('click', mostrarColores);

// ========================
// EVENTO: CUANDO HACE CLIC EN EL BOTÓN GUARDAR
// ========================
botonGuardar.addEventListener('click', guardarPaleta);

// ========================
// EVENTO: CUANDO HACE CLIC EN EL BOTÓN FAVORITOS
// ========================
botonVerFavoritos.addEventListener('click', verFavoritos);

// ========================
// EVENTO: CUANDO HACE CLIC EN EL BOTÓN SIMULADOR
// ========================
botonSimulador.addEventListener('click', function() {
    window.location.href = 'simulador.html';
});
// ========================
// EVENTO: CUANDO CAMBIA EL FORMATO
// ========================
selectorFormato.addEventListener('change', function() {
    const formatoSeleccionado = selectorFormato.value.toUpperCase();
    feedback.textContent = `Cambio a formato ${formatoSeleccionado}`;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.textContent = "";
        feedback.style.display = 'none';
    }, 3000);
});
// ========================
// EVENTO: CUANDO CAMBIA EL TAMAÑO
// ========================
selectorTamaño.addEventListener('change', function() {
    const tamañoSeleccionado = selectorTamaño.value;
    feedback.textContent = `Cambio a tamaño ${tamañoSeleccionado}`;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.textContent = "";
        feedback.style.display = 'none';
    }, 3000);
});

// ========================
// EVENTO: CUANDO CAMBIA LA ARMONÍA
// ========================
selectorArmonia.addEventListener('change', function() {
    const armoniaSeleccionada = selectorArmonia.options[selectorArmonia.selectedIndex].text;
    feedback.textContent = `Cambio a armonía ${armoniaSeleccionada}`;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.textContent = "";
        feedback.style.display = 'none';
    }, 3000);
});