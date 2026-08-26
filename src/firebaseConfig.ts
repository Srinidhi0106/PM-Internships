// Type-safe and resilient Firebase config exported directly for application modules
import configJson from '../firebase-applet-config.json';

export interface FirebaseAppletConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId?: string;
  recaptchaSiteKey?: string;
}

export const firebaseAppConfig: FirebaseAppletConfig = {
  projectId: configJson?.projectId || 'driven-galaxy-zds98',
  appId: configJson?.appId || '1:322176603132:web:754257c0510ae8977b1879',
  apiKey: configJson?.apiKey || 'AIzaSyAH5HsujV0J6u5WwOK0LyjoAvcT9rdpvEI',
  authDomain: configJson?.authDomain || 'driven-galaxy-zds98.firebaseapp.com',
  firestoreDatabaseId: configJson?.firestoreDatabaseId || 'ai-studio-pmschemesmartaie-198325e8-d42e-4533-9e28-86893f7da287',
  storageBucket: configJson?.storageBucket || 'driven-galaxy-zds98.firebasestorage.app',
  messagingSenderId: configJson?.messagingSenderId || '322176603132',
  measurementId: configJson?.measurementId || '',
  recaptchaSiteKey: configJson?.recaptchaSiteKey || ''
};

export default firebaseAppConfig;
