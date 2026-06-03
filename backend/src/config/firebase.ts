import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';

let _firestore: Firestore | null = null;

function getServiceAccount(): admin.ServiceAccount {
  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (envJson) return JSON.parse(envJson);
  try {
    return require('../../service-account.json');
  } catch {
    throw new Error(
      'Firebase service account not found. Set FIREBASE_SERVICE_ACCOUNT env var or place service-account.json in backend/'
    );
  }
}

export function initFirebase(): void {
  if (admin.apps.length > 0) return;
  const serviceAccount = getServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('[firebase] Admin SDK initialized');
}

export function getFirestore(): Firestore {
  initFirebase();
  if (!_firestore) {
    _firestore = admin.firestore();
    _firestore.settings({ ignoreUndefinedProperties: true });
    console.log('[firebase] Firestore instance created');
  }
  return _firestore;
}

export function getAuth(): admin.auth.Auth {
  initFirebase();
  return admin.auth();
}

export { admin };
