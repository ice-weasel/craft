import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
var admin = require("firebase-admin");


//Thanks to this guy
//https://github.com/firebase/firebase-admin-node/issues/2111#issuecomment-1636441596

console.log("Initializing Firebase Admin...");

const adminAppConfig = {
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};


let adminApp : any;
try {
  if (getApps().length === 0) {
    adminApp = initializeApp(adminAppConfig);
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  // Initialize with default app name if the first attempt fails
  adminApp = admin.initializeApp(adminAppConfig);
}



      const adminauth = getAuth(adminApp);
    const db = getFirestore(adminApp);


export const verifyToken = async (token: string) => {
  console.log("Verifying token...",token);
  try {

    const decodedToken = await adminauth.verifyIdToken(token);
    const { uid } = decodedToken;

    console.log("Token verified successfully:", decodedToken);
    return {
      uid,
      verified: true,
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { uid: "", Name: "", verified: false };
  }
};



export default adminApp

export { adminauth,db };
