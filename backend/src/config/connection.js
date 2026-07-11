const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let sqliteDb = null;
let firestoreDb = null;

function getDatabase() {
  if (!sqliteDb) {
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'sukhira.db');
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('synchronous = NORMAL');
    sqliteDb.pragma('foreign_keys = ON');

    const { initSchema } = require('../db/schema');
    initSchema(sqliteDb);
  }
  return sqliteDb;
}

function getFirestoreDb() {
  if (!firestoreDb) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      try {
        const appsList = getApps();
        if (appsList.length === 0) {
          initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: privateKey.replace(/\\n/g, '\n')
            })
          });
        }
        firestoreDb = getFirestore();
        console.log('[Firestore Connection] Connected successfully to Cloud Firestore.');
      } catch (err) {
        console.error('[Firestore Connection] Failed to initialize Firestore SDK:', err.message);
      }
    }
  }
  return firestoreDb;
}

module.exports = {
  getDatabase,
  getFirestoreDb
};
