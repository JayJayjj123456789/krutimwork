import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyC3sPjZsLXf9gNiWSVzdAkZ4aaWoFl2r4E',
  authDomain: 'krutimwork.firebaseapp.com',
  projectId: 'krutimwork',
  storageBucket: 'krutimwork.firebasestorage.app',
  messagingSenderId: '229065292016',
  appId: '1:229065292016:web:2fe6befdff135c68e02a35',
  measurementId: 'G-628VVD7RKB',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
