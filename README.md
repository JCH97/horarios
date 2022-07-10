## HORARIOS MATCOM

##### Sistema de gestion de horarios de la facultad de matemática.

#### Autor:

- Jose Carlos Hernandez

Tutor: Pedro Quintero Rojas

#### Como ejecutar el proyecto:

> Estar situado en la raiz de backend (src/backend)
```bash
1. docker-compose up -d
2. npm run start
```

Para analizar la base de datos revisar `locahost:8080` en el navegador

#### Como crear la BD horarios:

1. Navegar hacia https://localhost:8080
2. Hacer login en el adminer con las siguientes credenciales:
    1. Motor de base de datos: PostgreSQL
    2. Servidor: db
    3. Usuario: postgres
    4. Contrasenna: pass2021
3. Una vez en la pantalla principal hacer clic en el boton _Crear Base de datos_.
4. El nombre de la base de datos debe ser exactamente: _horarios_
5. Hacer clic en Guardar

**Nota**: El procedimiento anterior solo se debe realizar una vez.
