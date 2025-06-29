# 🧪 Supplement Tracker App

App móvil para gestionar tu rutina de suplementos, con alarmas, gamificación, catálogo y comunidad.

## Funcionalidades

- ✅ Registro de suplementos y horarios de toma
- ✅ Alarmas y seguimiento diario/semanal
- ✅ Ranking global por puntos y adherencia
- ✅ Reviews públicas y catálogo administrado
- ✅ Recomendaciones de IA según síntomas/objetivos

## Stack

- React Native + Expo
- Zustand para estado local
- Código generado inicialmente con Rork + adaptado manualmente

## Cómo ejecutarlo

```bash
npm install
npm start
```

Este comando instala las dependencias y levanta el servidor de Expo.

### Variables de entorno

Crea un archivo `.env` con las siguientes claves:

```bash
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=tuApiKey
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tuDominio.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tuProyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tuBucket.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
EXPO_PUBLIC_OPENAI_KEY=sk-xxxx # o OPENAI_API_KEY
EXPO_PUBLIC_ADMIN_UID=tuUidDeAdmin
```

`EXPO_PUBLIC_ADMIN_UID` debe contener el UID de Firebase del usuario que tendrá acceso al panel de administración.

### Backend (Hono + tRPC)

```bash
bun run backend/hono.ts
```

### Arrancar la app

```bash
npm start
```
