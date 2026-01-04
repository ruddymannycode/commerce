import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

/**
 * --- UPDATE SETTINGS/PREFERENCES API ---
 * This endpoint handles toggling user preferences like Dark Mode 
 * or Notifications.
 */
export async function PATCH(req: Request) {
  try {
    // 1. Check if user is logged in
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { preferences } = await req.json();

    await connectToDatabase();

    /**
     * 2. PARTIAL UPDATE
     * We use the '$set' operator with dot notation (e.g., 'preferences.darkMode')
     * to update ONLY the specific sub-fields without overwriting the whole object.
     */
    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      {
        $set: {
          "preferences.notificationsEnabled": preferences.notificationsEnabled,
          "preferences.darkMode": preferences.darkMode,
          "preferences.newsletterSubscribed": preferences.newsletterSubscribed,
        },
      },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Settings updated successfully", 
      preferences: updatedUser.preferences 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
