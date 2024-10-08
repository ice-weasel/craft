import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';

var admin = require("firebase-admin")
var serviceAccount = require("../../craft-9429a-firebase-adminsdk-5jobn-30946753c4.json")

//Thanks to this guy
//https://github.com/firebase/firebase-admin-node/issues/2111#issuecomment-1636441596

const usedApps = getApps();
const adminAppConfig ={
  credential: admin.credential.cert(serviceAccount)
}

const adminApp = usedApps.length === 0
? initializeApp(adminAppConfig,"admin-app")
: usedApps[0]


export default adminApp
