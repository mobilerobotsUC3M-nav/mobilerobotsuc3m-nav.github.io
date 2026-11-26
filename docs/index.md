---
hide:
  - toc
---

# Mobile Robots Group · División de navegación

<p class="portada-intro">
Web de recursos de la división de navegación: tutoriales, guías de trabajo y
documentación de los robots del grupo. Usa el menú de la izquierda para moverte por las secciones.
</p>

??? portada "Si acabas de llegar al grupo"

    Sigue estos pasos en orden la primera semana:

    - [ ] Crea una cuenta en [GitHub](https://github.com) (con tu correo de la universidad si puedes) y pásale tu **nombre de usuario** a tu tutor/a.
    - [ ] Acepta la invitación a la organización [`mobilerobotsUC3M-nav`](https://github.com/mobilerobotsUC3M-nav) (te llegará por correo).
    - [ ] Haz el tutorial [Git y GitHub: primeros pasos](tutoriales/github/01-primeros-pasos.md) y clona tu repositorio de TFG.
    - [ ] Lee las [buenas prácticas](tutoriales/github/03-buenas-practicas.md). Son cortas y te ahorrarán muchos disgustos.
    - [ ] Pregunta a tu tutor/a en qué **bloque** vas a trabajar: [ROS 1](tutoriales/ros1/index.md) (Ubuntu 20.04 + Noetic, el de los robots del grupo) o [ROS 2](tutoriales/ros2/index.md) (Ubuntu 24.04 + Jazzy).
    - [ ] Instala Ubuntu y ROS siguiendo los tutoriales **de tu bloque**, en orden.
    - [ ] Antes de trabajar con un robot real, lee la página de [tu robot](robots/index.md).
    - [ ] Mira los repos de TFG de años anteriores en la organización: son el mejor ejemplo de lo que se espera.

??? portada "Cómo nos organizamos"

    Todo el código del grupo vive en la organización de GitHub
    [**`mobilerobotsUC3M-nav`**](https://github.com/mobilerobotsUC3M-nav). Cada persona tiene su
    propio repositorio y puede ver los del resto.

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
    ├── catkin_ws/         ← paquetes de ROS 1 (o ros2_ws/ si trabajas en ROS 2)
    │   └── src/
    ├── data/              ← solo datos pequeños; rosbags y datasets, fuera de Git
    └── docs/              ← notas, figuras, material para la memoria
    ```

    ¿Has encontrado un error en una página? Pulsa el icono del lápiz
    :material-file-edit-outline: arriba a la derecha para proponer la corrección
    directamente en GitHub.
