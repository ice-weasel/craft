import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";

var admin = require("firebase-admin");

//Thanks to this guy
//https://github.com/firebase/firebase-admin-node/issues/2111#issuecomment-1636441596

const usedApps = getApps();
const adminAppConfig = {
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    // The private key needs to be replaced with newlines
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ),
  }),
};

const adminApp =
  usedApps.length === 0
    ? initializeApp(adminAppConfig, "admin-app")
    : usedApps[0];

export default adminApp;
