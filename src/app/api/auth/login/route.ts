import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

/**
 * --- LOGIN FLOW EXPLANATION ---
 * 1. Validate Input (Email/Password exists) 
 * 2. Find User in DB.
 * 3. Check Verification Status.
 * 4. Compare Passwords (stored hash vs input).
 * 5. Issue JWT (Session Ticket).
 * 6. Set Secure Cookie.
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    /**
     * 1. THE SEARCH
     * We use '.select("+password")' because we set 'select: false' in the Model.
     * Without this, 'user.password' would be empty!
     */
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" }, // Security: Don't specify which one is wrong
        { status: 401 } // 401: Unauthorized
      );
    }

    // 2. VERIFICATION CHECK
    // If the user hasn't entered their OTP yet, we block login.
    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in", unverified: true },
        { status: 403 } // 403: Forbidden
      );
    }

    /**
     * 3. PASSWORD COMPARISON
     * bcrypt.compare() takes the plain password and the stored hash, 
     * scrambles the plain one, and see if they match.
     */
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    /**
     * 4. SESSION MANAGEMENT (JWT)
     * JWT (JSON Web Token) is like a digital ID card.
     * It contains user info (userId, role) signed with our SECRET.
     * The browser sends this back on every request to prove who you are.
     */
    const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_keep_it_safe";
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } // User stays logged in for 24 hours
    );

    /**
     * 5. COOKIE SECURITY
     * We don't save the token in 'localStorage' because it's vulnerable to 
     * hacker scripts (XSS). We use an HTTP-Only Cookie instead.
     */
    const response = NextResponse.json(
      { 
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true, // IMPORTANT: JavaScript cannot read this cookie.
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production.
      sameSite: "strict", // Browser will only send this cookie to our domain.
      maxAge: 60 * 60 * 24, // Matches JWT expiration (1 day)
      path: "/", // Cookie is valid for the whole website.
    });

    return response;

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Server error during login" },
      { status: 500 }
    );
  }
}
