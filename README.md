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

## 👤 Dev
Nahuel Rocha
- LinkedIn: https://www.linkedin.com/in/rocha-nahuel/
- GitHub: https://github.com/NahuelRocha
