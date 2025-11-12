# 🗳️ Sistema de Votación Electoral

Sistema integral de gestión electoral desarrollado en React + TypeScript que permite la administración de candidatos, registro de votos y análisis de resultados mediante Machine Learning.

---

## 📋 Descripción

Sistema de votación electoral diseñado para facilitar procesos electorales digitales con las siguientes características:

- **Interfaz de Votante**: Portal intuitivo para ejercer el voto de forma rápida y segura
- **Panel Administrativo**: Gestión completa de candidatos, categorías y configuración del sistema
- **Análisis con ML**: Pipeline de Machine Learning para análisis predictivo y detección de tendencias
- **Gestión de Categorías**: Sistema flexible que permite múltiples tipos de elecciones
- **Almacenamiento Local**: Datos persistentes mediante localStorage (sin necesidad de backend)

---

## ✨ Características Principales

### Para Votantes
- ✅ Autenticación por DNI
- ✅ Interfaz visual con fotos de candidatos
- ✅ Votación por categorías (Presidencial, Congreso, Distrital, etc.)
- ✅ Validación de voto único por categoría
- ✅ Confirmación visual de voto registrado

### Para Administradores
- 🔧 Gestión completa de candidatos (CRUD)
- 🔧 Habilitar/deshabilitar candidatos
- 🔧 Gestión de categorías personalizadas
- 🔧 Dashboard con estadísticas en tiempo real
- 🔧 Visualización de top candidatos por categoría
- 🔧 Carga de imágenes para candidatos (Base64)
- 🔧 Reinicio total del sistema

### Machine Learning
- 🤖 Pipeline de carga de datos (CSV/Excel)
- 🤖 Limpieza y normalización de datos
- 🤖 Entrenamiento de modelos predictivos
- 🤖 Visualización de métricas y resultados

---

## 🚀 Tecnologías Utilizadas
<<<<<<< HEAD

### Frontend
- **React 18.3** - Biblioteca de UI
- **TypeScript 5.8** - Tipado estático
- **Vite 5.4** - Build tool y dev server
- **React Router DOM 6.30** - Navegación

### UI/UX
- **Tailwind CSS 3.4** - Framework de estilos
- **shadcn/ui** - Componentes de UI
- **Radix UI** - Primitivos accesibles
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast

### Gestión de Estado
- **React Context API** - Estado global
- **TanStack Query 5.83** - Gestión de datos asíncronos
- **React Hook Form 7.61** - Manejo de formularios
- **Zod 3.25** - Validación de esquemas

### Procesamiento de Datos
- **PapaParse 5.5** - Parsing de CSV
- **Lodash 4.17** - Utilidades de datos
- **date-fns 3.6** - Manejo de fechas

### Visualización
- **Recharts 2.15** - Gráficos y estadísticas

---

## 📦 Instalación

### Requisitos Previos
- Node.js 16 o superior
- npm o yarn

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Navegar al directorio del proyecto
cd proyecto-frontend-votacion

# 3. Instalar dependencias
npm install

=======

### Frontend
- **React 18.3** - Biblioteca de UI
- **TypeScript 5.8** - Tipado estático
- **Vite 5.4** - Build tool y dev server
- **React Router DOM 6.30** - Navegación

### UI/UX
- **Tailwind CSS 3.4** - Framework de estilos
- **shadcn/ui** - Componentes de UI
- **Radix UI** - Primitivos accesibles
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast

### Gestión de Estado
- **React Context API** - Estado global
- **TanStack Query 5.83** - Gestión de datos asíncronos
- **React Hook Form 7.61** - Manejo de formularios
- **Zod 3.25** - Validación de esquemas

### Procesamiento de Datos
- **PapaParse 5.5** - Parsing de CSV
- **Lodash 4.17** - Utilidades de datos
- **date-fns 3.6** - Manejo de fechas

### Visualización
- **Recharts 2.15** - Gráficos y estadísticas

---

## 📦 Instalación

### Requisitos Previos
- Node.js 16 o superior
- npm (viene con Node.js) - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <YOUR_GIT_URL>

# 2. Navegar al directorio del proyecto
cd <YOUR_PROJECT_NAME>

# 3. Instalar dependencias
npm install

>>>>>>> f1241ceb685ead9687e4d4c3add4b4c270372c84
# 4. Iniciar el servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

<<<<<<< HEAD
---

## 🎯 Uso del Sistema

### Acceso como Votante

1. Navegar a la ruta `/voter`
2. Ingresar DNI para autenticación
3. Seleccionar la categoría de votación
4. Elegir candidato y confirmar voto
5. El sistema valida que no se vote dos veces en la misma categoría

### Acceso como Administrador

1. Navegar a la ruta `/admin`
2. Ingresar credenciales de administrador
3. Acceder al panel de control con 5 pestañas:
   - **Resumen**: Dashboard con estadísticas generales
   - **Candidatos**: Gestión CRUD de candidatos
   - **Categorías**: Administración de tipos de votación
   - **Configuración**: Opciones del sistema
   - **Machine Learning**: Pipeline de análisis predictivo

### Pipeline de Machine Learning

1. **Cargar Datos** (`/upload`): Importar datasets en CSV/Excel
2. **Limpiar Datos** (`/clean`): Normalizar y procesar información
3. **Entrenar Modelos** (`/train`): Configurar y ejecutar algoritmos
4. **Ver Resultados** (`/results`): Analizar métricas y predicciones

---

## 🗂️ Estructura del Proyecto

```
src/
├── admin/
│   └── pages/
│       ├── AdminView.tsx          # Panel principal de administración
│       ├── AdminLogin.tsx         # Login de administradores
│       ├── CategoriesManagement.tsx
│       ├── DataUpload.tsx         # Carga de datos para ML
│       ├── DataCleaning.tsx       # Limpieza de datos
│       ├── ModelTraining.tsx      # Entrenamiento de modelos
│       ├── Results.tsx            # Visualización de resultados
│       └── NotFound.tsx
├── users/
│   ├── Welcome.tsx                # Página de inicio
│   ├── VoterView.tsx              # Vista de votación
│   └── LoginUser.tsx              # Login de votantes
├── components/
│   ├── ui/                        # Componentes de shadcn/ui
│   └── DashboardVote.tsx          # Dashboard de estadísticas
├── contexts/
│   └── DataContext.tsx            # Context API para estado global
├── lib/
│   └── storage.ts                 # Funciones de localStorage
├── hooks/                         # Custom hooks
└── App.tsx                        # Componente principal con rutas
```

=======
### Editar Directamente en GitHub

1. Navega al archivo que deseas editar
2. Haz clic en el botón "Edit" (ícono de lápiz) en la parte superior derecha
3. Realiza tus cambios y haz commit

### Usar GitHub Codespaces

1. Ve a la página principal del repositorio
2. Haz clic en el botón "Code" (botón verde)
3. Selecciona la pestaña "Codespaces"
4. Haz clic en "New codespace" para lanzar un entorno de desarrollo en la nube
5. Edita archivos directamente y haz commit cuando termines

---

## 🎯 Uso del Sistema

### Acceso como Votante

1. Navegar a la ruta `/voter`
2. Ingresar DNI para autenticación
3. Seleccionar la categoría de votación
4. Elegir candidato y confirmar voto
5. El sistema valida que no se vote dos veces en la misma categoría

### Acceso como Administrador

1. Navegar a la ruta `/admin`
2. Ingresar credenciales de administrador
3. Acceder al panel de control con 5 pestañas:
   - **Resumen**: Dashboard con estadísticas generales
   - **Candidatos**: Gestión CRUD de candidatos
   - **Categorías**: Administración de tipos de votación
   - **Configuración**: Opciones del sistema
   - **Machine Learning**: Pipeline de análisis predictivo

### Pipeline de Machine Learning

1. **Cargar Datos** (`/upload`): Importar datasets en CSV/Excel
2. **Limpiar Datos** (`/clean`): Normalizar y procesar información
3. **Entrenar Modelos** (`/train`): Configurar y ejecutar algoritmos
4. **Ver Resultados** (`/results`): Analizar métricas y predicciones

---

## 🗂️ Estructura del Proyecto

```
src/
├── admin/
│   └── pages/
│       ├── AdminView.tsx          # Panel principal de administración
│       ├── AdminLogin.tsx         # Login de administradores
│       ├── CategoriesManagement.tsx
│       ├── DataUpload.tsx         # Carga de datos para ML
│       ├── DataCleaning.tsx       # Limpieza de datos
│       ├── ModelTraining.tsx      # Entrenamiento de modelos
│       ├── Results.tsx            # Visualización de resultados
│       └── NotFound.tsx
├── users/
│   ├── Welcome.tsx                # Página de inicio
│   ├── VoterView.tsx              # Vista de votación
│   └── LoginUser.tsx              # Login de votantes
├── components/
│   ├── ui/                        # Componentes de shadcn/ui
│   └── DashboardVote.tsx          # Dashboard de estadísticas
├── contexts/
│   └── DataContext.tsx            # Context API para estado global
├── lib/
│   └── storage.ts                 # Funciones de localStorage
├── hooks/                         # Custom hooks
└── App.tsx                        # Componente principal con rutas
```

>>>>>>> f1241ceb685ead9687e4d4c3add4b4c270372c84
---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Construye para producción
npm run build:dev        # Build en modo desarrollo

# Calidad de código
npm run lint             # Ejecuta ESLint

# Preview
npm run preview          # Vista previa del build
```

---

## 💾 Almacenamiento de Datos

El sistema utiliza **localStorage** para persistencia de datos:

### Datos Almacenados
- **Candidatos**: Lista completa con votos
- **Votantes**: DNIs registrados y categorías votadas
- **Categorías**: Configuración de tipos de votación
- **Configuración**: Opciones del sistema

### Funciones Principales (`storage.ts`)
```typescript
- initializeStorage()                    // Inicializa el sistema
- getCandidates()                        // Obtiene todos los candidatos
- addCandidate(candidate)                // Agrega nuevo candidato
- updateCandidate(id, updates)           // Actualiza candidato
- deleteCandidate(id)                    // Elimina candidato
- registerVote(dni, category, candidateId) // Registra un voto
- hasVoted(dni, category)                // Verifica si ya votó
- getVoteStats()                         // Obtiene estadísticas
- resetSystem()                          // Reinicia todo el sistema
```

---

## 🎨 Personalización

### Modificar Categorías de Votación

Las categorías están definidas en `lib/storage.ts`. Para agregar nuevas:

```typescript
const DEFAULT_CATEGORIES = [
  {
    id: 'mi-categoria',
    displayName: 'Mi Categoría',
    description: 'Descripción de la categoría',
    enabled: true
  }
];
```

### Cambiar Temas y Colores

El proyecto usa Tailwind CSS. Modifica `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...}
    }
  }
}
```

---

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Este sistema utiliza localStorage para almacenamiento local y está diseñado para **demostraciones y prototipos**.

### Consideraciones de Seguridad
- No hay encriptación de datos
- No hay autenticación robusta
- No hay auditoría de votos
- No hay protección contra manipulación de localStorage

### Para Producción se Recomienda:
- Implementar backend seguro
- Usar JWT para autenticación
- Encriptar votos y datos sensibles
- Implementar blockchain para auditoría
- Añadir CAPTCHA y verificación 2FA
- Usar HTTPS obligatorio

---

## 🚧 Limitaciones Conocidas

- Almacenamiento limitado por localStorage (~5-10MB)
- Sin sincronización entre dispositivos
- Sin recuperación de datos si se limpia el navegador
- No apto para elecciones oficiales sin modificaciones de seguridad

---

## 🛠️ Desarrollo

### Añadir Nuevos Candidatos

```typescript
addCandidate({
  name: "Nombre Completo",
  party: "Partido Político",
  category: "presidential", // presidential | congress | district
  description: "Propuestas del candidato",
  image: "data:image/jpeg;base64,...", // Base64 opcional
  enabled: true
});
```

### Crear Nueva Categoría

Usar el componente `CategoriesManagement` en la pestaña Admin > Categorías

---

## 📊 Análisis de Datos (ML)

El pipeline de ML permite:
1. Cargar datasets históricos
2. Analizar patrones de votación
3. Predecir tendencias electorales
4. Detectar anomalías
5. Generar reportes con métricas

<<<<<<< HEAD
---

## 🤝 Contribuciones
=======
## 🚀 Deployment

### Opciones de Deployment

Puedes desplegar este proyecto en varias plataformas:

#### Vercel
```bash
npm run build
```
Luego conecta tu repositorio en [Vercel](https://vercel.com)

#### Netlify
```bash
npm run build
```
Arrastra la carpeta `dist` a [Netlify](https://netlify.com) o conecta tu repositorio

#### GitHub Pages
Configura un workflow de GitHub Actions para desplegar automáticamente

#### Servidor Propio
```bash
npm run build
```
Los archivos estáticos se generarán en la carpeta `dist/` lista para servir
>>>>>>> f1241ceb685ead9687e4d4c3add4b4c270372c84

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

## 👥 Autores

Desarrollado para gestión de procesos electorales digitales.

---

## 📞 Soporte

Para reportar problemas o sugerencias, por favor abre un [issue](../../issues) en el repositorio.

---

## 🎓 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

<<<<<<< HEAD
**⚡ Sistema de Votación Electoral - Modernizando la Democracia Digital**
=======
**⚡ Sistema de Votación Electoral - Modernizando la Democracia Digital**
>>>>>>> f1241ceb685ead9687e4d4c3add4b4c270372c84
