# Cámara Intel RealSense en ROS 2

<span class="bloque bloque-ros2">ROS 2 · Ubuntu 24.04 + Jazzy</span>

Las cámaras RealSense de la serie D400 (D435, D435i, D455...) dan **imagen en color** y
**profundidad** a la vez. Los modelos terminados en **i** llevan además una **IMU**.

Al terminar este tutorial sabrás usar la cámara desde Python con el SDK (`pyrealsense2`) y
desde ROS 2 con el paquete `realsense2_camera`.

!!! note "Requisitos"
    Ubuntu 24.04 instalado de forma nativa (la RealSense **no está soportada en máquinas
    virtuales**) y [ROS 2 Jazzy](instalar-jazzy.md).

## 1. Instalar el SDK (librealsense)

El SDK incluye los drivers y el programa **RealSense Viewer** para probar la cámara.
**Desconecta la cámara** y ejecuta:

```bash
# Clave del repositorio
sudo mkdir -p /etc/apt/keyrings
curl -sSf https://librealsense.realsenseai.com/Debian/librealsenseai.asc | \
  gpg --dearmor | sudo tee /etc/apt/keyrings/librealsenseai.gpg > /dev/null

# Repositorio
sudo apt-get install -y apt-transport-https
echo "deb [signed-by=/etc/apt/keyrings/librealsenseai.gpg] https://librealsense.realsenseai.com/Debian/apt-repo $(lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/librealsense.list
sudo apt-get update

# Paquetes
sudo apt-get install -y librealsense2-dkms librealsense2-utils
```

### Comprobar la instalación

1. Conecta la cámara a un **puerto USB 3**.
2. Abre el visor con `realsense-viewer`.
3. Activa **Stereo Module** y **RGB Camera**. Pulsa **3D** para ver la nube de puntos.

!!! warning "Fíjate en el número USB que muestra el visor"
    Si pone **USB 2.x**, el cable o el puerto no son USB 3: tendrás menos resoluciones y
    cortes. Usa el cable original o uno USB 3 corto. Si el visor ofrece actualizar el
    firmware, acepta.

## 2. RealSense en Python (pyrealsense2)

En Ubuntu 24.04 **no se puede instalar con `pip` fuera de un entorno virtual** (da el error
`externally-managed-environment`). Crea uno dentro de tu repositorio. La opción
`--system-site-packages` le deja ver también los paquetes de ROS 2 (`rclpy`, `cv_bridge`...):

```bash
sudo apt install -y python3-venv
cd ~/repos/tfg-2026-apellido-tema
python3 -m venv --system-site-packages .venv
source .venv/bin/activate
pip install pyrealsense2 numpy opencv-python
```

Añade `pyrealsense2`, `numpy` y `opencv-python` a tu `requirements.txt`.

!!! info "Si `pip` no encuentra `pyrealsense2`"
    `pyrealsense2` publica versiones para cada versión de Python, y a veces tarda en
    sacarlas para la más reciente. Si `pip` dice que no encuentra una versión compatible,
    pregunta en el grupo antes de compilar nada.

### Ver color y profundidad y medir una distancia

`python/src/realsense_basico.py`:

```python
"""Muestra color y profundidad de la RealSense y la distancia al centro. 'q' para salir."""
import cv2
import numpy as np
import pyrealsense2 as rs

ANCHO, ALTO, FPS = 640, 480, 30

pipeline = rs.pipeline()
config = rs.config()
config.enable_stream(rs.stream.color, ANCHO, ALTO, rs.format.bgr8, FPS)
config.enable_stream(rs.stream.depth, ANCHO, ALTO, rs.format.z16, FPS)
pipeline.start(config)

# Alinear profundidad con color: el píxel (u, v) es el mismo punto en las dos imágenes
align = rs.align(rs.stream.color)

try:
    while True:
        frames = align.process(pipeline.wait_for_frames())
        depth_frame = frames.get_depth_frame()
        color_frame = frames.get_color_frame()
        if not depth_frame or not color_frame:
            continue

        color = np.asanyarray(color_frame.get_data())
        depth = np.asanyarray(depth_frame.get_data())

        u, v = ANCHO // 2, ALTO // 2
        distancia = depth_frame.get_distance(u, v)          # en metros; 0 = sin dato

        cv2.circle(color, (u, v), 5, (0, 255, 0), -1)
        cv2.putText(color, f"{distancia:.2f} m", (u + 10, v), cv2.FONT_HERSHEY_SIMPLEX,
                    0.8, (0, 255, 0), 2)
        depth_coloreada = cv2.applyColorMap(cv2.convertScaleAbs(depth, alpha=0.03),
                                            cv2.COLORMAP_JET)
        cv2.imshow("RealSense: color | profundidad", np.hstack((color, depth_coloreada)))
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
finally:
    pipeline.stop()
    cv2.destroyAllWindows()
```

Para pasar de un píxel a un punto 3D, grabar y reproducir, o filtrar la profundidad, el
código del SDK es **exactamente el mismo** que en ROS 1, porque no depende de ROS: mira los
ejemplos 2 y 3 del [tutorial de RealSense del bloque ROS 1](../ros1/realsense.md#ejemplo-2-de-pixel-a-punto-3d).

## 3. RealSense en ROS 2

### Instalar el paquete

```bash
sudo apt install -y ros-jazzy-realsense2-camera ros-jazzy-realsense2-description \
                    ros-jazzy-cv-bridge
```

### Lanzar la cámara

```bash
ros2 launch realsense2_camera rs_launch.py align_depth.enable:=true pointcloud.enable:=true
```

- `align_depth.enable:=true` publica la profundidad alineada con la imagen de color.
- `pointcloud.enable:=true` publica una nube de puntos con color.

!!! info "Cambia respecto a ROS 1: los topics llevan `/camera/camera/`"
    Por defecto el nodo se llama `camera` y vive en el namespace `camera`, así que los
    topics empiezan por **`/camera/camera/`**. Puedes cambiarlo al lanzar, por ejemplo
    `camera_namespace:=robot camera_name:=frontal` da topics `/robot/frontal/...`.

Los topics más útiles (con los valores por defecto):

| Topic | Contenido |
|---|---|
| `/camera/camera/color/image_raw` | Imagen en color |
| `/camera/camera/color/camera_info` | Intrínsecos de la cámara de color |
| `/camera/camera/depth/image_rect_raw` | Profundidad (sin alinear) |
| `/camera/camera/aligned_depth_to_color/image_raw` | Profundidad alineada con el color, en **milímetros** (`uint16`) |
| `/camera/camera/depth/color/points` | Nube de puntos (`sensor_msgs/msg/PointCloud2`) |

Compruébalo con:

```bash
ros2 topic list | grep camera
ros2 topic hz /camera/camera/color/image_raw
```

### Cambiar parámetros

Los parámetros siguen el formato `módulo.parámetro`. Por ejemplo, para bajar la resolución y
los FPS de la profundidad:

```bash
ros2 launch realsense2_camera rs_launch.py depth_module.depth_profile:=640x480x15
```

Con la cámara en marcha puedes ver y cambiar muchos parámetros:

```bash
ros2 param list /camera/camera
ros2 param set /camera/camera spatial_filter.enable true
```

### Ver los datos en RViz

```bash
rviz2
```

1. En **Global Options → Fixed Frame**, escribe `camera_link`.
2. **Add → By topic** → `/camera/camera/color/image_raw` → **Image**.
3. **Add → By topic** → `/camera/camera/depth/color/points` → **PointCloud2**.

!!! tip "¿RViz no muestra la imagen o la nube?"
    Despliega el display y, en **Topic → Reliability Policy**, prueba con **Best Effort**.
    En ROS 2 el emisor y el receptor tienen que tener una calidad de servicio (QoS)
    compatible, y si no lo son simplemente no llegan los datos.

### Leer la cámara desde un nodo de Python

Crea un paquete (repasa la [introducción](introduccion.md#4-tu-primer-paquete)):

```bash
cd ~/repos/tfg-2026-apellido-tema/ros2_ws/src
ros2 pkg create --build-type ament_python --license Apache-2.0 \
    --dependencies rclpy sensor_msgs cv_bridge \
    --node-name distancia_centro mi_vision
```

Sustituye `mi_vision/mi_vision/distancia_centro.py` por:

```python
"""Muestra la distancia al centro de la imagen usando la profundidad alineada."""
import numpy as np
import rclpy
from cv_bridge import CvBridge
from rclpy.node import Node
from rclpy.qos import qos_profile_sensor_data
from sensor_msgs.msg import Image


class DistanciaCentro(Node):
    def __init__(self):
        super().__init__("distancia_centro")
        self.bridge = CvBridge()
        # qos_profile_sensor_data: QoS típica de sensores, compatible con la cámara
        self.create_subscription(
            Image, "/camera/camera/aligned_depth_to_color/image_raw",
            self.callback, qos_profile_sensor_data)

    def callback(self, msg):
        # 'passthrough' mantiene el formato original: uint16 en milímetros
        depth = self.bridge.imgmsg_to_cv2(msg, desired_encoding="passthrough")
        alto, ancho = depth.shape

        # Mediana de una ventana de 11x11 píxeles, ignorando los ceros (sin dato)
        v, u = alto // 2, ancho // 2
        ventana = depth[v - 5:v + 6, u - 5:u + 6]
        validos = ventana[ventana > 0]
        if validos.size == 0:
            self.get_logger().warn("Sin datos de profundidad en el centro",
                                   throttle_duration_sec=1.0)
            return

        distancia_m = float(np.median(validos)) / 1000.0
        self.get_logger().info(f"Distancia en el centro: {distancia_m:.2f} m",
                               throttle_duration_sec=1.0)


def main():
    rclpy.init()
    nodo = DistanciaCentro()
    try:
        rclpy.spin(nodo)
    except KeyboardInterrupt:
        pass
    finally:
        nodo.destroy_node()
        rclpy.try_shutdown()
```

Compila y ejecútalo con la cámara lanzada:

```bash
cd ~/repos/tfg-2026-apellido-tema/ros2_ws
colcon build --symlink-install
source install/setup.bash
ros2 run mi_vision distancia_centro
```

!!! tip "Python puro vs. ROS 2"
    La lógica (mediana de una ventana ignorando ceros) es la misma con el SDK y con ROS 2.
    Prográmala como una función en `python/src/` y úsala desde los dos sitios.

### Grabar datos

```bash
ros2 bag record -o data/prueba_camara \
  /camera/camera/color/image_raw /camera/camera/color/camera_info \
  /camera/camera/aligned_depth_to_color/image_raw /tf_static
```

Graba **solo los topics que necesites**: con la nube de puntos la grabación crece muy
rápido. Las grabaciones **no se suben a Git**.

## Problemas frecuentes

??? failure "`No RealSense devices were found` o la cámara no aparece"
    1. Desconecta y vuelve a conectar la cámara.
    2. Comprueba que se ve con `rs-enumerate-devices`.
    3. Prueba otro puerto y cable USB 3.
    4. Cierra el `realsense-viewer`: dos programas no pueden usar la cámara a la vez.

??? failure "El nodo de ROS 2 arranca pero no llegan imágenes a mi nodo o a RViz"
    Problema de QoS: usa `qos_profile_sensor_data` en tus suscripciones y **Best Effort** en
    RViz. Comprueba con `ros2 topic info -v /camera/camera/color/image_raw` qué QoS publica la
    cámara.

??? failure "No existe `/camera/camera/aligned_depth_to_color/image_raw`"
    No has lanzado con `align_depth.enable:=true`.

??? failure "Funciona en `realsense-viewer` pero no en ROS 2"
    El paquete de ROS 2 trae su propia copia del SDK. Si la cámara tiene un firmware muy
    distinto, puede haber incompatibilidades. Mira los mensajes al lanzar `rs_launch.py` y
    consúltalo con tu tutor/a antes de cambiar el firmware o compilar nada.

## Para seguir aprendiendo

- [Repositorio del paquete de ROS 2](https://github.com/IntelRealSense/realsense-ros): todos los
  parámetros de `rs_launch.py`.
- [Ejemplos oficiales de Python del SDK](https://github.com/IntelRealSense/librealsense/tree/master/wrappers/python/examples)
