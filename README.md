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
