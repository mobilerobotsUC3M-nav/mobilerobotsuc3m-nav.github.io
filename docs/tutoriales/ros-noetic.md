# Instalar ROS Noetic

Al terminar tendrás ROS 1 Noetic instalado en Ubuntu 20.04, tu espacio de trabajo
(`catkin_ws`) compilando y un primer nodo propio funcionando.

## Requisitos

- **Ubuntu 20.04 (Focal Fossa)**. Noetic solo se instala con paquetes en esta versión.
- Instalado **de forma nativa**: si tu ordenador tiene Windows, sigue antes el tutorial
  [Instalar Ubuntu junto a Windows](dual-boot.md). Una máquina virtual sirve
  para aprender, pero da problemas con Gazebo (gráficos lentos) y con cámaras USB 3 como la
  RealSense, que no está soportada en máquinas virtuales.
- Unos 10 GB libres y conexión a internet.

!!! tip "¿Tienes Ubuntu 22.04 o 24.04 y no quieres reinstalar?"
    Puedes usar Noetic dentro de **Docker** con la imagen oficial `osrf/ros:noetic-desktop-full`.
    Funciona bien para código, pero las ventanas gráficas (RViz, Gazebo) y el acceso a
    dispositivos USB requieren configuración extra. Pregunta en el grupo antes de ir por
    esta vía.

## 1. Preparar Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl software-properties-common
sudo add-apt-repository universe
```

## 2. Añadir el repositorio de ROS

Desde junio de 2025, ROS distribuye su clave de firma y la configuración del repositorio en
un paquete llamado `ros-apt-source`, que se mantiene actualizado solo. Esto evita los errores
de "clave caducada" de las instrucciones antiguas.

```bash
# Busca la última versión del paquete ros-apt-source
export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F\" '{print $4}')
echo $ROS_APT_SOURCE_VERSION    # debe mostrar un número de versión; si sale vacío, repite el comando

# Descárgalo e instálalo
curl -L -o /tmp/ros-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo $VERSION_CODENAME)_all.deb"
sudo apt install -y /tmp/ros-apt-source.deb
sudo apt update
```

!!! warning "Si en internet encuentras instrucciones con `apt-key add`"
    Son anteriores a 2025 y usan una clave caducada. Si ya las seguiste y `sudo apt update`
    da errores de firma (`EXPKEYSIG` o `NO_PUBKEY`) del repositorio de ROS, borra la
    configuración antigua y repite el paso 2:

    ```bash
    sudo rm -f /etc/apt/sources.list.d/ros-latest.list /etc/apt/sources.list.d/ros1-latest.list
    ```

## 3. Instalar ROS

Instala la versión completa, que incluye RViz, Gazebo y las librerías de percepción:

```bash
sudo apt install -y ros-noetic-desktop-full
```

Tarda un rato (descarga varios GB). Más adelante podrás instalar paquetes sueltos con
`sudo apt install ros-noetic-NOMBRE-DEL-PAQUETE`, por ejemplo `ros-noetic-navigation`.

## 4. Configurar el entorno

Cada terminal necesita "cargar" ROS. Para que se haga solo al abrir una terminal:

```bash
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

## 5. Herramientas de compilación y `rosdep`

```bash
sudo apt install -y python3-rosdep python3-rosinstall python3-rosinstall-generator \
                    python3-wstool python3-catkin-tools build-essential
sudo rosdep init
rosdep update
```

`rosdep` instala automáticamente las dependencias de los paquetes de ROS que te descargues.

## 6. Comprobar que funciona

Abre **tres terminales**:

=== "Terminal 1"

    ```bash
    roscore
    ```

=== "Terminal 2"

    ```bash
    rosrun turtlesim turtlesim_node
    ```

=== "Terminal 3"

    ```bash
    rosrun turtlesim turtle_teleop_key
    ```

Con la terminal 3 seleccionada, mueve la tortuga con las flechas. Si se mueve, ROS está
bien instalado. Cierra todo con ++ctrl+c++ en cada terminal.

## 7. Tu espacio de trabajo (`catkin_ws`)

En el grupo, el espacio de trabajo de ROS está **dentro de tu repositorio de TFG**, en la
carpeta `catkin_ws/`. Así tus paquetes quedan versionados junto al resto de tu código.

```bash
cd ~/repos/tfg-2026-apellido-tema/catkin_ws
mkdir -p src
catkin_make
```

Se crean las carpetas `build/` y `devel/`. **No se suben a Git** (ya están en el
`.gitignore`).

Ahora carga tu espacio de trabajo además de ROS:

```bash
source devel/setup.bash
```

Para no tener que hacerlo en cada terminal, añádelo al `.bashrc` **después** de la línea de ROS:

```bash
echo "source ~/repos/tfg-2026-apellido-tema/catkin_ws/devel/setup.bash" >> ~/.bashrc
```

!!! info "Recuerda volver a hacer `source` tras compilar paquetes nuevos"
    Si creas un paquete nuevo y `rosrun` o `roslaunch` dicen que no lo encuentran, abre una
    terminal nueva o haz `source devel/setup.bash` otra vez.

## 8. Tu primer paquete y nodo

Vamos a crear un paquete con un nodo en Python que publica un mensaje cada segundo.

```bash
cd ~/repos/tfg-2026-apellido-tema/catkin_ws/src
catkin_create_pkg mi_primer_paquete rospy std_msgs
mkdir -p mi_primer_paquete/scripts
```

Crea el archivo `mi_primer_paquete/scripts/saludador.py`:

```python
#!/usr/bin/env python3
"""Nodo de ejemplo: publica un saludo en /saludo cada segundo."""
import rospy
from std_msgs.msg import String


def main():
    rospy.init_node("saludador")
    pub = rospy.Publisher("saludo", String, queue_size=10)
    rate = rospy.Rate(1)  # 1 Hz

    contador = 0
    while not rospy.is_shutdown():
        msg = f"Hola desde el grupo de navegación ({contador})"
        pub.publish(msg)
        rospy.loginfo(msg)
        contador += 1
        rate.sleep()


if __name__ == "__main__":
    try:
        main()
    except rospy.ROSInterruptException:
        pass
```

Hazlo ejecutable y regístralo en el `CMakeLists.txt` del paquete. Busca la sección
comentada `catkin_install_python` y déjala así:

```bash
chmod +x mi_primer_paquete/scripts/saludador.py
```

```cmake
catkin_install_python(PROGRAMS
  scripts/saludador.py
  DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)
```

Compila y prueba:

```bash
cd ..            # vuelve a catkin_ws
catkin_make
source devel/setup.bash
rosrun mi_primer_paquete saludador.py      # (con roscore en otra terminal)
```

En otra terminal puedes ver los mensajes con:

```bash
rostopic echo /saludo
```

## Comandos que usarás a diario

| Comando | Para qué |
|---|---|
| `roscore` | Arranca el núcleo de ROS (`roslaunch` lo arranca solo si no está) |
| `rosrun paquete nodo` | Ejecuta un nodo |
| `roslaunch paquete archivo.launch` | Ejecuta varios nodos con su configuración |
| `rostopic list` / `rostopic echo /tema` | Lista los *topics* / muestra sus mensajes |
| `rostopic hz /tema` | Frecuencia a la que se publica un topic |
| `rosnode list` | Nodos en marcha |
| `rqt_graph` | Dibuja los nodos y topics conectados |
| `rviz` | Visualizador 3D |
| `rosbag record -a` / `rosbag play archivo.bag` | Grabar / reproducir datos |

## Problemas frecuentes

??? failure "`roslaunch: command not found` o `rosrun: command not found`"
    La terminal no ha cargado ROS. Ejecuta `source /opt/ros/noetic/setup.bash` y revisa que
    esa línea está en tu `~/.bashrc`.

??? failure "`[rospack] Error: package 'mi_paquete' not found`"
    No has cargado tu espacio de trabajo, o lo compilaste después de abrir la terminal.
    Ejecuta `source ~/repos/.../catkin_ws/devel/setup.bash`.

??? failure "`/usr/bin/env: 'python': No such file or directory`"
    En Noetic se usa Python 3. La primera línea de tus scripts debe ser
    `#!/usr/bin/env python3`.

??? failure "Errores de firma (`EXPKEYSIG`, `NO_PUBKEY`) al hacer `sudo apt update`"
    Tienes la configuración antigua del repositorio de ROS. Mira el aviso del
    [paso 2](#2-anadir-el-repositorio-de-ros).

??? failure "`sudo rosdep init` dice que el archivo ya existe"
    Ya estaba inicializado. Sáltate ese comando y ejecuta solo `rosdep update`.

## Para seguir aprendiendo

- [Tutoriales oficiales de ROS 1](http://wiki.ros.org/ROS/Tutorials): los de nivel
  *Beginner* son muy recomendables (topics, servicios, launch files).
- Siguiente tutorial del grupo: [Stack de navegación :octicons-arrow-right-24:](navegacion.md)
