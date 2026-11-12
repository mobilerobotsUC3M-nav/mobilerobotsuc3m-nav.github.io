---
hide:
  - navigation
---

# Mobile Robots Group · División de navegación

Bienvenido/a a la web de recursos de la división de navegación. Aquí encontrarás los
tutoriales del grupo, las guías de trabajo y los enlaces a los repositorios de
nuestros proyectos y TFG.

<div class="grid cards" markdown>

-   :material-ubuntu:{ .lg .middle } **Ubuntu junto a Windows**

    ---

    Prepara tu ordenador: instala Ubuntu 20.04 en arranque dual sin perder Windows.

    [:octicons-arrow-right-24: Arranque dual](tutoriales/dual-boot.md)

-   :material-git:{ .lg .middle } **Git y GitHub**

    ---

    Cómo subir tu trabajo, usar ramas y no perder nada. Empieza aquí si nunca has usado Git.

    [:octicons-arrow-right-24: Primeros pasos](tutoriales/github/01-primeros-pasos.md)

-   :material-robot-industrial:{ .lg .middle } **Instalar ROS Noetic**

    ---

    Instalación de ROS 1 Noetic en Ubuntu 20.04 y creación de tu espacio de trabajo.

    [:octicons-arrow-right-24: Instalación](tutoriales/ros-noetic.md)

-   :material-lan-connect:{ .lg .middle } **ROS en varios ordenadores**

    ---

    Conecta tu portátil al robot: `ROS_MASTER_URI`, `ROS_IP`, hosts y SSH.

    [:octicons-arrow-right-24: Red ROS](tutoriales/ros-red.md)

-   :material-map-marker-path:{ .lg .middle } **Stack de navegación**

    ---

    Mapas, localización, `move_base` y costmaps, con un robot simulado en Gazebo.

    [:octicons-arrow-right-24: Navegación](tutoriales/navegacion.md)

-   :material-camera-iris:{ .lg .middle } **Cámara RealSense**

    ---

    La cámara de profundidad Intel RealSense en Python y en ROS.

    [:octicons-arrow-right-24: RealSense](tutoriales/realsense.md)

</div>

## Si acabas de llegar al grupo

Sigue estos pasos en orden la primera semana:

- [ ] Crea una cuenta en [GitHub](https://github.com) (con tu correo de la universidad si puedes) y pásale tu **nombre de usuario** a tu tutor/a.
- [ ] Acepta la invitación a la organización [`mobilerobotsUC3M-nav`](https://github.com/mobilerobotsUC3M-nav) (te llegará por correo).
- [ ] Haz el tutorial [Git y GitHub: primeros pasos](tutoriales/github/01-primeros-pasos.md) y clona tu repositorio de TFG.
- [ ] Lee las [buenas prácticas](tutoriales/github/03-buenas-practicas.md). Son cortas y te ahorrarán muchos disgustos.
- [ ] Si tu ordenador tiene Windows, instala [Ubuntu 20.04 en arranque dual](tutoriales/dual-boot.md).
- [ ] Instala [ROS Noetic](tutoriales/ros-noetic.md) si tu trabajo usa ROS.
- [ ] Antes de trabajar con un robot real, haz [ROS en varios ordenadores](tutoriales/ros-red.md).
- [ ] Mira los repos de TFG de años anteriores en la organización: son el mejor ejemplo de lo que se espera.

## Cómo nos organizamos

Todo el código del grupo vive en la organización de GitHub
[**`mobilerobotsUC3M-nav`**](https://github.com/mobilerobotsUC3M-nav). Cada persona tiene su propio repositorio y
puede ver los del resto.

| Repositorio | Qué contiene |
|---|---|
| `mobilerobotsuc3m-nav.github.io` | Esta web. Si ves un error, ¡propón el cambio! |
| `plantilla-tfg` | La plantilla a partir de la que se crean los repos de TFG |
| `tfg-AAAA-apellido-tema` | Un repositorio por cada TFG (por ejemplo `tfg-2026-garcia-path-planning`) |
| repos temáticos | Código reutilizable del grupo (`nav-…`, `vision-…`), limpio y documentado |

Cada repo de TFG sigue la misma estructura base:

```text
tfg-2026-garcia-path-planning/
├── README.md          ← qué es, cómo instalar y cómo ejecutar
├── python/            ← pruebas y algoritmos en Python
│   ├── src/
│   └── notebooks/
├── catkin_ws/
│   └── src/           ← paquetes de ROS
├── data/              ← solo datos pequeños; rosbags y datasets, fuera de Git
└── docs/              ← notas, figuras, material para la memoria
```

!!! tip "¿Has encontrado un error en un tutorial?"
    Pulsa el icono del lápiz :material-file-edit-outline: arriba a la derecha de cualquier página
    para proponer la corrección directamente en GitHub, o abre un *issue* en el repositorio de la web.
