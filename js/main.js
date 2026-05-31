let btnVolver, tipoGeneracion, tipoGradiente, grupoGradiente, seccionSeleccion;
let btnAplicarColor, btnVerCodigo;
let favoritosGrid, canvas, paginaPreview;
let modalCSS, modalClose, codigoCSS, btnCopiarCSS;
let contraste, luminosidad, intensidad;
let contrasteValue, luminosidadValue, intensidadValue;
let btnAplicarModificaciones;

function inicializarElementos() {
    btnVolver = document.getElementById('btnVolver');
    tipoGeneracion = document.getElementById('tipoGeneracion');
    tipoGradiente = document.getElementById('tipoGradiente');
    grupoGradiente = document.getElementById('grupoGradiente');
    seccionSeleccion = document.getElementById('seccionSeleccion');
    btnAplicarColor = document.getElementById('btnAplicarColor');
    btnVerCodigo = document.getElementById('btnVerCodigo');
    favoritosGrid = document.getElementById('favoritosGrid');
    canvas = document.getElementById('canvas');
    paginaPreview = document.getElementById('paginaPreview');
    modalCSS = document.getElementById('modalCSS');
    modalClose = document.getElementById('modalClose');
    codigoCSS = document.getElementById('codigoCSS');
    btnCopiarCSS = document.getElementById('btnCopiarCSS');
    contraste = document.getElementById('contraste');
    luminosidad = document.getElementById('luminosidad');
    intensidad = document.getElementById('intensidad');
    contrasteValue = document.getElementById('contrasteValue');
    luminosidadValue = document.getElementById('luminosidadValue');
    intensidadValue = document.getElementById('intensidadValue');
    btnAplicarModificaciones = document.getElementById('btnAplicarModificaciones');
}

function resetearControles() {
    contraste.value = 100;
    luminosidad.value = 100;
    intensidad.value = 100;
    contrasteValue.textContent = '100%';
    luminosidadValue.textContent = '100%';
    intensidadValue.textContent = '100%';
}

function toggleSeleccionColor(index, elemento) {
    const indexSeleccionado = coloresSeleccionados.findIndex(c => c.hex === coloresFavoritos[index].hex);
    
    if (indexSeleccionado === -1) {
        coloresSeleccionados.push(coloresFavoritos[index]);
        elemento.classList.add('seleccionado');
        colorBase = coloresFavoritos[index].hex;
        gradienteBase = null;
        canvas.style.background = colorBase;
        canvas.style.backgroundColor = colorBase;
        canvas.style.filter = 'none';
        canvas.querySelector('.placeholder')?.remove();
        resetearControles();
    } else {
        coloresSeleccionados.splice(indexSeleccionado, 1);
        elemento.classList.remove('seleccionado');
        if (coloresSeleccionados.length > 0) {
            colorBase = coloresSeleccionados[0].hex;
            gradienteBase = null;
            canvas.style.background = colorBase;
            canvas.style.backgroundColor = colorBase;
            canvas.style.filter = 'none';
        } else {
            colorBase = null;
            gradienteBase = null;
            canvas.style.background = 'rgba(255, 255, 255, 0.2)';
            canvas.style.filter = 'none';
        }
    }
}

function generarCSS() {
    if (coloresSeleccionados.length === 0) {
        alert('Selecciona colores primero');
        return;
    }
    
    const tipo = tipoGeneracion.value;
    const seccion = seccionSeleccion.value;
    let css = '';
    
    if (tipo === 'solid') {
        const color = coloresSeleccionados[0].hex;
        colorBase = color;
        gradienteBase = null;
        const colorModificado = aplicarModificacionesColor(color);
        css = `background: ${colorModificado};`;
        canvas.style.background = colorModificado;
        aplicarColorASeccion(seccion, colorModificado);
        resetearControles();
    } else if (tipo === 'gradiente') {
        const direccion = tipoGradiente.value;
        const colores = coloresSeleccionados.map(c => c.hex).join(', ');
        
        if (direccion === 'radial') {
            const gradiente = `radial-gradient(circle, ${colores})`;
            css = `background: ${gradiente};`;
            canvas.style.background = gradiente;
            gradienteBase = gradiente;
            colorBase = null;
            aplicarGradienteASeccion(seccion, gradiente);
        } else {
            const gradiente = `linear-gradient(${direccion}, ${colores})`;
            css = `background: ${gradiente};`;
            canvas.style.background = gradiente;
            gradienteBase = gradiente;
            colorBase = null;
            aplicarGradienteASeccion(seccion, gradiente);
        }
        resetearControles();
    } else if (tipo === 'combinado') {
        const direccion = tipoGradiente.value;
        const colores = coloresSeleccionados.map(c => c.hex).join(', ');
        
        if (direccion === 'radial') {
            const gradiente = `radial-gradient(circle, ${colores})`;
            css = `background: ${gradiente};`;
            canvas.style.background = gradiente;
            gradienteBase = gradiente;
            colorBase = null;
            aplicarGradienteASeccion(seccion, gradiente);
        } else {
            const gradiente = `linear-gradient(${direccion}, ${colores})`;
            css = `background: ${gradiente};`;
            canvas.style.background = gradiente;
            gradienteBase = gradiente;
            colorBase = null;
            aplicarGradienteASeccion(seccion, gradiente);
        }
        resetearControles();
    }
    
    codigoCSS.innerHTML = `<code>${css}</code>`;
    canvas.querySelector('.placeholder')?.remove();
    
    // Limpiar selección después de aplicar el color
    limpiarSeleccion();
}

function limpiarSeleccion() {
    coloresSeleccionados = [];
    const elementosSeleccionados = favoritosGrid.querySelectorAll('.seleccionado');
    elementosSeleccionados.forEach(el => el.classList.remove('seleccionado'));
}

function verCodigoCSS() {
    if (coloresSeleccionados.length === 0) {
        alert('Selecciona colores primero');
        return;
    }
    
    const tipo = tipoGeneracion.value;
    const seccion = seccionSeleccion.value;
    let css = '';
    
    if (tipo === 'solid') {
        const color = coloresSeleccionados[0].hex;
        css = `background: ${color};`;
    } else if (tipo === 'gradiente') {
        const direccion = tipoGradiente.value;
        const colores = coloresSeleccionados.map(c => c.hex).join(', ');
        
        if (direccion === 'radial') {
            css = `background: radial-gradient(circle, ${colores});`;
        } else {
            css = `background: linear-gradient(${direccion}, ${colores});`;
        }
    } else if (tipo === 'combinado') {
        const direccion = tipoGradiente.value;
        const colores = coloresSeleccionados.map(c => c.hex).join(', ');
        
        if (direccion === 'radial') {
            css = `background: radial-gradient(circle, ${colores});`;
        } else {
            css = `background: linear-gradient(${direccion}, ${colores});`;
        }
    }
    
    codigoCSS.innerHTML = `<code>/* ${seccion} */\n${css}</code>`;
    modalCSS.style.display = 'block';
}

function inicializarEventListeners() {
    if (!btnAplicarColor || !btnVerCodigo) return;

    btnAplicarColor.addEventListener('click', generarCSS);
    btnVerCodigo.addEventListener('click', verCodigoCSS);

    if (contraste && contrasteValue) {
        contraste.addEventListener('input', function() {
            contrasteValue.textContent = this.value + '%';
            actualizarColorConControles();
        });
    }

    if (luminosidad && luminosidadValue) {
        luminosidad.addEventListener('input', function() {
            luminosidadValue.textContent = this.value + '%';
            actualizarColorConControles();
        });
    }

    if (intensidad && intensidadValue) {
        intensidad.addEventListener('input', function() {
            intensidadValue.textContent = this.value + '%';
            actualizarColorConControles();
        });
    }

    if (btnAplicarModificaciones) {
        btnAplicarModificaciones.addEventListener('click', actualizarColorConControles);
    }

    if (btnCopiarCSS) {
        btnCopiarCSS.addEventListener('click', function() {
            const css = codigoCSS.textContent;
            navigator.clipboard.writeText(css).then(() => {
                alert('CSS copiado al portapapeles');
            });
        });
    }

    if (tipoGeneracion) {
        tipoGeneracion.addEventListener('change', function() {
            if (tipoGeneracion.value === 'gradiente' || tipoGeneracion.value === 'combinado') {
                grupoGradiente.style.display = 'flex';
            } else {
                grupoGradiente.style.display = 'none';
            }
        });
    }

    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            window.location.href = 'paleta.html';
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modalCSS.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modalCSS) {
            modalCSS.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarElementos();
    inicializarEventListeners();
    cargarFavoritos();
});
