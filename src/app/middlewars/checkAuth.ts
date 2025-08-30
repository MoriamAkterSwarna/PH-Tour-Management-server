/* eslint-disable @typescript-eslint/no-namespace */
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { NextFunction, Response, Request } from "express";
// import { AuthenticatedRequest } from "./../Interfaces/index.d";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

import httpStatus from "http-status-codes";



declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(401, "Unauthorized");
      }

      const verifiedToken = verifyToken(
        accessToken as string,
        envVars.JWT_SECRET
      ) as JwtPayload;

      // Check if the user's role is in the allowed roles
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to access this route");
      }

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
      }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          `User is ${isUserExist.isActive}`
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to access this route");
      }

      //   if(!verifiedToken){
      //     console.log(verifiedToken);
      //     throw new AppError(401, "Unauthorized");
      //   }

      //   if((verifiedToken as JwtPayload).role  !== Role.ADMIN ){

      //     throw new AppError(403, "Forbidden");

      //   }
      //   console.log(verifiedToken);

      // if (authRoles.includes(verifiedToken.role)) {
      //   throw new AppError(403, "Forbidden");
      // }
      req.user = verifiedToken;
      console.log(verifiedToken);

      next();
    } catch (error) {
      console.log("jwt token error", error);
      next(error);
    }
  };
