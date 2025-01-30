import adminApp , { adminauth,db } from "@/app/firebaseAdmin";


export async function getUserData(context: any) {
    const { req } = context;
    const sessionCookie = req.cookies["session"];
  
    if (!sessionCookie) {
      console.log("No session cookie found.");
      return {
        redirect: {
          destination: "/Login",
          permanent: false,
        },
      };
    }
  
    try {
      // Verify the session cookie
      const decodedToken = await adminauth.verifySessionCookie(sessionCookie, true);
      const { uid } = decodedToken;
  
      console.log("Decoded UID:", uid);
  
      // Fetch user data from Firestore
      const userDoc = await db.collection("Users").doc(uid).get();
  
      if (!userDoc.exists) {
        console.log(`No user document found for UID: ${uid}`);
      }
  
      const firestoreData = userDoc.data();
      console.log("Fetched Firestore Data:", firestoreData);
  
      const user = {
        uid,
        ...firestoreData,
        Name: firestoreData?.Name || "User",
        username: firestoreData?.username 
      };
  
      return {
        props: {
          user: JSON.parse(JSON.stringify(user)),
          uid,
        },
      };
    } catch (error) {
      console.error("Error in getUserData:", error);
      return {
        redirect: {
          destination: "/Login",
          permanent: false,
        },
      };
    }
  }