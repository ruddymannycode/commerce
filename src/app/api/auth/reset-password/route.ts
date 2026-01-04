import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

/**
 * HTTP POST Handler for Reset Password
 * Endpoint: /api/auth/reset-password
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, code, newPassword } = await req.json();

    // 1. Verify the Reset OTP
    const otpRecord = await Otp.findOne({
      email,
      code,
      type: "reset",
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired reset code" },
        { status: 400 }
      );
    }

    // 2. Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update the user password
    await User.findOneAndUpdate(
      { email },
      { password: hashedNewPassword }
    );

    // 4. Clean up: Delete the OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json(
      { message: "Password updated successfully. You can now login." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { message: "Server error during password reset" },
      { status: 500 }
    );
  }
}
