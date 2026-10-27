# Paleta de Colores

Aplicación web tipo SPA para generar paletas de colores, revisar sus formatos HEX, HSL y RGB, guardar favoritos y simular su aplicación en una página web.

## Rutas

La aplicación usa un único `index.html` y navegación por hash:

- `#/inicio` — presentación de la plataforma.
- `#/espacio` — Área de trabajo con las pestañas Paleta y Simulador.
- `#/espacio/simulador` — abre directamente el simulador.
- `#/acerca` — explicación de cómo se construyó la plataforma.

El logo del encabezado siempre regresa a `#/inicio`. Las pestañas Paleta y Simulador actualizan la URL sin recargar la vista. `paleta.html` y `simulador.html` se conservan como redirecciones para no romper enlaces antiguos.

## Cómo usar

### Paleta

1. Entra en **Área de trabajo**.
2. Elige el tamaño: 6, 8 o 9 colores.
3. Elige el formato principal: HEX, HSL o RGB. Cada tarjeta muestra los tres valores y permite copiarlos.
4. Elige una armonía.
5. Pulsa **Generar paleta**.
6. Marca la estrella de los colores que quieras y pulsa **Guardar seleccionados**.
7. Usa **Favoritos** para revisarlos o eliminarlos.

### Simulador

1. Abre la pestaña **Simulador**.
2. Selecciona uno o varios colores favoritos.
3. Elige el tipo: color sólido, gradiente o combinado.
4. Elige la sección: navbar, aside, contenido o footer.
5. Pulsa **Aplicar color**.
6. Ajusta contraste, luminosidad e intensidad.
7. Pulsa **Ver código CSS** para copiar el resultado.

### Tema claro y oscuro

El botón del sol o la luna en el encabezado alterna entre tema claro y oscuro. La preferencia se guarda en `localStorage` y, mientras no elijas un tema manualmente, la aplicación respeta la preferencia `prefers-color-scheme` del sistema. El tema se aplica antes del primer render para evitar destellos de color.

## Armonías y coherencia cromática

El generador parte de un matiz base y mantiene cada paleta dentro del rango visual de su armonía:

| Armonía | Matices |
| --- | --- |
| Aleatorio | Matiz base aleatorio con ventana limitada de 58 a 84 grados |
| Monocromático | Un solo matiz con variaciones de luz y saturación |
| Análogo | Ventana de 60 grados alrededor del color base |
| Complementario | 0 y 180 grados |
| Complementario dividido | 0, 150 y 210 grados |
| Triádico | 0, 120 y 240 grados |
| Tetrádico | 0, 60, 180 y 240 grados |
| Cuadrado | 0, 90, 180 y 270 grados |

Las variaciones de matiz tienen una tolerancia pequeña, se evitan los colores turbios y no se rellena la paleta con colores aleatorios que rompan la armonía.

## Estructura

```text
proyectoM1_guillermoCely/
├── index.html                 # Shell de la SPA y plantillas de vistas
├── paleta.html                # Redirección a #/espacio
├── simulador.html             # Redirección a #/espacio/simulador
├── css/
│   ├── app.css                # Punto de entrada de estilos
│   ├── layout.css             # Layout general, botones, paneles
│   ├── base/
│   │   ├── variables.css      # Variables de diseño
│   │   ├── reset.css
│   │   └── typography.css
│   ├── componentes/
│   │   ├── navegacion.css
│   │   ├── mascota.css
│   │   └── paleta.css
│   └── vistas/
│       ├── inicio.css
│       ├── espacio.css
│       └── acerca.css
├── js/
│   ├── color.js               # Conversiones HEX/HSL/RGB y contraste
│   ├── store.js               # Favoritos en localStorage
│   ├── ui.js                  # Mensajes y portapapeles
│   ├── theme.js               # Tema claro/oscuro y persistencia
│   ├── palette.js             # Generación y render de paletas
│   ├── simulator.js           # Simulador y generación de CSS
│   └── router.js              # Enrutador SPA y navegación
└── imagen/
```

## Características

- SPA con rutas por hash y sin recargas.
- Navegación responsive con menú móvil.
- Diseño mobile-first.
- Paletas con matices coherentes en la rueda de color.
- Formatos HEX, HSL y RGB visibles y copiables.
- Animación secuencial al cambiar de armonía.
- Favoritos persistentes con `localStorage`.
- Simulador con color sólido, gradiente y combinado.
- Controles de contraste, luminosidad e intensidad.
- Generación y copia de código CSS.
- Tema claro y oscuro persistente, con detección del tema del sistema.
- Mascota fantasma animada y adaptada a móvil.
- Soporte para `prefers-reduced-motion` y navegación por teclado.

## Tecnologías

- HTML5 semántico.
- CSS3 modular con variables y media queries mobile-first.
- JavaScript vanilla organizado en módulos.
- `localStorage` para persistencia.
- Enrutador SPA por hash.

## Ejecución

Puedes abrir `index.html` directamente en el navegador. Para evitar restricciones de algunos navegadores con el portapapeles, se recomienda servir la carpeta con un servidor local:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000/`.
