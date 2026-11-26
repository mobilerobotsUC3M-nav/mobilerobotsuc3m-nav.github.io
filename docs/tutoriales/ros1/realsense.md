# Cámara Intel RealSense

<span class="bloque bloque-ros1">ROS 1 · Ubuntu 20.04 + Noetic</span>

Las cámaras RealSense de la serie D400 (D435, D435i, D455...) dan a la vez **imagen en
color** y **profundidad**: para cada píxel, a qué distancia está lo que se ve. Los modelos
terminados en **i** llevan además una **IMU** (acelerómetro y giróscopo).

Al terminar este tutorial sabrás usar la cámara de dos formas:

- **Desde Python con el SDK** (`pyrealsense2`), para prototipar algoritmos de visión.
- **Desde ROS** (`realsense2_camera`), para integrarla con el robot y la navegación.

!!! note "Requisitos"
    Ubuntu 20.04 instalado de forma nativa (la RealSense **no está soportada en máquinas
    virtuales**). Para la parte de ROS, [ROS Noetic](instalar-noetic.md).

## 1. Instalar el SDK (librealsense)

El SDK incluye los drivers, la librería y el programa **RealSense Viewer** para probar la cámara.

!!! info "Instrucciones de 2025 en adelante"
    El repositorio de paquetes se ha movido al dominio `realsenseai.com`. Si encuentras
    tutoriales con `librealsense.intel.com` o `realsense-hw-public.s3.amazonaws.com`, son
    antiguos: usa los comandos de esta página.

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

1. **Conecta la cámara a un puerto USB 3** (suelen ser azules o llevar el símbolo "SS").
2. Abre el visor:

    ```bash
    realsense-viewer
    ```

3. Activa los interruptores **Stereo Module** (profundidad) y **RGB Camera** (color).
   Deberías ver las dos imágenes. Pulsa **3D** arriba a la derecha para ver la nube de puntos.

!!! warning "Fíjate en el número USB que muestra el visor"
    Si junto al nombre de la cámara pone **USB 2.x**, el cable o el puerto no son USB 3 y
    tendrás menos resoluciones, menos FPS y cortes. Usa el cable original o uno USB 3 corto.

!!! tip "Actualiza el firmware"
    Si el visor avisa de que hay un firmware más reciente, acepta la actualización. Muchos
    problemas raros desaparecen con ella.

## 2. RealSense en Python (pyrealsense2)

### Preparar el entorno

Trabaja dentro de la carpeta `python/` de tu repositorio, con un **entorno virtual**.
La opción `--system-site-packages` permite que el entorno vea también los paquetes de ROS
(`rospy`, `cv_bridge`...), así te sirve para las dos partes del tutorial.

```bash
sudo apt install -y python3-venv
cd ~/repos/tfg-2026-apellido-tema
python3 -m venv --system-site-packages .venv
source .venv/bin/activate
pip install --upgrade pip
pip install pyrealsense2 numpy opencv-python
```

Añade las dependencias a tu `requirements.txt` para que cualquiera pueda reproducir tu entorno:

```text
pyrealsense2
numpy
opencv-python
```

!!! info "En una Jetson (ARM)"
    `pip install pyrealsense2` funciona en ordenadores x86-64. En placas ARM como la
    Jetson suele hacer falta compilar el SDK con las opciones de Python activadas.
    Pregunta en el grupo antes de pelearte con ello.

### Ejemplo 1: ver color y profundidad, y medir una distancia

`python/src/realsense_basico.py`:

```python
"""Muestra color y profundidad de la RealSense y la distancia al centro de la imagen.

Pulsa 'q' para salir.
"""
import cv2
import numpy as np
import pyrealsense2 as rs

ANCHO, ALTO, FPS = 640, 480, 30

# 1. Configurar qué flujos queremos
pipeline = rs.pipeline()
config = rs.config()
config.enable_stream(rs.stream.color, ANCHO, ALTO, rs.format.bgr8, FPS)
config.enable_stream(rs.stream.depth, ANCHO, ALTO, rs.format.z16, FPS)

# 2. Arrancar la cámara
pipeline.start(config)

# 3. Alinear profundidad con color: así el píxel (u, v) es el mismo punto en las dos imágenes
align = rs.align(rs.stream.color)

try:
    while True:
        frames = align.process(pipeline.wait_for_frames())
        depth_frame = frames.get_depth_frame()
        color_frame = frames.get_color_frame()
        if not depth_frame or not color_frame:
            continue

        color = np.asanyarray(color_frame.get_data())   # (480, 640, 3) BGR
        depth = np.asanyarray(depth_frame.get_data())   # (480, 640) uint16, en unidades del sensor

        # Distancia en metros en el centro de la imagen
        u, v = ANCHO // 2, ALTO // 2
        distancia = depth_frame.get_distance(u, v)

        # Dibujar
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

```bash
python python/src/realsense_basico.py
```

!!! note "Una distancia de 0.00 m significa 'sin dato'"
    Ocurre en superficies muy brillantes, transparentes o negras, muy cerca de la cámara
    (menos de unos 20 cm) o en las sombras de los bordes. Tenlo en cuenta en tus algoritmos:
    filtra los ceros antes de calcular medias.

### Ejemplo 2: de píxel a punto 3D

Si detectas un objeto en la imagen (por ejemplo con una red neuronal) y quieres saber
**dónde está en el espacio**, usa los **parámetros intrínsecos** de la cámara para
"desproyectar" el píxel:

```python
# Dentro del bucle anterior, después de calcular 'distancia':
intrinsecos = color_frame.profile.as_video_stream_profile().intrinsics
x, y, z = rs.rs2_deproject_pixel_to_point(intrinsecos, [u, v], distancia)
print(f"Punto 3D: x={x:.2f}  y={y:.2f}  z={z:.2f} m")
```

Las coordenadas están en el **sistema óptico de la cámara**: `z` hacia delante, `x` hacia la
derecha e `y` hacia abajo.

### Ejemplo 3: grabar y reproducir

Grabar en el laboratorio y desarrollar luego en casa sin la cámara es muy útil:

```python
# Grabar: añade esta línea antes de pipeline.start(config)
config.enable_record_to_file("data/prueba.bag")

# Reproducir: sustituye los enable_stream por esta línea
config.enable_device_from_file("data/prueba.bag")
```

El resto del código no cambia. También puedes grabar desde el **RealSense Viewer** con el
botón **Record**.

!!! warning "Estos archivos ocupan mucho"
    Un minuto de color + profundidad puede ocupar más de 1 GB. **No los subas a Git**
    (las [buenas prácticas](../github/03-buenas-practicas.md) explican qué hacer con ellos).

## 3. RealSense en ROS Noetic

### Instalar el paquete de ROS

```bash
sudo apt install -y ros-noetic-realsense2-camera ros-noetic-realsense2-description \
                    ros-noetic-rgbd-launch
```

!!! tip "Si la cámara funciona en el visor pero no en ROS"
    Revisa la sección de [problemas frecuentes](#problemas-frecuentes) al final de la página.

### Lanzar la cámara

```bash
roslaunch realsense2_camera rs_camera.launch align_depth:=true filters:=pointcloud
```

- `align_depth:=true` publica la profundidad alineada con la imagen de color (equivalente a
  `rs.align` en Python).
- `filters:=pointcloud` publica una nube de puntos con color.

Los topics más útiles:

| Topic | Contenido |
|---|---|
| `/camera/color/image_raw` | Imagen en color |
| `/camera/color/camera_info` | Intrínsecos de la cámara de color |
| `/camera/depth/image_rect_raw` | Profundidad (sin alinear) |
| `/camera/aligned_depth_to_color/image_raw` | Profundidad alineada con el color, en **milímetros** (`uint16`) |
| `/camera/depth/color/points` | Nube de puntos (`sensor_msgs/PointCloud2`) |

Compruébalo con `rostopic list | grep camera` y `rostopic hz /camera/color/image_raw`.

### Ver los datos en RViz

```bash
rviz
```

1. En **Global Options → Fixed Frame**, escribe `camera_link`.
2. **Add → By topic** → `/camera/color/image_raw` → **Image**.
3. **Add → By topic** → `/camera/depth/color/points` → **PointCloud2**.

### Leer la cámara desde un nodo de Python

`catkin_ws/src/mi_vision/scripts/distancia_centro.py` (crea el paquete con
`catkin_create_pkg mi_vision rospy sensor_msgs cv_bridge`):

```python
#!/usr/bin/env python3
"""Muestra la distancia al centro de la imagen usando la profundidad alineada."""
import numpy as np
import rospy
from cv_bridge import CvBridge
from sensor_msgs.msg import Image


class DistanciaCentro:
    def __init__(self):
        self.bridge = CvBridge()
        rospy.Subscriber("/camera/aligned_depth_to_color/image_raw", Image,
                         self.callback, queue_size=1)

    def callback(self, msg):
        # 'passthrough' mantiene el formato original: uint16 en milímetros
        depth = self.bridge.imgmsg_to_cv2(msg, desired_encoding="passthrough")
        alto, ancho = depth.shape

        # Mediana de una ventana de 11x11 píxeles, ignorando los ceros (sin dato)
        v, u = alto // 2, ancho // 2
        ventana = depth[v - 5:v + 6, u - 5:u + 6]
        validos = ventana[ventana > 0]
        if validos.size == 0:
            rospy.logwarn_throttle(1.0, "Sin datos de profundidad en el centro")
            return

        distancia_m = float(np.median(validos)) / 1000.0
        rospy.loginfo_throttle(1.0, f"Distancia en el centro: {distancia_m:.2f} m")


if __name__ == "__main__":
    rospy.init_node("distancia_centro")
    DistanciaCentro()
    rospy.spin()
```

Hazlo ejecutable, regístralo con `catkin_install_python` en el `CMakeLists.txt`, compila y
ejecútalo con la cámara lanzada:

```bash
rosrun mi_vision distancia_centro.py
```

!!! tip "Python puro vs. ROS"
    Observa que la lógica (mediana de una ventana ignorando ceros) es la misma en los dos casos.
    Prográmala como una función en `python/src/` y úsala desde el script del SDK y desde el nodo
    de ROS. Así la pruebas sin ROS y no la duplicas.

### Grabar un rosbag

```bash
rosbag record -O data/prueba_camara.bag \
  /camera/color/image_raw /camera/color/camera_info \
  /camera/aligned_depth_to_color/image_raw /tf_static
```

Graba **solo los topics que necesites**: con la nube de puntos el archivo crece muy rápido.
Para reproducirlo: `rosbag play data/prueba_camara.bag`.

## Problemas frecuentes

??? failure "`No RealSense devices were found` o la cámara no aparece"
    1. Desconecta y vuelve a conectar la cámara (si la tenías conectada al instalar, las reglas
       USB no se aplicaron).
    2. Comprueba que se ve con `rs-enumerate-devices`.
    3. Prueba otro puerto y cable USB 3.
    4. Cierra el `realsense-viewer`: dos programas no pueden usar la cámara a la vez.

??? failure "`Frame didn't arrive within 5000` en Python"
    La cámara no está enviando datos con esa configuración. Suele ser por estar en USB 2
    (resoluciones no disponibles) o porque otro programa la está usando.

??? failure "Funciona en `realsense-viewer` pero no en ROS"
    El paquete de ROS trae su propia copia del SDK, más antigua que la del sistema. Si la cámara
    tiene un firmware muy reciente, puede haber incompatibilidades. Mira los mensajes en rojo al
    lanzar `rs_camera.launch` y consúltalo con tu tutor/a antes de cambiar el firmware o compilar
    nada.

??? failure "La profundidad tiene muchos agujeros o ruido"
    Es normal en superficies sin textura, brillantes u oscuras. Prueba los filtros del SDK
    (`rs.spatial_filter()`, `rs.temporal_filter()`, `rs.hole_filling_filter()`) o en ROS
    `filters:=spatial,temporal,pointcloud`.

## Para seguir aprendiendo

- [Ejemplos oficiales de Python del SDK](https://github.com/IntelRealSense/librealsense/tree/master/wrappers/python/examples)
- [Wrapper de ROS 1 (rama `ros1-legacy`)](https://github.com/IntelRealSense/realsense-ros/tree/ros1-legacy):
  todos los parámetros de `rs_camera.launch`.
