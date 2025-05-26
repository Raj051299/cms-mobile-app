import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDtT0NatNNfQJUmQjMf1LvxkJISjXnUAUY",
  authDomain: "cardinia-mens-shed-app.firebaseapp.com",
  projectId: "cardinia-mens-shed-app",
  storageBucket: "cardinia-mens-shed-app.firebasestorage.app",
  messagingSenderId: "440286269148",
  appId: "1:440286269148:web:7131f0850afb9d0b062e19",
  measurementId: "G-1EGRKFC7J6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { db, storage };
