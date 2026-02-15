import { initFirebaseAdmin } from './import-music/firebaseAdmin';

async function seedAdmin() {
  const db = initFirebaseAdmin();
  const email = 'tenorioabs@gmail.com';

  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', email).get();

  if (snapshot.empty) {
    console.log(`User ${email} not found. Make sure the user has signed in at least once.`);
    process.exit(1);
  }

  const userDoc = snapshot.docs[0];
  await userDoc.ref.update({ role: 'admin' });
  console.log(`User ${userDoc.id} (${email}) has been set as admin.`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
