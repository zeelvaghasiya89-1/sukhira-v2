const { getDatabase, getFirestoreDb } = require('../config/connection');

async function getAdminByUsername(username) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('admin_users').doc(username.toLowerCase());
      const doc = await docRef.get();
      if (doc.exists) {
        return { ...doc.data(), id: doc.id };
      }
      return null;
    } catch (err) {
      console.error('Firestore getAdminByUsername error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ?');
  return stmt.get(username);
}

async function createAdmin(username, email, passwordHash, role = 'admin') {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('admin_users').doc(username.toLowerCase());
      await docRef.set({
        username: username.toLowerCase(),
        email,
        password_hash: passwordHash,
        role,
        created_at: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error('Firestore createAdmin error:', err.message);
      throw err;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO admin_users (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(username, email, passwordHash, role);
}

async function updateAdminPassword(id, passwordHash) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('admin_users').doc(String(id).toLowerCase());
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update({ password_hash: passwordHash });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Firestore updateAdminPassword error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?');
  return stmt.run(passwordHash, id);
}

module.exports = {
  getAdminByUsername,
  createAdmin,
  updateAdminPassword
};
