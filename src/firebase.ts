import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCm2e2gU4Et233PkyVTbESxiEKZmStbWfY",
    authDomain: "hikerheven.firebaseapp.com",
    projectId: "hikerheven",
    storageBucket: "hikerheven.appspot.com",
    messagingSenderId: "930929718331",
    appId: "1:930929718331:web:525cb4e061d416f943581e",
    measurementId: "G-MV756E0ZX7"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)