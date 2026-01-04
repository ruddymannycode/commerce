import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

/**
 * HTTP POST Handler for Forgot Password
 * Endpoint: /api/auth/forgot-password
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email } = await req.json();

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Security Tip: Even if user doesn't exist, we usually return a success 
      // message to prevent "User Enumeration" attacks.
      return NextResponse.json(
        { message: "If an account exists with this email, we have sent a reset code." },
        { status: 200 }
      );
    }

    // 2. Generate a static Reset OTP for development
    // In production: Math.floor(100000 + Math.random() * 900000).toString();
    const resetCode = "123456";

    // 3. Store OTP in database with an expiration (e.g., 15 minutes)
    // We update existing reset OTPs for this email if they exist
    await Otp.findOneAndUpdate(
      { email, type: "reset" },
      { code: resetCode, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
      { upsert: true, new: true }
    );

    /**
     * NOTE: In production, send this via email.
     */
    console.log(`[AUTH] Password Reset Code for ${email}: ${resetCode}`);

    return NextResponse.json(
      { message: "Reset code sent to your email." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "Server error during request" },
      { status: 500 }
    );
  }
}
