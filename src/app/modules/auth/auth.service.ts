/* eslint-disable @typescript-eslint/no-unused-vars */

import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import httpStatus  from "http-status-codes";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });

  if (!isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch)
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_ACCESS_TOKEN_EXPIRES_IN);

  // const {password, ...rest} = isUserExist;
  return {
    // email: isUserExist.email, 

    accessToken,
  };
};



export const AuthServices = {
  credentialsLogin,
};
