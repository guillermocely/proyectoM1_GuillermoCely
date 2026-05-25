function aplicarModificacionesColor(hex) {
    const contrasteVal = parseInt(contraste.value);
    const luminosidadVal = parseInt(luminosidad.value);
    const intensidadVal = parseInt(intensidad.value);
    
    const filterContrast = contrasteVal / 100;
    const filterBrightness = luminosidadVal / 100;
    const filterSaturate = intensidadVal / 100;
    
    canvas.style.filter = `contrast(${filterContrast}) brightness(${filterBrightness}) saturate(${filterSaturate})`;
    
    return hex;
}

function aplicarModificacionesAGradiente(gradiente) {
    const contrasteVal = parseInt(contraste.value);
    const luminosidadVal = parseInt(luminosidad.value);
    const intensidadVal = parseInt(intensidad.value);
    
    const filterContrast = contrasteVal / 100;
    const filterBrightness = luminosidadVal / 100;
    const filterSaturate = intensidadVal / 100;
    
    canvas.style.filter = `contrast(${filterContrast}) brightness(${filterBrightness}) saturate(${filterSaturate})`;
    
    return gradiente;
}

function actualizarColorConControles() {
    if (!canvas) return;
    
    if (gradienteBase) {
        canvas.style.background = gradienteBase;
        canvas.style.backgroundColor = gradienteBase;
        aplicarModificacionesAGradiente(gradienteBase);
    } else if (colorBase) {
        canvas.style.background = colorBase;
        canvas.style.backgroundColor = colorBase;
        aplicarModificacionesColor(colorBase);
        canvas.querySelector('.placeholder')?.remove();
    } else {
        return;
    }
    
    const seccion = seccionSeleccion.value;
    const contrasteVal = parseInt(contraste.value);
    const luminosidadVal = parseInt(luminosidad.value);
    const intensidadVal = parseInt(intensidad.value);
    
    if (gradienteBase) {
        aplicarGradienteConFiltrosASeccion(seccion, gradienteBase, contrasteVal, luminosidadVal, intensidadVal);
    } else if (colorBase) {
        aplicarColorConFiltrosASeccion(seccion, colorBase, contrasteVal, luminosidadVal, intensidadVal);
    }
}

function aplicarColorConFiltrosASeccion(seccion, color, contraste, luminosidad, intensidad) {
    let elemento;
    const contrastColor = getContrastColor(color);
    
    switch(seccion) {
        case 'navbar':
            elemento = paginaPreview.querySelector('.preview-navbar');
            if (elemento) {
                elemento.style.background = color;
                elemento.style.filter = `contrast(${contraste/100}) brightness(${luminosidad/100}) saturate(${intensidad/100})`;
                elemento.style.color = contrastColor;
            }
            break;
        case 'aside':
            elemento = paginaPreview.querySelector('.preview-aside');
            if (elemento) {
                elemento.style.background = color;
                elemento.style.filter = `contrast(${contraste/100}) brightness(${luminosidad/100}) saturate(${intensidad/100})`;
                elemento.style.color = contrastColor;
            }
            break;
        case 'content':
            elemento = paginaPreview.querySelector('.preview-content');
            if (elemento) {
                elemento.style.background = color;
                elemento.style.filter = `contrast(${contraste/100}) brightness(${luminosidad/100}) saturate(${intensidad/100})`;
                elemento.style.color = contrastColor;
            }
            break;
        case 'footer':
            elemento = paginaPreview.querySelector('.preview-footer');
            if (elemento) {
                elemento.style.background = color;
                elemento.style.filter = `contrast(${contraste/100}) brightness(${luminosidad/100}) saturate(${intensidad/100})`;
                elemento.style.color = contrastColor;
            }
            break;
    }
}

function aplicarGradienteConFiltrosASeccion(seccion, gradiente, contraste, luminosidad, intensidad) {
    let elemento;
    const contrastColor = getContrastColor(gradiente);
    
    switch(seccion) {
        case 'navbar':
            elemento = paginaPreview.querySelector('.preview-navbar');
            if (elemento) {
                elemento.style.background = gradiente;
                elemento.style.filter = `contrast(${contraste/100}) brightness(${luminosidad/100}) saturate(${intensidad/100})`;
                elemento.style.color = contrastColor;
            }
            break;
        case 'aside':
            elemento = paginaPreview.querySelector('.preview-aside');
            if (elemento) {
                elemento.style.background = gradiente;
                elemento.style.filter = `contrast(${contraste/100}) brightness(${luminosidad/100}) saturate(${intensidad/100})`;
                elemento.style.color = contrastColor;
            }
            break;
        case 'content':
            elemento = paginaPreview.querySelector('.preview-content');
            if (elemento) {
                elemento.style.background = gradiente;
                elemento.style.filter = `contrast(${contraste/100}) brightness(${luminosidad/100}) saturate(${intensidad/100})`;
                elemento.style.color = contrastColor;
            }
            break;
        case 'footer':
            elemento = paginaPreview.querySelector('.preview-footer');
            if (elemento) {
                elemento.style.background = gradiente;
                elemento.style.filter = `contrast(${contraste/100}) brightness(${luminosidad/100}) saturate(${intensidad/100})`;
                elemento.style.color = contrastColor;
            }
            break;
    }
}
