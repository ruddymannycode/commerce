import mongoose, { Schema, Document } from "mongoose";

/**
 * --- TS INTERFACE vs MONGOOSE SCHEMA ---
 * 1. IUser Interface: This is for TypeScript. It allows us to access user properties 
 *    (like user.name) with full autocomplete and type-checking in our code.
 *    It extends 'Document' so it includes MongoDB properties like _id.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  isVerified: boolean;
  // --- NEW FIELDS FOR SETTINGS MODULE ---
  image?: string; // URL to profile picture
  phoneNumber?: string;
  bio?: string;
  preferences: {
    notificationsEnabled: boolean;
    darkMode: boolean; // Persisted preference
    newsletterSubscribed: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 2. UserSchema: This is for MongoDB. It tells the database what rules to follow
 *    when saving data (validation, defaults, etc.).
 */
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, 
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // --- NEW SCHEMA FIELDS ---
    image: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    bio: { type: String, default: "" },
    preferences: {
      notificationsEnabled: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
      newsletterSubscribed: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true, 
  }
);

/**
 * --- MODEL OVERWRITE PROTECTION ---
 * In Next.js Development, components reload frequently. 
 * If we just ran 'mongoose.model("User", UserSchema)', Mongoose would throw an 
 * error saying "Model already exists" because it tries to re-compile it.
 * 
 * Logic: Use the existing model if it exists, otherwise create a new one.
 */
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
