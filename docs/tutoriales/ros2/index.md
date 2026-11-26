# Bloque ROS 2: Ubuntu 24.04 + Jazzy

<span class="bloque bloque-ros2">ROS 2 · Ubuntu 24.04 + Jazzy</span>

!!! info "Este bloque usa Ubuntu 24.04 y ROS 2 Jazzy"
    **Jazzy Jalisco** es la versión de ROS 2 con soporte largo (LTS) para **Ubuntu 24.04**.
    Todo lo que hay aquí asume esa combinación: no sirve para Ubuntu 20.04 ni para ROS 1.
    Los robots del grupo funcionan con ROS 1, así que para trabajar con ellos usa el
    [bloque ROS 1](../ros1/index.md).

Síguelos en este orden:

1. [Instalar Ubuntu 24.04 junto a Windows](ubuntu24.md): si tu ordenador tiene Windows.
2. [Instalar ROS 2 Jazzy](instalar-jazzy.md): instalación y comprobación.
3. [Introducción a ROS 2](introduccion.md): conceptos, espacio de trabajo con `colcon`, primer
   paquete, nodos, *launch files* y diferencias con ROS 1.
4. [ROS 2 en varios ordenadores](red.md): `ROS_DOMAIN_ID`, descubrimiento automático y problemas de red.
5. [Navegación con Nav2](navegacion.md): SLAM, localización y navegación en simulación.
6. [Cámara RealSense](realsense.md): la cámara de profundidad en Python y en ROS 2.

## Si vienes de ROS 1

| ROS 1 (Noetic) | ROS 2 (Jazzy) |
|---|---|
| `roscore` (master) | No hay master: los nodos se descubren solos en la red |
| `ROS_MASTER_URI`, `ROS_IP` | `ROS_DOMAIN_ID`, `ROS_AUTOMATIC_DISCOVERY_RANGE` |
| `catkin_make`, `devel/` | `colcon build`, `install/` |
| `rosrun paquete nodo` | `ros2 run paquete nodo` |
| `roslaunch` con XML | `ros2 launch` con Python (o XML/YAML) |
| `rostopic`, `rosnode`, `rosbag` | `ros2 topic`, `ros2 node`, `ros2 bag` |
| `rospy` | `rclpy` |
| `move_base` | Nav2 (`bt_navigator`, `planner_server`, `controller_server`...) |
| `gmapping` | `slam_toolbox` |
| Gazebo Classic | Gazebo (Harmonic) |
