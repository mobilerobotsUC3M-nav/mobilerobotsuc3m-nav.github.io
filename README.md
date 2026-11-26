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
        ├── dual-boot.md        ← Ubuntu junto a Windows
        ├── github/             ← 3 páginas de Git y GitHub
        ├── ros-noetic.md
        ├── ros-red.md          ← ROS_MASTER_URI, ROS_IP, hosts, SSH
        ├── navegacion.md
        └── realsense.md
```
