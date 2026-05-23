let coloresSeleccionados = [];
let coloresFavoritos = [];
let colorBase = null;
let gradienteBase = null;

function cargarFavoritos() {
    coloresFavoritos = JSON.parse(localStorage.getItem('favoritosColores')) || [];
    mostrarFavoritos();
}

function mostrarFavoritos() {
    favoritosGrid.innerHTML = '';
    
    if (coloresFavoritos.length === 0) {
        favoritosGrid.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center; grid-column: span 2;">No hay favoritos</p>';
        return;
    }
    
    coloresFavoritos.forEach((color, index) => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-favorito';
        colorDiv.style.backgroundColor = color.hex;
        colorDiv.onclick = () => toggleSeleccionColor(index, colorDiv);
        
        const span = document.createElement('span');
        span.textContent = color.hex;
        colorDiv.appendChild(span);
        
        favoritosGrid.appendChild(colorDiv);
    });
}
