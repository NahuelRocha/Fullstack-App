# Landing Page Administrable con Panel de Control 🚀

Una Landing Page dinámica y totalmente administrable diseñada específicamente para negocios gastronómicos, con un robusto panel de administración que permite la gestión completa del contenido, productos, menús y más.

## 🌐 Url
https://daniela-eventos.vercel.app/

## 📸 Capturas de pantalla
<img src="https://github.com/NahuelRocha/Fullstack-App/blob/main/Frontend/src/assets/images/home.png" alt="Landing Page" width="900"/>

## 🎥 Video Demostración
[Colocar aquí el enlace del video de YouTube]

## 🌟 Características Principales

### Landing Page
- **Navbar Dinámico**: Navegación intuitiva con acceso al login o panel de administración
- **Banner Interactivo**: Slider de hasta 5 imágenes con título y descripción editables
- **Sección de Menús**: Visualización categorizada de menús con transiciones fluidas
- **Sistema de Órdenes**: Permite a los clientes crear carritos personalizados
- **About**: Sección informativa completamente editable
- **Footer**: Información del negocio y datos de contacto actualizables

### Panel de Administración
- **Dashboard Central**: Acceso rápido a todas las funcionalidades
- **Gestor de Imágenes**: Subida y administración de imágenes
- **Gestor de Banner**: Control total del slider principal, titulo y descripción
- **Gestor de Productos**: 
  - Creación y edición de productos
  - Cálculo de costos
  - Configuración de márgenes de ganancia
  - Control de disponibilidad
  - Establecimiento de órdenes mínimas
- **Gestor de Servicios/Menús**:
  - Creación de menús personalizados
  - Selector de productos existentes
  - Cálculo automático de costos
  - Adición de conceptos manuales
  - Soporte para múltiples imágenes
- **Gestor de Categorías**: Organización eficiente de menús
- **Gestor de Información**: Actualización de datos del negocio
- **Gestor de About**: Personalización de la sección informativa

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: React con Vite
- **Estilos**: TailwindCSS
- **Routing**: React Router
- **Peticiones HTTP**: Axios
- **Animaciones**: Framer Motion
- **Hosting**: Vercel

### Backend
- **Framework**: Java Spring Boot
- **Seguridad**: JWT + Spring Security
- **Base de Datos**: PostgreSQL con JPA
- **Contenedor**: AWS Serverless Java Container (SpringBoot 3)
- **Compilación**: GraalVM Native Image en Linux 2023 (Dockerfile)
- **Despliegue**: AWS Lambda
- **Almacenamiento de Imágenes**: Cloudinary
- **Base de Datos Hosting**: Supabase

## ⚡ Optimizaciones

El backend está optimizado para un rendimiento superior mediante:
- Compilación nativa con GraalVM
- Entorno Linux 2023 personalizado
- Mejoras significativas en:
  - Tiempo de arranque en frío
  - Consumo de memoria
  - Rendimiento general

### 📊 Comparativa de Logs de Rendimiento

| **Método**       | **Acción**       | **Duración (ms)** | **Duración Facturada (ms)** | **Uso Máximo de Memoria (MB)** | **Duración de Inicialización (ms)** |
|------------------|------------------|-------------------|-----------------------------|--------------------------------|-------------------------------------|
| **GraalVM**      | **/GET HELLO**   | 48.07             | 69                          | 175                            | 1020.40                             |
| **GraalVM**      | **/POST OBJECT** | 42.49             | 43                          | 176                            | N/A                                 |
| **Java**         | **/GET HELLO**   | 1132.35           | 1133                        | 286                            | 8916.62                             |
| **Java**         | **/POST OBJECT** | 753.96            | 774                         | 289                            | N/A                                 |

### Análisis Comparativo:
- **Tiempo de Arranque en Frío**:  
  - **GraalVM**: 1020.40 ms  
  - **Java**: 8916.62 ms  
  El arranque en frío en GraalVM es significativamente más rápido, lo que es una ventaja clave al utilizar AWS Lambda, donde los tiempos de inicialización pueden impactar los costos y la eficiencia.
  
- **Tiempo de Ejecución de la Petición**:  
  - **GraalVM** (GET HELLO): 48.07 ms  
  - **Java** (GET HELLO): 1132.35 ms  
  - **GraalVM** (POST OBJECT): 42.49 ms  
  - **Java** (POST OBJECT): 753.96 ms  
  GraalVM ofrece un rendimiento mucho más rápido en las solicitudes, lo que mejora la experiencia del usuario y reduce los costos asociados con el tiempo de ejecución.

- **Consumo de Memoria**:  
  - **GraalVM**: Máximo de 175 MB (GET HELLO)  
  - **Java**: Máximo de 286 MB (GET HELLO)  
  GraalVM consume menos memoria, lo que también tiene un impacto positivo en los costos de operación, ya que se paga por el consumo de recursos.

### Conclusión:
- La versión nativa de la API utilizando **GraalVM** muestra una mejora significativa en tiempos de arranque, tiempos de ejecución y consumo de memoria en comparación con la versión estándar utilizando **Java**.
- La optimización con GraalVM permite ejecutar funciones de Lambda de manera más eficiente, lo que resulta en **menores costos operativos** y una **mejor experiencia de usuario** debido a la **reducción en los tiempos de respuesta**.


## 🚀 ¿Cómo levantar el proyecto localmente?

### Lo que necesitas tener instalado
- Java 17 o superior
- Maven 3.9+
- Node.js 18+
- PostgreSQL 14+
- Tu IDE favorito
- Una cuenta en Cloudinary (para las imágenes)

### Configurando el Backend

Primero vamos a preparar el backend. Necesitarás crear un archivo `.env` en la raíz del proyecto con estas variables:

```properties
# Para la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_de_tu_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

# Para la seguridad
JWT_SECRET_KEY=una_clave_segura_que_tu_elijas

# URLs
FUNCTION_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173

# Cuenta de administrador
PASSWORD_ACCOUNT=password_para_admin
EMAIL_ACCOUNT=email_para_admin

# Cloudinary (para las imágenes)
CLOUD_NAME=tu_cloud_name
CLOUD_API_KEY=tu_api_key
CLOUD_API_SECRET=tu_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

Para correr el backend:

```bash
cd Backend
mvn clean install
mvn spring-boot:run
```

¡Y listo! Tu backend estará corriendo en `http://localhost:8080` 🎉

### Configurando el Frontend

Ahora vamos con el frontend. Solo necesitas crear un `.env` con esta línea:

```properties
VITE_API_BASE_URL=http://localhost:8080
```

Para correrlo:

```bash
cd Frontend
npm install
npm run dev
```

¡Y ya está! Podrás ver tu app en `http://localhost:5173` 🚀

### 🐳 ¿Vas a hostear la api en AWS Lambda? (Opcional)

1. **Compilación del artefacto**
```bash
# Primero construye la imagen
docker build -t al2023-graalvm23:native-web .
# Y luego compila (reemplaza /path/to/your/backend con tu ruta)
docker run --rm -it -v /path/to/your/backend:/api -w /api -v ~/.m2:/root/.m2 al2023-graalvm23:native-web ./mvnw clean -Pnative package -DskipTests
```

2. **Configuración de AWS Lambda**
- Crea una nueva función Lambda
- Runtime: Custom runtime on Amazon Linux 2023
- Arquitectura: x86_64
- Memoria: 512 MB (recomendado)
- Handler: NONE
- Sube el archivo .zip generado

3. **Variables de entorno en Lambda**
Añade las mismas variables que usaste en tu `.env`:
```properties
DB_HOST=tu_host_db
DB_PORT=tu_puerto
DB_NAME=tu_nombre_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET_KEY=tu_jwt_key
FRONTEND_URL=url_de_tu_frontend
PASSWORD_ACCOUNT=password_admin
EMAIL_ACCOUNT=email_admin
CLOUD_NAME=tu_cloud_name
CLOUD_API_KEY=tu_api_key
CLOUD_API_SECRET=tu_api_secret
CLOUDINARY_URL=tu_cloudinary_url
```

4. **URL de Función**
- En la configuración de la Lambda, habilita "Function URL"
- Copia la URL generada
- Actualiza `VITE_API_BASE_URL` en el frontend con esta URL

### 💡 Algunos tips importantes

- Asegúrate de tener PostgreSQL corriendo antes de arrancar el backend
- Para desarrollo local: agrega `spring-boot-starter-web` a tu `pom.xml`
- Para AWS Lambda: usa el Dockerfile proporcionado para compilar con GraalVM (no necesitas spring-web)
- Si ves errores de CORS, revisa la configuración en el backend. ¡Suele ser el culpable número 1 de dolores de cabeza!

¿Problemas para levantar el proyecto? ¡No dudes en abrir un issue en el repo! 🤓

## 👤 Dev
Nahuel Rocha
- LinkedIn: https://www.linkedin.com/in/rocha-nahuel/
- GitHub: https://github.com/NahuelRocha
