const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { getDatabase, getFirestoreDb } = require('../src/config/connection');

async function resetPassword() {
  const newPassword = 'admin123'; // Default secure reset password
  console.log(`Hashing new password: "${newPassword}"...`);
  
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  console.log(`Generated bcrypt hash: ${hash}`);

  // 1. Update SQLite Database
  try {
    const sdb = getDatabase();
    const checkUser = sdb.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');
    
    if (checkUser) {
      const stmt = sdb.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?');
      stmt.run(hash, 'admin');
      console.log('✓ Successfully reset admin password in local SQLite database.');
    } else {
      // Seed user if missing
      const stmt = sdb.prepare('INSERT INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, ?)');
      stmt.run('admin', 'admin@sukhira.com', hash, 'admin');
      console.log('✓ Successfully seeded admin user in local SQLite database.');
    }
  } catch (e) {
    console.error('SQLite reset password error:', e.message);
  }

  // 2. Update Cloud Firestore
  try {
    const fdb = getFirestoreDb();
    if (fdb) {
      const docRef = fdb.collection('admin_users').doc('admin');
      const doc = await docRef.get();
      
      if (doc.exists) {
        await docRef.update({ password_hash: hash });
        console.log('✓ Successfully reset admin password in Cloud Firestore.');
      } else {
        // Seed user if missing
        await docRef.set({
          username: 'admin',
          email: 'admin@sukhira.com',
          password_hash: hash,
          role: 'admin',
          created_at: new Date().toISOString()
        });
        console.log('✓ Successfully seeded admin user in Cloud Firestore.');
      }
    } else {
      console.log('ℹ Cloud Firestore credentials not loaded. Skipping Firestore reset.');
    }
  } catch (e) {
    console.error('Cloud Firestore reset password error:', e.message);
  }

  console.log(`\nPassword reset complete! Login credentials:`);
  console.log(`Username: admin`);
  console.log(`Password: ${newPassword}`);
  process.exit(0);
}

resetPassword();
