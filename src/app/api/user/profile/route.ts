import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

/**
 * --- GET PROFILE API ---
 * Fetches the currently logged-in user's profile data.
 */
export async function GET() {
  try {
    // 1. Authenticate user from session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // 2. Fetch user details by ID from session
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch Profile Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/**
 * --- UPDATE PROFILE API ---
 * Updates user details like name, bio, and image.
 */
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, phoneNumber, image } = await req.json();

    await connectToDatabase();

    // 3. Find and Update the user
    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      {
        $set: {
          name,
          bio,
          phoneNumber,
          image,
        },
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
