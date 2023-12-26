import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  userSub: { type: String, required: true },
});

export const UserModel = mongoose.model("User", UserSchema);

// These methods below should be abstracted in the controllers, but for now this file is gonna do just fine.
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email: email})
export const getUserById = (id: string) => UserModel.findById(id)
export const getUserBySub = (sub: string) => UserModel.findOne({userSub: sub})
export const createUser = async (values: { email: string; userSub: string }) => {
  try {
    const user = await new UserModel(values).save();
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id})



// Key Point: Only use Google ID token sub field as identifier for the user as it is unique among all Google Accounts and never reused. You should store the sub field and associate it with the user in your account management system. While you can use the email address from the ID token to check if the user has a existing account, don't use email address as an identifier because a Google Account can have multiple email addresses at different points in time.