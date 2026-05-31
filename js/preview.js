function aplicarColorASeccion(seccion, color) {
    let elemento;
    const contrastColor = getContrastColor(color);
    
    switch(seccion) {
        case 'navbar':
            elemento = paginaPreview.querySelector('.barra-navegacion-previa');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.querySelector('h1').style.color = contrastColor;
            elemento.querySelectorAll('a').forEach(link => link.style.color = contrastColor);
            break;
        case 'aside':
            elemento = paginaPreview.querySelector('.barra-lateral-previa');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.querySelector('h3').style.color = contrastColor;
            elemento.querySelectorAll('a').forEach(link => link.style.color = contrastColor);
            break;
        case 'content':
            elemento = paginaPreview.querySelector('.contenido-previo');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.querySelector('h2').style.color = contrastColor;
            elemento.querySelector('p').style.color = contrastColor;
            break;
        case 'footer':
            elemento = paginaPreview.querySelector('.pie-pagina-previo');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.querySelector('p').style.color = contrastColor;
            break;
    }
}

function aplicarGradienteASeccion(seccion, gradiente) {
    let elemento;
    
    switch(seccion) {
        case 'navbar':
            elemento = paginaPreview.querySelector('.barra-navegacion-previa');
            elemento.style.background = gradiente;
            elemento.querySelector('h1').style.color = '#333';
            elemento.querySelectorAll('a').forEach(link => link.style.color = '#333');
            break;
        case 'aside':
            elemento = paginaPreview.querySelector('.barra-lateral-previa');
            elemento.style.background = gradiente;
            elemento.querySelector('h3').style.color = '#333';
            elemento.querySelectorAll('a').forEach(link => link.style.color = '#333');
            break;
        case 'content':
            elemento = paginaPreview.querySelector('.contenido-previo');
            elemento.style.background = gradiente;
            elemento.querySelector('h2').style.color = '#333';
            elemento.querySelector('p').style.color = '#666';
            break;
        case 'footer':
            elemento = paginaPreview.querySelector('.pie-pagina-previo');
            elemento.style.background = gradiente;
            elemento.querySelector('p').style.color = '#333';
            break;
    }
}

function aplicarColorAPagina(color) {
    const navbar = paginaPreview.querySelector('.barra-navegacion-previa');
    const aside = paginaPreview.querySelector('.barra-lateral-previa');
    const content = paginaPreview.querySelector('.contenido-previo');
    const footer = paginaPreview.querySelector('.pie-pagina-previo');
    
    navbar.style.background = color;
    aside.style.background = color;
    content.style.background = '#ffffff';
    footer.style.background = color;
    
    const contrastColor = getContrastColor(color);
    
    navbar.querySelector('h1').style.color = contrastColor;
    navbar.querySelectorAll('a').forEach(link => link.style.color = contrastColor);
    
    aside.querySelector('h3').style.color = contrastColor;
    aside.querySelectorAll('a').forEach(link => link.style.color = contrastColor);
    
    content.querySelector('h2').style.color = '#333';
    content.querySelector('p').style.color = '#666';
    
    footer.querySelector('p').style.color = contrastColor;
}

function aplicarGradienteAPagina(gradiente) {
    const navbar = paginaPreview.querySelector('.barra-navegacion-previa');
    const aside = paginaPreview.querySelector('.barra-lateral-previa');
    const content = paginaPreview.querySelector('.contenido-previo');
    const footer = paginaPreview.querySelector('.pie-pagina-previo');
    
    navbar.style.background = gradiente;
    aside.style.background = gradiente;
    content.style.background = '#ffffff';
    footer.style.background = gradiente;
    
    navbar.querySelector('h1').style.color = '#333';
    navbar.querySelectorAll('a').forEach(link => link.style.color = '#333');
    
    aside.querySelector('h3').style.color = '#333';
    aside.querySelectorAll('a').forEach(link => link.style.color = '#333');
    
    content.querySelector('h2').style.color = '#333';
    content.querySelector('p').style.color = '#666';
    
    footer.querySelector('p').style.color = '#333';
}
