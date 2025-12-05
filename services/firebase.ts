import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnsephF3A6KtWg-KXupAvF-sFGE7zVpD0",
  authDomain: "my-project-c518b.firebaseapp.com",
  projectId: "my-project-c518b",
  storageBucket: "my-project-c518b.firebasestorage.app",
  messagingSenderId: "354984251840",
  appId: "1:354984251840:web:e36fa52d95b25d2d24b825"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
