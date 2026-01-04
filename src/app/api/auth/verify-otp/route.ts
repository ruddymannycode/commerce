import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

/**
 * HTTP POST Handler for OTP Verification
 * Endpoint: /api/auth/verify-otp
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, code } = await req.json();

    // 1. Find valid OTP record
    const otpRecord = await Otp.findOne({
      email,
      code,
      type: "verification",
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // 2. Check if OTP is expired (though the TTL index should handle this, 
    // we do an extra check for safety)
    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { message: "Verification code has expired" },
        { status: 400 }
      );
    }

    // 3. Update user as verified
    await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    );

    // 4. Delete the OTP record after successful use
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json(
      { message: "Account verified successfully. You can now login." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "Server error during verification" },
      { status: 500 }
    );
  }
}
