import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';

var admin = require("firebase-admin")
var serviceAccount = require("../../craft-9429a-firebase-adminsdk-5jobn-30946753c4.json");
const adminApp = initializeApp({
  credential: admin.credential.cert(serviceAccount),
}, "admin-app"); // Unique app name

export default adminApp
