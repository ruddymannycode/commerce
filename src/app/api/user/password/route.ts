import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

/**
 * --- UPDATE PASSWORD API ---
 * Handles secure password changes from the settings page.
 */
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    await connectToDatabase();

    // 1. Fetch user including the hidden password field
    const user = await User.findById(session.userId).select("+password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    /**
     * 2. SECURITY CHECK
     * Must verify that the user knows their regular password before 
     * they can create a new one.
     */
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
    }

    // 3. HASH AND SAVE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Password Update Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
