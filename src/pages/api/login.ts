import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";
import  adminApp  from "@/app/firebaseAdmin";  // Ensure correct import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken" });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
  console.log("Token received, generating session cookie...");

  try {
    const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });
    console.log("Session cookie generated successfully");

    res.setHeader(
      "Set-Cookie",
      `session=${sessionCookie}; Max-Age=${expiresIn}; HttpOnly; Secure; Path=/`
    );
    console.log("Session cookie set in response");

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error generating session cookie:", error);
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
}
