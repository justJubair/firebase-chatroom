const functions = require('firebase-functions');
const Filter = require('bad-words');
const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, updateDoc, getDoc, setDoc } = require('firebase/firestore');

initializeApp(); // Assuming you have already initialized Firebase in your project

const db = getFirestore();

exports.detectEvilUsers = functions.firestore
  .document('messages/{msgId}')
  .onCreate(async (snap, context) => {
    const filter = new Filter();
    const { text, uid } = snap.data();

    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      await updateDoc(doc(db, 'messages', snap.id), { text: `🤐 I got BANNED for life for saying... ${cleaned}` });

      await setDoc(doc(db, 'banned', uid), {});
    }

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (userData.msgCount >= 7) {
      await setDoc(doc(db, 'banned', uid), {});
    } else {
      await updateDoc(userRef, { msgCount: (userData.msgCount || 0) + 1 });
    }
  });
