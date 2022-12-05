## HORARIOS MATCOM

##### Sistema de gestion de horarios de la facultad de matemática.

#### Autor:

- Jose Carlos Hernandez

Tutor: Pedro Quintero Rojas

#### Como ejecutar el proyecto:

Se describirán dos vías para la ejecución del proyecto. 

Como **aspecto común** se hace necesario tener instalado docker y docker-compose en la computadora donde se pretenda ejecutar la aplicación. Además se debe contar con una VPN activa para la descarga de las imágenes de docker.

Para sistema Linux:
> sudo apt-get install docker.io     
> sudo apt-get install docker-compose

**Enfoque 1:**

> 1. Situarse en la raíz del proyecto.
> 2. Abrir una terminal en esa ubicación
> 3. Ejecutar el siguiente comando: _docker-compose up -d_

**Enfoque 2:**

> **Se asume que para la ejecucion del proyecto se deba tener instalado:**
>- nodejs (superior a la version 16.0.0)
> ````
>  Para actualizar la version de nodejs: (desde Windows quitar sudo)
>  1. sudo npm cache clean -f
>  2. sudo npm install -g n 
>  3. sudo n stable
> ````
>- npm (superior a la version 8.0.0)

###### Ejecutar el servidor:
1. Estar situado en la raiz del backend (./backend)
2. Abrir una terminal en esa ubicación
3. Ejecutar el comando: _npm run start_

###### Ejecutar el cliente:
1. Estar situado en la raiz del frontend (./frontend)
2. Ejecutar una terminal en esa ubucación
3. Ejecutar el comando: _yarn serve_


---------------------------------------------------------------------------------------
En ambos casos la aplicación se encuentra accesible en `localhost:8081`


Para analizar la base de datos revisar `locahost:8080` en el navegador


**Para ingresar como administrador del sistema**
- email: admin@admin.com
- password: admin
