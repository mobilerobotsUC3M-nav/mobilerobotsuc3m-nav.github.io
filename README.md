# Web del Mobile Robots Group · División de navegación

Código fuente de la web de recursos y tutoriales del grupo, hecha con
[MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

**Web publicada:** https://mobilerobotsuc3m-nav.github.io/

## Estructura

```text
├── mkdocs.yml                  ← configuración: título, menú, tema
├── requirements.txt
├── .github/workflows/          ← publica la web sola al hacer push a main
└── docs/                       ← el contenido: un archivo .md por página
    ├── index.md                ← portada
    ├── assets/                 ← logo, estilos, botón del menú (menu.js)
    ├── robots/                 ← TurtleBot 2 y ADAM
    └── tutoriales/
        ├── index.md
        ├── github/             ← Git y GitHub (común)
        ├── ros1/               ← bloque Ubuntu 20.04 + ROS 1 Noetic
        └── ros2/               ← bloque Ubuntu 24.04 + ROS 2 Jazzy
```

## Puesta en marcha (solo la primera vez)

1. **Crea el repositorio** público en la organización `mobilerobotsUC3M-nav` con el nombre
   exacto `mobilerobotsuc3m-nav.github.io` y sube este contenido a la rama `main`.

2. **Espera a que termine la acción** "Publicar web" (pestaña *Actions*). Crea la rama `gh-pages`.

3. En **Settings → Pages**, en *Source* elige **Deploy from a branch**, rama **`gh-pages`**,
   carpeta **`/ (root)`**, y guarda.

En un par de minutos la web estará en https://mobilerobotsuc3m-nav.github.io/.

## Editar la web

- **Cambiar un texto:** edita el `.md` correspondiente en `docs/` y haz push. La web se
  actualiza sola en uno o dos minutos.
- **Añadir una página:** crea el `.md` en `docs/` y añádelo al menú (`nav:`) en `mkdocs.yml`.

### Ver los cambios en tu ordenador antes de subirlos

```bash
pip install -r requirements.txt
mkdocs serve
```

Abre http://127.0.0.1:8000. La página se recarga sola al guardar cambios.

## Elementos útiles al escribir

````markdown
!!! tip "Título"
    Caja de consejo. También: note, info, warning, danger, example, question.

??? failure "Título desplegable"
    Contenido que aparece al pulsar.

=== "Pestaña 1"
    Contenido A

=== "Pestaña 2"
    Contenido B

- [ ] Lista de comprobación

```bash
comando --que se puede copiar con un clic
```
````

Referencia completa: https://squidfunk.github.io/mkdocs-material/reference/
