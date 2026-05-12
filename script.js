// ========================
// SELECCIONAR ELEMENTOS DEL HTML
// ========================
const selectorTamaño = document.getElementById('selectorTamaño');
const selectorFormato = document.getElementById('selectorFormato');
const botonGenerar = document.getElementById('botonGenerar');
const gridColores = document.getElementById('gridColores');
const feedback = document.getElementById('feedback');

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
// FUNCIÓN: CREAR ARRAY DE COLORES
// ========================
function crearArrayColores(cantidad) {
    const colores = []; // Array vacío
    
    // Llenar el array con colores aleatorios
    for (let i = 0; i < cantidad; i++) {
        const colorNuevo = generarColorAleatorio();
        colores.push(colorNuevo); // Agregar color al array
    }
    
    return colores;
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
    const misPaleta = crearArrayColores(tamaño);

    // Mostrar cada color del array
    for (let i = 0; i < misPaleta.length; i++) {
        const colorActual = misPaleta[i];

        // Crear tarjeta para cada color
        const tarjeta = document.createElement('div');
        tarjeta.className = 'resultado-card';
        tarjeta.style.backgroundColor = colorActual.hex;

        // Mostrar solo el formato seleccionado
        let codigoColor = '';
        if (formato === 'hex') {
            codigoColor = `<p class="hex"><strong>HEX:</strong> ${colorActual.hex}</p>`;
        } else {
            codigoColor = `<p class="hsl"><strong>HSL:</strong> ${colorActual.hsl}</p>`;
        }

        tarjeta.innerHTML = `
            <div class="resultado-info">
                <p class="mezcla-titulo"><strong>Color ${i + 1}</strong></p>
                ${codigoColor}
                <button onclick="copiarColor('${colorActual.hex}')">Copiar</button>
            </div>
        `;

        gridColores.appendChild(tarjeta);
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
// EVENTO: CUANDO HACE CLIC EN EL BOTÓN
// ========================
botonGenerar.addEventListener('click', mostrarColores);