import UserRepository from "../../DB/repositories/user.repository.js";
import {
  BadRequestError,
  ConflictError,
} from "../../utils/Error/exceptions.js";
import { asymmDecryption } from "../../utils/index.js";

export const getProfileService = (user) => {
  if (user.phoneNumber) {
    user.phoneNumber = asymmDecryption(user.phoneNumber);
  }
  return user;
};
export const updateProfileService = async (user, newFields) => {
  const { _id } = user;
  console.log(_id);

  const { firstName, lastName, email, phoneNumber, gender } = newFields;
  if (email) {
    const existingUser = await UserRepository.findOne({ email });

    if (existingUser && String(existingUser._id) !== String(_id)) {
      throw new ConflictError("email already taken , use another one");
    }
  }
  return UserRepository.findByIdAndUpdate(_id, newFields);
};

export const getAllUsersService = async () => {
  const users = await UserRepository.find();

  return users;
};
export const uploadProfileImg = async (user, img) => {
  if (!img || !img.path) throw BadRequestError("Image file is required");
  return UserRepository.findByIdAndUpdate(user._id, { profileImg: img });
};
