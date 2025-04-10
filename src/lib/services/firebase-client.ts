import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Upload file with progress tracking
export const uploadFileWithProgress = (
  file: File,
  folderPath: string,
  fileName: string,
  onProgress: (progress: number) => void,
  onError: (error: Error) => void,
  onSuccess: (url: string, path: string) => void
) => {
  if (!file) return null;

  // Create file path
  const extension = file.name.split('.').pop();
  const fullPath = `${folderPath}/${fileName}.${extension}`;
  const storageRef = ref(storage, fullPath);
  
  // Upload file
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  // Track progress
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      onProgress(progress);
    },
    (error) => {
      console.error('Error uploading file:', error);
      onError(error);
    },
    () => {
      // Upload complete, get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        onSuccess(downloadURL, fullPath);
      });
    }
  );
  
  return uploadTask;
};

// Upload abstract file
export const uploadAbstractFile = (
  file: File,
  abstractCode: string,
  onProgress: (progress: number) => void,
  onError: (error: Error) => void,
  onSuccess: (url: string, path: string) => void
) => {
  return uploadFileWithProgress(
    file,
    'abstracts',
    `abstract-${abstractCode}`,
    onProgress,
    onError,
    onSuccess
  );
};

export default storage;