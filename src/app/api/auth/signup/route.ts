import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

/**
 * --- WHAT IS AN API ROUTE? ---
 * In Next.js App Router, files named 'route.ts' inside the 'app/api' folder
 * become backend endpoints.
 * 
 * This POST function is triggered when the frontend sends a POST request 
 * to '/api/auth/signup'.
 */
export async function POST(req: Request) {
  try {
    // 1. DATABASE HANDSHAKE
    // We must connect to the DB on every request. Our 'lib/db.ts' makes sure 
    // we reuse the same connection if it's already open.
    await connectToDatabase();

    /**
     * 2. DATA EXTRACTION
     * 'req.json()' is a Promise because reading the request body is an 
     * asynchronous I/O operation.
     */
    const { name, email, password, role } = await req.json();

    // 3. DUPLICATE CHECK
    // Database queries take time, so we use 'await'.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      /**
       * STATUS 400: Bad Request. 
       * We use this for validation errors or issues caused by user input.
       */
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 400 }
      );
    }

    /**
     * 4. PASSWORD SECURITY (HASHING)
     * We NEVER store plain text passwords. bcrypt.hash() creates a one-way 
     * scramble. Even if a hacker steals the database, they cannot read 
     * users' original passwords.
     * saltRounds (10): Complexity of the scramble. higher = slower/safer.
     */
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. DATA PERSIESTENCE
    // Saving the new user to our MongoDB collection.
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' if role isn't provided
      isVerified: false, 
    });

    /**
     * 6. OTP LOGIC (Verification)
     * For development, we use '123456'. 
     * In the real world, this would be a random 6-digit number.
     */
    const otpCode = "123456";

    // 7. STORE OTP TEMPORARILY
    // We save the OTP code in its own collection with an expiration timer.
    await Otp.create({
      email,
      code: otpCode,
      type: "verification",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Valid for 10 minutes
    });

    console.log(`[AUTH] Static OTP Set for ${email}: ${otpCode}`);

    /**
     * 8. SUCCESS RESPONSE
     * STATUS 201: Created. 
     * Specific for successful creation requests.
     */
    return NextResponse.json(
      { 
        message: "User registered successfully. Please verify your email.",
        userId: newUser._id 
      },
      { status: 201 }
    );

  } catch (error: any) {
    /**
     * ERROR HANDLING
     * If anything crashes (DB down, network error), the catch block runs.
     * We log the error on the server and return a 500 (Internal Server Error).
     */
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Server error during registration", error: error.message },
      { status: 500 }
    );
  }
}
