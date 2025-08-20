import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const { isStrongPassword } = validator;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: [true, "UserName is Required"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "This Email Is Not Match Try Another One"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    select: false,
    validate: {
      validator: function (value) {
        return isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message:
        "Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol",
    },
  },
  confirmPassword: {
    type: String,
    required: [true, "password is Required"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "The passwords are not the same",
    },
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  passwordChangedAt: Date,
});

// In the new Versions of mongo there is not need to use next() and put as a parameter
UserSchema.pre("save", async function (/*next*/) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  // next() => //! There is not need anymore
});

// Function To Check If the Password Changed Or Not
UserSchema.methods.isPasswordChanged = function (jwtTimeStamp) {
  if (!this.passwordChangedAt) return false;
  return +this.passwordChangedAt.getTime() > jwtTimeStamp * 1000;
};

UserSchema.methods.comparePasswords = async function (password, dbPassword) {
  return await bcrypt.compare(password, dbPassword);
};

const User = model("User", UserSchema);

export default User;
