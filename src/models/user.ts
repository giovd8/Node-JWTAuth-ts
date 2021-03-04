import { Document, Schema, Model, model, Error } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
}

export const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String }
});

// uso una fuction normale per avere una reference dell'user
// pre = before to save the user on DB it execute the function
userSchema.pre<IUser>("save", function save(next) {
  const user = this;
  // crypt password
  bcrypt.hash(this.password, 0, (err: Error, hashedPassword: string) => {
    if (err) {
      return next(err);
    }
    user.password = hashedPassword;
    next();
  })

});

export const User: Model<IUser> = model<IUser>("User", userSchema);