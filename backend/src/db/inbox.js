const { getDatabase, getFirestoreDb } = require('../config/connection');

async function createMessage({ name, email, subject, message }) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('contact_messages').doc();
      await docRef.set({
        id: docRef.id,
        name,
        email,
        subject,
        message,
        status: 'unread',
        created_at: new Date().toISOString()
      });
      return docRef.id;
    } catch (err) {
      console.error('Firestore createMessage error:', err.message);
      throw err;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(name, email, subject, message);
  return info.lastInsertRowid;
}

async function getAllMessages() {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const snapshot = await fdb.collection('contact_messages').orderBy('created_at', 'desc').get();
      const list = [];
      snapshot.forEach(doc => {
        list.push({ ...doc.data(), id: doc.id });
      });
      return list;
    } catch (err) {
      console.error('Firestore getAllMessages error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  return db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
}

async function getMessageById(id) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('contact_messages').doc(String(id));
      const doc = await docRef.get();
      if (doc.exists) {
        return { ...doc.data(), id: doc.id };
      }
      return null;
    } catch (err) {
      console.error('Firestore getMessageById error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  return db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(id);
}

async function updateMessageStatus(id, status) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('contact_messages').doc(String(id));
      await docRef.update({ status });
      return true;
    } catch (err) {
      console.error('Firestore updateMessageStatus error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run(status, id);
  return true;
}

async function deleteMessage(id) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('contact_messages').doc(String(id));
      await docRef.delete();
      return true;
    } catch (err) {
      console.error('Firestore deleteMessage error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
  return true;
}

async function addSubscriber(email) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const formattedEmail = email.toLowerCase();
      const docRef = fdb.collection('subscribers').doc(formattedEmail);
      const doc = await docRef.get();
      if (doc.exists) {
        return null;
      }
      await docRef.set({
        email: formattedEmail,
        id: `sub_${Date.now()}`,
        created_at: new Date().toISOString()
      });
      return formattedEmail;
    } catch (err) {
      console.error('Firestore addSubscriber error:', err.message);
      throw err;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  try {
    const stmt = db.prepare(`
      INSERT INTO subscribers (email)
      VALUES (?)
    `);
    const info = stmt.run(email);
    return info.lastInsertRowid;
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return null;
    }
    throw err;
  }
}

async function getAllSubscribers() {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const snapshot = await fdb.collection('subscribers').orderBy('created_at', 'desc').get();
      const list = [];
      snapshot.forEach(doc => {
        list.push({ ...doc.data(), id: doc.id });
      });
      return list;
    } catch (err) {
      console.error('Firestore getAllSubscribers error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  return db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC').all();
}

async function deleteSubscriber(id) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('subscribers').doc(String(id));
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.delete();
        return true;
      }
      
      const snapshot = await fdb.collection('subscribers').where('id', '==', String(id)).limit(1).get();
      if (!snapshot.empty) {
        await snapshot.docs[0].ref.delete();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Firestore deleteSubscriber error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  db.prepare('DELETE FROM subscribers WHERE id = ?').run(id);
  return true;
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  addSubscriber,
  getAllSubscribers,
  deleteSubscriber
};
