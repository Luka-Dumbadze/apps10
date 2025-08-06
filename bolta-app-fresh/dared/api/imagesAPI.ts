import { db, storage } from "@/firebaseConfig";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function uploadImageAsync(uri: string, userId: string, folder: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `${folder}/${filename}`);
  
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef); 
  }

