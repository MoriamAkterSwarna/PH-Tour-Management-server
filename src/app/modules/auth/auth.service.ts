/* eslint-disable @typescript-eslint/no-unused-vars */

import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import { is } from "zod/locales";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });

  if (!isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Email not found");

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch)
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");

  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };
  // const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_ACCESS_TOKEN_EXPIRES_IN);

  // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_TOKEN_EXPIRES_IN);

  // delete isUserExist.password;

  const userTokens = createUserTokens(isUserExist);
  const { password: pass, ...rest } = isUserExist.toObject();

  // const {password, ...rest} = isUserExist;
  return {
    // email: isUserExist.email,

    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  // const verifiedRefreshToken = jwt.verify(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

  // const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  // if (!isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  // }
  // if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
  //   throw new AppError(httpStatus.UNAUTHORIZED, `User is ${isUserExist.isActive}`);

  // }
  // if(isUserExist.isDeleted){
  //   throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
  // }
  //   const jwtPayload = {
  //     userId: isUserExist._id,
  //     email: isUserExist.email,
  //     role: isUserExist.role,
  //   };
  //   const accessToken = generateToken(
  //     jwtPayload,
  //     envVars.JWT_SECRET,
  //     envVars.JWT_ACCESS_TOKEN_EXPIRES_IN
  //   );

  // const {password:pass, ...rest} = isUserExist.toObject();

  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  // Validate input parameters
  if (!oldPassword || !newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      !oldPassword ? "Old password is required" : "New password is required"
    );
  }

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (!user.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "User has no password set");
  }

  const isPasswordMatch = await bcryptjs.compare(oldPassword, user.password);

  if (isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  const saltRounds = Number(envVars.BCRYPT_SALT_ROUNDS || 10);
  if (isNaN(saltRounds)) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Invalid salt rounds configuration"
    );
  }

  user.password = await bcryptjs.hash(newPassword, saltRounds);

  await user.save();
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
