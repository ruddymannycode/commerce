import mongoose, { Schema, Document } from "mongoose";

/**
 * OTP Interface
 * Defines characters and timing for temporary verification codes.
 */
export interface IOtp extends Document {
  email: string;
  code: string;
  type: "verification" | "reset";
  expiresAt: Date;
}

/**
 * OTP Schema Definition
 */
const OtpSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["verification", "reset"],
    default: "verification",
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index: MongoDB will automatically delete the doc when expiresAt is reached
  },
});

const Otp = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
