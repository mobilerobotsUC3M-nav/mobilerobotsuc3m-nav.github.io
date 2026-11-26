# Robots del grupo

<span class="bloque bloque-ros1">ROS 1 · Ubuntu 20.04 + Noetic</span>

Estas páginas explican cómo funcionan las **bases móviles** de los robots del grupo: cómo se
encienden, cómo te conectas a ellas, qué paquetes traen instalados, qué topics publican y
cómo hacer un mapa y navegar.

| | [TurtleBot 2](turtlebot2.md) | [ADAM (base RB-1)](adam.md) |
|---|---|---|
| **Base** | Kobuki (Yujin Robot) | RB-1 (Robotnik) |
| **Tracción** | Diferencial, 2 ruedas motrices | Diferencial, 2 ruedas motrices + 3 ruedas omnidireccionales de apoyo |
| **Láser 2D** | Hokuyo URG, conectado por USB al KIRA | Láser frontal integrado (270°) |
| **Otros sensores** | Bumpers, sensores de caída, giróscopo | Cámara RGB-D frontal, IMU |
| **Ordenador** | KIRA, montado encima del robot | CPU integrada en la base |
| **Cómo te conectas** | Al KIRA, directamente o en remoto a través del router `navibot` | Wifi propia del robot + red ROS |
| **Qué hay que lanzar** | Todo: base, láser, transformada, navegación | La base arranca sola al encenderla; solo lanzas mapa y navegación |
| **Topics** | Sin prefijo (`/odom`, `/scan`...) | Bajo `/robot/` (`/robot/front_laser/scan`...) |

## Normas básicas con los robots reales

!!! danger "Antes de mover un robot"
    - **Siempre debe haber alguien junto al robot** mientras se mueve, con acceso a la parada
      de emergencia o al interruptor.
    - Empieza con **velocidades bajas** y en una zona despejada.
    - Prueba primero tu código **en simulación** o con un rosbag.
    - Si el robot hace algo raro, **páralo primero** y piensa después.

!!! tip "Repasa antes estos tutoriales"
    - [ROS en varios ordenadores](../tutoriales/ros1/red.md): para conectar tu portátil al robot.
    - [Stack de navegación](../tutoriales/ros1/navegacion.md): para entender qué hacen `gmapping`,
      `amcl` y `move_base` antes de usarlos en un robot real.
