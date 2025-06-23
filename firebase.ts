// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAoHISJ_8mngPpO0vEVINayCH-0M-xLc4U",
    authDomain: "arab-test.firebaseapp.com",
    projectId: "arab-test",
    storageBucket: "arab-test.appspot.com",
    messagingSenderId: "448957608747",
    appId: "1:448957608747:web:0d8f83fb86025a589b8b6e",
    measurementId: "G-N1N0G43PHS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

import { ref, deleteObject } from "firebase/storage";

export const deleteFromFirebase = async (filePath: string) => {
    try {
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
        console.log(`✅ Deleted ${filePath} from Firebase`);
    } catch (err) {
        console.error(`❌ Error deleting ${filePath} from Firebase:`, err);
        throw err;
    }
};
