import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";
import adminApp from "@/app/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method not allowed
  }

  const { idToken, uid } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken" });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = req.cookies.session;

    if (sessionCookie) {
      try {
        await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
        console.log("Session cookie is valid. Skipping generation.");
        return res.status(200).json({ success: true, message: "Session cookie valid." });
      } catch (error) {
        console.log("Invalid or expired session cookie. Generating a new one...");
      }
    }

    // Verify the ID token and set custom claims if needed
    const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
    const existingClaims = decodedToken.role;
    if (!existingClaims) {
      await getAuth(adminApp).setCustomUserClaims(uid, { role: "admin", uid });
    }

    // Generate a new session cookie
    const newSessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });
    console.log("New session cookie generated successfully");

    // Set the new cookie in the response header
    res.setHeader(
      "Set-Cookie",
      `session=${newSessionCookie}; Max-Age=${expiresIn / 1000}; HttpOnly; Secure; Path=/`
    );
    console.log("New session cookie set in response");

    res.status(200).json({ success: true, idToken: newSessionCookie });
  } catch (error) {
    console.error("Error generating session cookie:", error);
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
}
