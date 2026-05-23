function aplicarColorASeccion(seccion, color) {
    let elemento;
    const contrastColor = getContrastColor(color);
    
    switch(seccion) {
        case 'navbar':
            elemento = paginaPreview.querySelector('.preview-navbar');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.querySelector('h1').style.color = contrastColor;
            elemento.querySelectorAll('a').forEach(link => link.style.color = contrastColor);
            break;
        case 'aside':
            elemento = paginaPreview.querySelector('.preview-aside');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.querySelector('h3').style.color = contrastColor;
            elemento.querySelectorAll('a').forEach(link => link.style.color = contrastColor);
            break;
        case 'content':
            elemento = paginaPreview.querySelector('.preview-content');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.querySelector('h2').style.color = contrastColor;
            elemento.querySelector('p').style.color = contrastColor;
            break;
        case 'footer':
            elemento = paginaPreview.querySelector('.preview-footer');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.querySelector('p').style.color = contrastColor;
            break;
        case 'btnPrincipal':
            elemento = paginaPreview.querySelector('.preview-btn');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.style.color = contrastColor;
            break;
        case 'btnSecundario':
            elemento = paginaPreview.querySelector('.preview-btn-secondary');
            elemento.style.background = color;
            elemento.style.backgroundColor = color;
            elemento.style.color = contrastColor;
            break;
    }
}

function aplicarGradienteASeccion(seccion, gradiente) {
    let elemento;
    
    switch(seccion) {
        case 'navbar':
            elemento = paginaPreview.querySelector('.preview-navbar');
            elemento.style.background = gradiente;
            elemento.querySelector('h1').style.color = '#333';
            elemento.querySelectorAll('a').forEach(link => link.style.color = '#333');
            break;
        case 'aside':
            elemento = paginaPreview.querySelector('.preview-aside');
            elemento.style.background = gradiente;
            elemento.querySelector('h3').style.color = '#333';
            elemento.querySelectorAll('a').forEach(link => link.style.color = '#333');
            break;
        case 'content':
            elemento = paginaPreview.querySelector('.preview-content');
            elemento.style.background = gradiente;
            elemento.querySelector('h2').style.color = '#333';
            elemento.querySelector('p').style.color = '#666';
            break;
        case 'footer':
            elemento = paginaPreview.querySelector('.preview-footer');
            elemento.style.background = gradiente;
            elemento.querySelector('p').style.color = '#333';
            break;
        case 'btnPrincipal':
            elemento = paginaPreview.querySelector('.preview-btn');
            elemento.style.background = gradiente;
            elemento.style.color = 'white';
            break;
        case 'btnSecundario':
            elemento = paginaPreview.querySelector('.preview-btn-secondary');
            elemento.style.background = gradiente;
            elemento.style.color = 'white';
            break;
    }
}

function aplicarColorAPagina(color) {
    const navbar = paginaPreview.querySelector('.preview-navbar');
    const aside = paginaPreview.querySelector('.preview-aside');
    const content = paginaPreview.querySelector('.preview-content');
    const footer = paginaPreview.querySelector('.preview-footer');
    const btnPrincipal = paginaPreview.querySelector('.preview-btn');
    const btnSecundario = paginaPreview.querySelector('.preview-btn-secondary');
    
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
    
    btnPrincipal.style.background = color;
    btnPrincipal.style.color = contrastColor;
    
    btnSecundario.style.background = getDarkerColor(color);
    btnSecundario.style.color = contrastColor;
}

function aplicarGradienteAPagina(gradiente) {
    const navbar = paginaPreview.querySelector('.preview-navbar');
    const aside = paginaPreview.querySelector('.preview-aside');
    const content = paginaPreview.querySelector('.preview-content');
    const footer = paginaPreview.querySelector('.preview-footer');
    const btnPrincipal = paginaPreview.querySelector('.preview-btn');
    const btnSecundario = paginaPreview.querySelector('.preview-btn-secondary');
    
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
    
    btnPrincipal.style.background = '#4CAF50';
    btnPrincipal.style.color = 'white';
    
    btnSecundario.style.background = '#2196F3';
    btnSecundario.style.color = 'white';
}
