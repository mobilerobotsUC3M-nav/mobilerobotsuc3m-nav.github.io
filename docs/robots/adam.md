# ADAM (base RB-1)

ADAM es un robot **RB1-Dual UR3** de Robotnik: una base móvil **RB-1**, un torso y dos brazos
UR3. Esta página cubre **solo la base**: encenderla, conectarte a ella, qué software trae y
cómo mapear y navegar.

!!! warning "Los brazos no se tratan aquí"
    Para trabajar con el torso o los brazos UR3, habla antes con tu tutor/a. Tienen su propia
    secuencia de encendido y sus propias normas de seguridad.

## 1. La base RB-1

- **Diámetro:** 500 mm.
- **Tracción diferencial:** una rueda motorizada a cada lado (con encoder) y tres ruedas
  omnidireccionales de apoyo, dos delante y una detrás. Puede avanzar, retroceder y girar
  sobre sí misma, pero **no desplazarse de lado**.
- **Láser 2D frontal:** 270° de campo de visión. Detecta obstáculos hasta una altura de 195 mm
  sobre el suelo: lo que esté más alto (una mesa, por ejemplo) no lo ve el láser.
- **Cámara RGB-D frontal:** color y profundidad.
- **IMU** en el interior de la base.
- **CPU** integrada en la base, con ROS y todo el software del robot ya instalado.

### Panel trasero de la base

| Nº | Elemento | Para qué sirve |
|---|---|---|
| 1 | **OFF/ON** (llave) | Alimentación de la base |
| 2 | **OFF/ON ARMS** (llave) | Alimentación de los brazos. **No lo toques si solo usas la base** |
| 3 | USB | Pantalla, teclado, ratón, receptor del mando |
| 4 | HDMI | Pantalla |
| 5 | Ethernet | Conexión por cable |
| 6 | **Seta de emergencia** | Para la base inmediatamente |
| 7 | Puerto de carga | Cargador manual |
| 8 | **Botón de la CPU** | Enciende y apaga el ordenador de la base; su luz indica si está encendido |

## 2. Encender, apagar y cargar

### Encender (solo la base)

1. Gira la llave **OFF/ON** (1) en sentido horario.
2. Espera **unos minutos** a que termine la secuencia de arranque. La luz del botón de la CPU (8)
   se enciende cuando el ordenador está en marcha.

Al arrancar, la base lanza **sola** sus drivers y sensores (láser, cámara, IMU, odometría y
control). No hace falta lanzar `roscore` ni ningún bringup: en cuanto termina el arranque, los
topics del robot ya están disponibles.

### Apagar

1. Cierra todo lo que hayas lanzado tú (++ctrl+c++).
2. Pulsa el botón de la **CPU** (8) y espera a que su luz se apague.
3. Gira la llave **OFF/ON** (1) en sentido antihorario.

### Cargar

Conecta el cargador a la red y al puerto de carga (7) y pulsa su interruptor. La carga completa
tarda **entre 45 y 60 minutos**, y el robot puede seguir funcionando mientras carga.

El nivel de batería está en el topic `/robot/battery_estimator/data`: el campo `level` es la
carga y `time_remaining` el tiempo de uso restante.

```bash
rostopic echo -n 1 /robot/battery_estimator/data
```

## 3. Conectarte al robot

La base tiene **su propia red wifi**. Tu portátil se conecta a ella y desde ahí accede a ROS y
al ordenador del robot.

| Dato | Valor |
|---|---|
| Red wifi | `RB100-191204AA` |
| Contraseña wifi | Pídesela a tu tutor/a |
| IP del robot | `192.168.0.200` |
| Nombre del robot en la red | `RB100-191108AA` |
| Usuario para SSH | `robot` (contraseña: la misma que la de la wifi) |

### Paso a paso

1. **Conéctate a la wifi del robot** y mira tu IP con `hostname -I` (será del tipo `192.168.0.x`).

2. **Enseña a tu portátil el nombre del robot.** Los nodos del robot se anuncian con su nombre
   (`RB100-191108AA`), así que tu portátil tiene que saber qué IP es. Añade esta línea a tu
   `/etc/hosts` (con `sudo nano /etc/hosts`):

    ```text
    192.168.0.200    RB100-191108AA
    ```

3. **Configura la red ROS** en cada terminal de tu portátil:

    ```bash
    export ROS_MASTER_URI=http://RB100-191108AA:11311
    export ROS_IP=TU_IP          # la del paso 1
    ```

    O, si añadiste las funciones del tutorial de red a tu `.bashrc`, pon `ROBOT_IP=192.168.0.200`
    y escribe `ros_robot`.

4. **Compruébalo** en los dos sentidos: que ves los topics (`rostopic list`) y que te llegan
   datos (`rostopic echo -n 1 /robot/front_laser/scan`).

!!! info "Alternativa: usar nombres en los dos sentidos"
    En lugar de `ROS_IP`, también puedes añadir **tu portátil** al `/etc/hosts` del robot
    (con tu IP y el nombre de tu ordenador, que ves con `hostname`). Así el robot sabe llegar a ti
    por tu nombre. Es lo mismo que se explica en
    [ROS en varios ordenadores](../tutoriales/ros-red.md#4-usar-nombres-en-vez-de-ips-etchosts).

### Entrar en el ordenador del robot

```bash
ssh robot@192.168.0.200        # o: ssh robot@RB100-191108AA
```

## 4. Software instalado

### Namespace `/robot` y prefijo `robot_`

Todo el software de la base vive bajo el namespace **`/robot`**, y sus sistemas de referencia
llevan el prefijo **`robot_`**. Por eso:

- Los topics son `/robot/front_laser/scan`, `/robot/move_base/goal`...
- Los frames son `robot_map`, `robot_odom`, `robot_base_link`...
- Al lanzar algo del robot hay que indicar el namespace con `ROS_NAMESPACE=robot`.
- En RViz, el **Fixed Frame** es `robot_map` (o `robot_odom` si no hay mapa).

### Paquetes y componentes

| Paquete o componente | Para qué sirve |
|---|---|
| `rb1_base_localization` | Launch de mapeado (`gmapping.launch`), carga de mapas (`map_server.launch`) y localización (`amcl.launch`) ya configurados para la RB-1 |
| `rb1_base_navigation` | `move_base` configurado para la RB-1 (`move_base.launch`) |
| `robotnik_base_control` | Controlador de la base: recibe velocidades y publica la odometría |
| `robotnik_base_hw` | Driver de bajo nivel: motores, entradas/salidas, parada de emergencia, voltaje |
| Teleoperación (`pad_teleop`) | Convierte el mando en velocidades |
| `battery_estimator` | Estima el nivel de batería |
| `imu_manager` | Gestiona y calibra la IMU |
| `robot_local_control` | Capa de control de alto nivel de Robotnik (misiones, carga, ir a puntos). No la necesitas para navegar con ROS |
| `rosmon` | Lanza y vigila los procesos del robot al arrancar (de ahí los topics `/rosmon_*`) |

Para ver la lista completa de paquetes de Robotnik instalados en el robot:

```bash
rospack list | grep -i -E "rb1|robotnik"
```

### Topics principales

| Topic | Tipo | Qué contiene |
|---|---|---|
| `/robot/front_laser/scan` | `sensor_msgs/LaserScan` | Láser frontal |
| `/robot/front_laser/filtered_scan` | `sensor_msgs/LaserScan` | Láser frontal filtrado |
| `/robot/front_rgbd_camera/rgb/image_raw` | `sensor_msgs/Image` | Imagen en color de la cámara |
| `/robot/front_rgbd_camera/depth/image_raw` | `sensor_msgs/Image` | Imagen de profundidad |
| `/robot/front_rgbd_camera/depth_registered/points` | `sensor_msgs/PointCloud2` | Nube de puntos con color |
| `/robot/imu/data` | `sensor_msgs/Imu` | IMU |
| `/robot/robotnik_base_control/odom` | `nav_msgs/Odometry` | Odometría |
| `/robot/cmd_vel` | `geometry_msgs/Twist` | Velocidad para mover la base desde tu código (ver abajo) |
| `/robot/pad_teleop/cmd_vel` | `geometry_msgs/Twist` | Velocidad que genera el mando |
| `/robot/move_base/cmd_vel` | `geometry_msgs/Twist` | Velocidad que genera la navegación |
| `/robot/robotnik_base_control/cmd_vel` | `geometry_msgs/Twist` | Velocidad que llega finalmente al controlador de la base |
| `/robot/joy` | `sensor_msgs/Joy` | Botones y joysticks del mando |
| `/robot/battery_estimator/data` | | Nivel de batería y tiempo restante |
| `/robot/robotnik_base_hw/emergency_stop` | | Estado de la parada de emergencia |
| `/robot/joint_states` | `sensor_msgs/JointState` | Estado de las ruedas |
| `/robot/amcl_pose`, `/robot/robot_pose` | | Posición del robot (con `amcl` lanzado) |
| `/robot/move_base_simple/goal` | `geometry_msgs/PoseStamped` | Objetivo de navegación sencillo |
| `/tf`, `/tf_static` | | Transformadas |

!!! tip "Mover la base desde tu código"
    La base recibe velocidades de varias fuentes (mando, navegación, tu código...) y un
    multiplexor decide cuál pasa al controlador. Antes de publicar en `/robot/cmd_vel`,
    comprueba que alguien lo escucha:

    ```bash
    rostopic info /robot/cmd_vel
    ```

    Si en **Subscribers** aparece un nodo (el multiplexor), ese es el topic que tienes que usar.
    Si no aparece ninguno, consúltalo con tu tutor/a antes de publicar directamente en
    `/robot/robotnik_base_control/cmd_vel`.

??? note "Otros topics que verás y para qué son"
    La lista completa (`rostopic list`) es muy larga. Estos grupos los puedes ignorar para navegar:

    | Grupo | Qué es |
    |---|---|
    | `/robot/front_rgbd_camera/.../compressed`, `.../theora` | Versiones comprimidas de las imágenes de la cámara. Útiles para verlas por wifi sin saturar la red |
    | `/robot/diff_docker`, `/robot/pp_docker`, `/robot/charge_manager`, `/robot/*_locator` | Acoplamiento automático a la estación de carga y detección de carros y marcadores |
    | `/robot/robot_local_control/...` | Control de alto nivel de Robotnik |
    | `/robot/mavros/...`, `/robot/mavlink/...` | Comunicación MAVLink que trae el software de Robotnik. No se usa |
    | `/rosmon_*` | Estado de los grupos de procesos del robot (bringup, navegación, percepción...) |
    | `/robot/left_arm/...`, `/robot/right_arm/...` | Brazos. Solo tienen datos con los brazos encendidos |

## 5. Teleoperación con el mando

1. Conecta el **receptor Bluetooth USB** del mando a uno de los USB de la base.
2. Pulsa el botón de **encendido** del mando. La luz parpadea hasta que se conecta y luego se
   queda **azul**.
3. Mantén pulsado el **botón *deadman*** todo el tiempo: si lo sueltas, el robot se para.
4. Un **joystick** controla la velocidad lineal (avanzar y retroceder) y el otro la angular (girar).
5. **Triángulo** sube la velocidad y **cruz** la baja.

## 6. Hacer un mapa

Desde tu portátil (con la red ROS configurada) o por SSH en el robot:

```bash
# Terminal 1: SLAM con gmapping
ROS_NAMESPACE=robot roslaunch rb1_base_localization gmapping.launch \
    scan_topic:=/robot/front_laser/scan
```

Mueve el robot con el mando por todo el entorno. En RViz, pon **Fixed Frame** en `robot_map` y
añade **Map** (`/robot/map`) y **LaserScan** (`/robot/front_laser/scan`).

Cuando esté completo, guárdalo **sin cerrar gmapping**:

```bash
# Terminal 2
rosrun map_server map_saver -f NombreDelMapa map:=/robot/map
```

## 7. Navegar con el mapa

Cierra gmapping y lanza, cada uno en su terminal:

```bash
# Terminal 1: cargar el mapa
ROS_NAMESPACE=robot roslaunch rb1_base_localization map_server.launch \
    prefix:=robot_ map_file:=/ruta/hasta/NombreDelMapa.yaml frame_id:=robot_map

# Terminal 2: localización
ROS_NAMESPACE=robot roslaunch rb1_base_localization amcl.launch

# Terminal 3: navegación (solo cuando el mapa y amcl ya estén en marcha)
ROS_NAMESPACE=robot roslaunch rb1_base_navigation move_base.launch frame_id:=robot_map
```

En RViz, da la posición inicial con **2D Pose Estimate** y el destino con **2D Nav Goal**.
Comprueba antes que en las propiedades de esas herramientas los topics son
`/robot/initialpose` y `/robot/move_base_simple/goal`. Si no, RViz los manda a un sitio donde
nadie escucha.

### Mandar un objetivo desde la terminal

```bash
rostopic pub -1 /robot/move_base_simple/goal geometry_msgs/PoseStamped \
  '{header: {stamp: now, frame_id: "robot_map"}, pose: {position: {x: 0.0, y: 0.0, z: 0.0}, orientation: {w: 1.0}}}'
```

Cambia `position` y `orientation` por la pose que quieras. Si el objetivo no es alcanzable,
la terminal de `move_base` mostrará:
`Aborting because a valid plan could not be found. Even after executing all recovery behaviours`.

### Mandar objetivos desde Python

El script del [tutorial de navegación](../tutoriales/navegacion.md#5-enviar-objetivos-desde-python)
sirve con dos cambios:

```python
cliente = actionlib.SimpleActionClient("/robot/move_base", MoveBaseAction)
...
goal.target_pose.header.frame_id = "robot_map"
```

## Problemas frecuentes

??? failure "Veo los topics con `rostopic list` pero `rostopic echo` no muestra nada"
    Falta la línea del robot en tu `/etc/hosts` o `ROS_IP` está mal en tu portátil. Repasa el
    [apartado 3](#3-conectarte-al-robot).

??? failure "El robot no se mueve con el mando"
    - ¿Está la luz del mando fija en azul?
    - ¿Mantienes pulsado el botón *deadman*?
    - ¿Está pulsada la seta de emergencia? Compruébalo con
      `rostopic echo -n 1 /robot/robotnik_base_hw/emergency_stop`.

??? failure "RViz no muestra nada o dice que no existe el frame"
    Pon el **Fixed Frame** en `robot_map` (con mapa) o `robot_odom` (sin mapa), no en `map`.

??? failure "La navegación no hace nada al dar un objetivo en RViz"
    Revisa que las herramientas de RViz publican en `/robot/initialpose` y
    `/robot/move_base_simple/goal` (apartado 7), y que has lanzado el mapa y `amcl` antes que
    `move_base`.

??? failure "El robot choca con una mesa aunque la navegación está activa"
    El láser solo ve obstáculos por debajo de 195 mm. Para los que están más altos hace falta
    añadir la cámara a los costmaps. Coméntalo con tu tutor/a.
