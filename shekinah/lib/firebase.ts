
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuración de Firebase para Shekinah Motor's
const firebaseConfig = {
  apiKey: "AIzaSyC7qoUnPUHmOs0gcTz4qGx1aBc2hMtpDSk",
  authDomain: "shekinah-a3bd1.firebaseapp.com",
  projectId: "shekinah-a3bd1",
  storageBucket: "shekinah-a3bd1.firebasestorage.app",
  messagingSenderId: "896854306534",
  appId: "1:896854306534:web:fb3ed352fe39cc294fd527",
  measurementId: "G-3QN6B8WSP9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics de forma segura (evita crash si hay adblockers)
let analytics;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(err => {
  console.warn("Firebase Analytics no soportado o bloqueado:", err);
});

// Exportar SOLO servicios esenciales: Base de Datos y Autenticación
// Eliminamos 'storage' para evitar errores de facturación/CORS
export const db = getFirestore(app);
export const auth = getAuth(app);
export { analytics };
