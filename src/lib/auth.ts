import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * --- SESSION VERIFICATION UTILITY ---
 * This helper function extracts the JWT token from the browser cookies
 * and verifies it using our secret key.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_keep_it_safe";
    
    /**
     * jwt.verify checks if the token was signed by our secret and if it 
     * hasn't expired yet.
     */
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };

    return decoded;
  } catch (error) {
    // If the token is invalid or expired, we return null.
    return null;
  }
}
