# Paleta de Colores

Aplicación web para generar paletas de colores aleatorias y simular su aplicación en páginas web.

## Páginas del Proyecto

1. **index.html** - Página de presentación/bienvenida
2. **paleta.html** - Generador de paletas de colores
3. **simulador.html** - Simulador de colores para páginas web

## Cómo Usar

### Generador de Paletas (paleta.html)
1. Selecciona el tamaño de la paleta (6, 8 o 9 colores)
2. Selecciona el formato de color (HEX, HSL o RGB)
3. Selecciona el tipo de armonía (Aleatorio, Complementario, Análogo, Triádico, Monocromático)
4. Haz clic en "Generar" para crear colores
5. Usa "★" para seleccionar colores y "Guardar" para agregar a favoritos
6. Usa "Favoritos" para ver colores guardados
7. Usa "Simulador" para ir al simulador de colores

### Simulador de Colores (simulador.html)
1. Haz clic en "Agregar Favoritos" para cargar colores guardados
2. Selecciona colores haciendo clic en ellos
3. Elige el tipo de generación (Color Sólido, Gradiente o Combinado)
4. Selecciona la sección donde aplicar el color
5. Usa los controles de Contraste, Luminosidad e Intensidad
6. Haz clic en "Aplicar Modificaciones" para aplicar cambios
7. Usa "Ver Código CSS" para obtener el código generado

## Estructura del Proyecto

```
proyectoM1_guillermoCely/
├── index.html              # Página de presentación
├── paleta.html             # Generador de paletas
├── simulador.html          # Simulador de colores
├── css/
│   ├── base/              # Estilos base (reset, typography)
│   ├── components/        # Componentes reutilizables
│   ├── layout/            # Layout de las páginas
│   ├── responsive/        # Media queries
│   ├── landing-styles.css # Estilos de presentación
│   ├── styles.css         # Estilos principales
│   └── simulador-styles.css # Estilos del simulador
├── js/
│   ├── script.js          # Lógica del generador
│   ├── utils.js           # Funciones utilitarias
│   ├── storage.js         # Gestión de favoritos
│   ├── color-modifications.js # Modificaciones de color
│   ├── preview.js         # Vista previa
│   └── main.js            # Lógica principal del simulador
└── imagen/                # Imágenes del proyecto
```

## Características

### Generador de Paletas
- Generación aleatoria de colores en HEX, HSL y RGB
- Armonías de color (Complementario, Análogo, Triádico, Monocromático)
- Selección de tamaño de paleta (6, 8 o 9 colores)
- Sistema de favoritos con LocalStorage
- Feedback visual con fantasma animado
- Copia al portapapeles con un clic

### Simulador de Colores
- Aplicación de colores sólidos y gradientes
- Controles de Contraste, Luminosidad e Intensidad
- Vista previa en tiempo real de páginas web
- Generación de código CSS
- Aplicación de colores a diferentes secciones (Navbar, Aside, Content, Footer, Botones)
- Modificaciones reversibles con CSS filters

## Tecnologías

- **HTML5** semántico
- **JavaScript** vanilla (ES6+)
- **CSS3** con módulos organizados
- **LocalStorage** para persistencia de datos

## Navegación

- Haz clic en el logo de la paleta para regresar a la presentación
- Usa el botón "Volver" en el simulador para regresar al generador
- Usa el botón "Simulador" en el generador para ir al simulador 