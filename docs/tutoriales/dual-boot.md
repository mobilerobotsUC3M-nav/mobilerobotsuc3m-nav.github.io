# Instalar Ubuntu 20.04 junto a Windows (arranque dual)

Al terminar tendrás Ubuntu 20.04 y Windows en el mismo ordenador. Al encenderlo aparecerá
un menú para elegir cuál arrancar. Es la forma recomendada de trabajar con ROS Noetic: en
una máquina virtual, Gazebo va lento y las cámaras USB 3 dan problemas.

!!! danger "Antes de nada: haz una copia de seguridad"
    Vas a modificar las particiones del disco. Si se sigue el tutorial no se pierde nada,
    pero un error puede borrar Windows y tus archivos. **Copia lo importante** a un disco
    externo o a la nube antes de empezar.

**Necesitas:**

- Un **USB de 8 GB o más** (se borrará entero).
- **Al menos 80–100 GB libres** en el disco. ROS, Gazebo, rosbags y datasets ocupan mucho;
  con menos de 50 GB te quedarás sin espacio.
- El portátil **enchufado** y **1–2 horas**.
- Tu **clave de recuperación de BitLocker**, si el disco está cifrado (ver paso 1.2).

!!! tip "Si algo no coincide con lo que describe el tutorial, para y pregunta"
    Cada ordenador es un poco distinto. Es mucho mejor preguntar en el grupo que seguir
    adelante a ciegas en el paso de las particiones.

## 1. Comprobaciones en Windows

### 1.1. Modo de arranque (UEFI)

1. Pulsa ++win+r++, escribe `msinfo32` y pulsa ++enter++.
2. En **Resumen del sistema**, busca **Modo de BIOS**. Debe poner **UEFI**.

Casi todos los ordenadores de los últimos diez años usan UEFI. Si pone **Heredado**
(*Legacy*), consúltalo antes de seguir: el proceso cambia.

### 1.2. BitLocker y cifrado del dispositivo

Muchos portátiles con Windows 11 traen el disco **cifrado** de fábrica. Al tocar el arranque,
Windows puede pedirte la **clave de recuperación** de 48 dígitos, y si no la tienes, no podrás
volver a entrar en Windows.

1. Abre **Configuración → Privacidad y seguridad → Cifrado del dispositivo** (o busca
   "BitLocker" en el menú Inicio).
2. Si el cifrado está **activado**, guarda la clave de recuperación: está en
   [aka.ms/myrecoverykey](https://aka.ms/myrecoverykey) entrando con tu cuenta de Microsoft.
   **Apúntala en papel o en el móvil**, no solo en el propio portátil.
3. En **Panel de control → Cifrado de unidad BitLocker**, pulsa **Suspender protección**
   para la unidad C:. Se reactiva sola tras unos reinicios.

### 1.3. Desactivar el inicio rápido

El "inicio rápido" de Windows no apaga del todo el ordenador: deja el disco en un estado
semihibernado que Ubuntu no puede tocar con seguridad.

1. **Panel de control → Opciones de energía → Elegir el comportamiento de los botones de inicio/apagado**.
2. Pulsa **Cambiar la configuración actualmente no disponible**.
3. **Desmarca** "Activar inicio rápido" y guarda.

### 1.4. Controlador de disco (Intel RST / VMD)

Algunos portátiles con procesador Intel traen el disco configurado en modo **RST** o **VMD**,
y el instalador de Ubuntu **no verá el disco**.

Pulsa con el botón derecho en Inicio → **Administrador de dispositivos** → despliega
**Controladoras de almacenamiento**. Si aparece algo con **"RST"** o **"VMD"**, avisa a tu
tutor/a antes de seguir: hay que cambiar una opción de la BIOS siguiendo un procedimiento
concreto para que Windows siga arrancando.

## 2. Hacer hueco para Ubuntu

Vamos a encoger la partición de Windows para dejar espacio libre.

1. Pulsa ++win+x++ → **Administración de discos**.
2. Haz clic derecho en la partición **(C:)** → **Reducir volumen**.
3. En **Tamaño del espacio que desea reducir, en MB**, escribe el espacio para Ubuntu.
   Para 100 GB: `102400`.
4. Pulsa **Reducir**.

Aparecerá un bloque negro marcado como **No asignado**. **Déjalo así**: no crees ninguna
partición en él, lo hará el instalador de Ubuntu.

!!! question "¿Windows no deja reducir tanto como quieres?"
    Windows no puede mover algunos archivos de sistema. Libera espacio (vacía la papelera,
    desinstala programas que no uses) y vuelve a intentarlo. Si aun así no deja, pregunta.

## 3. Preparar el USB de instalación

1. Descarga la imagen **`ubuntu-20.04.6-desktop-amd64.iso`** (unos 4 GB) desde
   [releases.ubuntu.com/20.04](https://releases.ubuntu.com/20.04/).
2. Descarga **Rufus** desde [rufus.ie](https://rufus.ie) (la versión portable no necesita instalación).
3. Conecta el USB, abre Rufus y configura:

    | Opción | Valor |
    |---|---|
    | Dispositivo | Tu USB (comprueba que es el correcto: **se borrará**) |
    | Elección de arranque | **SELECCIONAR** → la ISO de Ubuntu |
    | Esquema de partición | **GPT** |
    | Sistema destino | **UEFI (no CSM)** |

4. Pulsa **EMPEZAR**. Si pregunta por el modo de escritura, elige **Modo Imagen ISO**
   (recomendado). Si pregunta por descargar archivos adicionales, acepta.

## 4. Arrancar desde el USB

Con el USB conectado, reinicia el ordenador desde el **menú de arranque**:

=== "Desde Windows (más fácil)"

    1. **Configuración → Sistema → Recuperación → Inicio avanzado → Reiniciar ahora**.
    2. En la pantalla azul, elige **Usar un dispositivo** y selecciona el USB.

=== "Con la tecla del fabricante"

    Apaga el ordenador, enciéndelo y pulsa repetidamente la tecla del menú de arranque:

    | Fabricante | Tecla habitual |
    |---|---|
    | Lenovo, Dell, Acer | ++f12++ |
    | HP | ++f9++ (o ++esc++ y luego ++f9++) |
    | ASUS | ++esc++ o ++f8++ |
    | MSI | ++f11++ |

    En el menú, elige la entrada del USB que empiece por **UEFI**.

Aparecerá un menú negro: elige **Ubuntu** (o *Try or Install Ubuntu*).

!!! info "Secure Boot"
    Ubuntu 20.04 arranca con **Secure Boot activado**, así que en principio no hay que tocar la
    BIOS. Si el USB no arranca de ninguna forma, entra en la BIOS y desactiva Secure Boot
    temporalmente.

## 5. Instalar Ubuntu

1. **Bienvenida:** elige **Español** y pulsa **Instalar Ubuntu**.
2. **Teclado:** Español → Español.
3. **Red:** conéctate a la wifi si te lo ofrece (para descargar actualizaciones y drivers).
4. **Actualizaciones y otro software:**
    - Instalación normal.
    - Marca **Descargar actualizaciones al instalar Ubuntu**.
    - Marca **Instalar programas de terceros para hardware de gráficos y de wifi**.

    Si tienes Secure Boot activado, te pedirá que inventes una **contraseña de Secure Boot**.
    Apúntala: la necesitarás una única vez en el primer reinicio (ver paso 6).

5. **Tipo de instalación:** elige **Más opciones** (*Something else*). Es la opción que te
   deja controlar exactamente qué se toca.

    !!! danger "No elijas 'Borrar disco e instalar Ubuntu'"
        Borra Windows y todos tus archivos.

### Las particiones

Verás la lista de particiones del disco (`/dev/nvme0n1p1`, `/dev/nvme0n1p2`... o `/dev/sda1`...).
Las de Windows están en formato `ntfs` y hay una pequeña de tipo `efi`. **No toques ninguna
de ellas.**

1. Selecciona la línea **espacio libre** (debe tener el tamaño que reservaste en el paso 2).
2. Pulsa **+** y rellena:

    | Campo | Valor |
    |---|---|
    | Tamaño | Todo el disponible (el que sale por defecto) |
    | Utilizar como | **Sistema de ficheros ext4 transaccional** |
    | Punto de montaje | **`/`** |

3. Pulsa **Aceptar**.
4. Abajo, en **Dispositivo donde instalar el cargador de arranque**, deja el **disco
   entero** (por ejemplo `/dev/nvme0n1`, sin número de partición al final).
5. Pulsa **Instalar ahora**.

!!! warning "Revisa el resumen antes de confirmar"
    Aparecerá una ventana con los cambios que se van a hacer. Solo debe formatearse **una
    partición `ext4` montada en `/`**. Si aparece cualquier partición `ntfs`, pulsa **Volver**
    y revisa.

No hace falta crear partición de intercambio (*swap*): Ubuntu 20.04 crea un archivo de
intercambio automáticamente.

### Datos finales

- **Zona horaria:** Madrid.
- **Tu nombre, nombre del equipo, usuario y contraseña.** Para el **nombre del equipo** usa
  algo corto, en minúsculas y sin espacios ni tildes (por ejemplo `portatil-maria`): es el
  nombre con el que tu ordenador se identificará en la red del robot (ver
  [ROS en varios ordenadores](ros-red.md)).

Cuando termine, pulsa **Reiniciar ahora** y **quita el USB** cuando te lo pida.

## 6. Primer arranque

### La pantalla azul de Secure Boot (MOK)

Si en la instalación creaste una contraseña de Secure Boot, al reiniciar aparecerá una
pantalla azul en inglés (**MOK management**). Tienes unos segundos para pulsar una tecla:

1. **Enroll MOK** → **Continue** → **Yes**.
2. Escribe la contraseña de Secure Boot que inventaste.
3. **Reboot**.

Si la pantalla se pasa sin que hagas nada, el ordenador arranca igual pero los drivers de la
gráfica NVIDIA no se cargarán. Se puede repetir el proceso más tarde; pregunta.

### El menú de arranque (GRUB)

A partir de ahora, al encender verás un menú:

- **Ubuntu** → arranca Ubuntu (opción por defecto).
- **Windows Boot Manager** → arranca Windows.

!!! question "¿Arranca directamente Windows sin mostrar el menú?"
    Entra en la BIOS (normalmente ++f2++ o ++del++ al encender) y en el orden de arranque
    (*Boot order*) pon **ubuntu** por delante de **Windows Boot Manager**.

## 7. Después de instalar

Abre una terminal (++ctrl+alt+t++) y ejecuta:

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Drivers de la tarjeta gráfica (si tienes NVIDIA)
ubuntu-drivers devices
sudo ubuntu-drivers autoinstall

# Que Windows y Ubuntu no se peleen por la hora
timedatectl set-local-rtc 1 --adjust-system-clock
```

Reinicia y ya puedes seguir con [Instalar ROS Noetic](ros-noetic.md).

!!! info "¿Por qué el último comando?"
    Windows y Linux interpretan de forma distinta el reloj interno del ordenador. Sin este
    ajuste, cada vez que cambias de sistema la hora aparece desplazada una o dos horas.

## Problemas frecuentes

??? failure "El USB no aparece en el menú de arranque"
    Comprueba que en Rufus elegiste **GPT** y **UEFI (no CSM)**. Prueba otro puerto USB.
    En la BIOS, desactiva temporalmente **Fast Boot** y, si sigue sin aparecer, **Secure Boot**.

??? failure "El instalador no muestra el disco o solo ve el USB"
    El disco está en modo **Intel RST / VMD** (paso 1.4). No sigas: pregunta.

??? failure "Al volver a Windows pide la clave de recuperación de BitLocker"
    Es la clave que guardaste en el paso 1.2 ([aka.ms/myrecoverykey](https://aka.ms/myrecoverykey)).
    Introdúcela y Windows arrancará con normalidad.

??? failure "No funciona la wifi en Ubuntu"
    Algunas tarjetas wifi muy recientes no tienen driver en Ubuntu 20.04. Conéctate por cable
    (o comparte internet desde el móvil por USB) y prueba a instalar el kernel más moderno
    disponible para 20.04:
    ```bash
    sudo apt install --install-recommends linux-generic-hwe-20.04
    ```
    Reinicia. Si sigue sin funcionar, pregunta en el grupo.

??? failure "La pantalla se queda negra al arrancar el USB o Ubuntu"
    Suele ser la gráfica NVIDIA. En el menú negro del USB (o en GRUB), pon el cursor sobre
    **Ubuntu**, pulsa ++e++, busca la palabra `quiet splash` y añade detrás `nomodeset`.
    Pulsa ++f10++ para arrancar. Después de instalar, instala los drivers (paso 7).
