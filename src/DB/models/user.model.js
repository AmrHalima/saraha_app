import mongoose from "mongoose";
import { GENDER, PROVIDERS, STATUS, USER_ROLES } from "../../utils/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "firstname must be 3 or more characters"],
      maxlength: [50, "firstname must be 3 or more characters"],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "firstname must be 3 or more characters"],
      maxlength: [50, "firstname must be 3 or more characters"],
    },
    email: {
      type: String,
      required: true,
      index: {
        name: "email_unique",
        unique: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: Number,
      enum: Object.values(GENDER),
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
    googleSub: {
      type: String,
      index: {
        name: "idx_googleSub_unique",
        unique: true,
      },
    },
    provider: {
      type: String,
      enum: Object.values(PROVIDERS),
      default: PROVIDERS.SYSTEM,
    },
    phoneNumber: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    loggedOutAllAt: {
      type: Date,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
  },
);
userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
