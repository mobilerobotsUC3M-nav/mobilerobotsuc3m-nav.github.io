# Instalar ROS 2 Jazzy

<span class="bloque bloque-ros2">ROS 2 · Ubuntu 24.04 + Jazzy</span>

Al terminar tendrás ROS 2 Jazzy instalado en Ubuntu 24.04, con las herramientas de
desarrollo, y habrás comprobado que funciona.

## Requisitos

- **Ubuntu 24.04 (Noble Numbat)**. Jazzy solo se instala con paquetes en esta versión.
- Instalado **de forma nativa**: si tu ordenador tiene Windows, sigue antes
  [Instalar Ubuntu 24.04 junto a Windows](ubuntu24.md). Una máquina virtual sirve para
  aprender, pero Gazebo irá lento y las cámaras USB 3 darán problemas.
- Unos 10 GB libres y conexión a internet.

Comprueba tu versión de Ubuntu con:

```bash
lsb_release -a      # debe poner: Release: 24.04
```

## 1. Idioma del sistema (UTF-8)

ROS 2 necesita que el sistema use codificación UTF-8. En una instalación normal de Ubuntu
ya es así; compruébalo:

```bash
locale      # LANG debe acabar en .UTF-8 (por ejemplo es_ES.UTF-8)
```

Si no es así:

```bash
sudo apt update && sudo apt install -y locales
sudo locale-gen es_ES es_ES.UTF-8
sudo update-locale LC_ALL=es_ES.UTF-8 LANG=es_ES.UTF-8
export LANG=es_ES.UTF-8
```

## 2. Añadir el repositorio de ROS 2

```bash
sudo apt install -y software-properties-common curl
sudo add-apt-repository universe

# Busca la última versión del paquete que configura el repositorio de ROS 2
export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F\" '{print $4}')
echo $ROS_APT_SOURCE_VERSION    # debe mostrar un número de versión; si sale vacío, repite el comando

# Descárgalo e instálalo
curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

!!! info "Fíjate en que es `ros2-apt-source`"
    Es el paquete equivalente al `ros-apt-source` de ROS 1, pero para el repositorio de ROS 2.
    Configura la clave y el repositorio, y se actualiza solo.

## 3. Instalar ROS 2

```bash
sudo apt update && sudo apt upgrade -y

# Herramientas de desarrollo: colcon, rosdep, vcstool...
sudo apt install -y ros-dev-tools

# ROS 2 con interfaz gráfica: RViz, rqt, demos
sudo apt install -y ros-jazzy-desktop
```

Tarda un rato. Más adelante podrás instalar paquetes sueltos con
`sudo apt install ros-jazzy-NOMBRE-DEL-PAQUETE`, por ejemplo `ros-jazzy-navigation2`.

!!! tip "Gazebo no viene incluido"
    `ros-jazzy-desktop` no trae el simulador. Lo instalaremos en el
    [tutorial de navegación](navegacion.md), junto con los paquetes que lo necesitan.

## 4. Configurar el entorno

Cada terminal tiene que "cargar" ROS 2. Para que se haga solo al abrir una terminal:

```bash
echo "source /opt/ros/jazzy/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

Comprueba que está cargado:

```bash
echo $ROS_DISTRO      # debe poner: jazzy
```

## 5. `rosdep`

`rosdep` instala automáticamente las dependencias de los paquetes que compiles:

```bash
sudo rosdep init
rosdep update
```

Si `sudo rosdep init` dice que el archivo ya existe, sáltatelo y ejecuta solo `rosdep update`.

## 6. Comprobar que funciona

Abre **dos terminales**:

=== "Terminal 1"

    ```bash
    ros2 run demo_nodes_cpp talker
    ```

    Verás mensajes `Publishing: 'Hello World: 1'`, `2`, `3`...

=== "Terminal 2"

    ```bash
    ros2 run demo_nodes_py listener
    ```

    Verás `I heard: [Hello World: ...]`.

Si el segundo nodo recibe los mensajes del primero, ROS 2 está bien instalado. Fíjate en que
**no has lanzado ningún `roscore`**: en ROS 2 no existe, los nodos se encuentran solos.

Cierra ambos con ++ctrl+c++.

!!! failure "¿El listener no recibe nada?"
    Casi siempre es el cortafuegos o la red bloqueando el descubrimiento de nodos. Prueba en
    las dos terminales con `export ROS_AUTOMATIC_DISCOVERY_RANGE=LOCALHOST` (solo comunicación
    dentro de tu ordenador) y vuelve a lanzarlos. Si así funciona, el problema es de red:
    míralo en [ROS 2 en varios ordenadores](red.md).

## Para seguir

- Siguiente tutorial: [Introducción a ROS 2 :octicons-arrow-right-24:](introduccion.md)
- [Documentación oficial de ROS 2 Jazzy](https://docs.ros.org/en/jazzy/)
