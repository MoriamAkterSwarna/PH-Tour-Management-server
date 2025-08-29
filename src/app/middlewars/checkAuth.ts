/* eslint-disable @typescript-eslint/no-namespace */
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./../Interfaces/index.d";

// declare global {
//   namespace Express {
//     interface Request {
//       user: JwtPayload;
//     }
//   }
// }

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.headers.authorization || req.headers.Authorization;
      if (!accessToken) {
        throw new AppError(401, "Unauthorized");
      }

      const verifiedToken = verifyToken(
        accessToken as string,
        envVars.JWT_SECRET
      ) as JwtPayload;

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
      console.log(verifiedToken);
      req.user = verifiedToken;

      next();
    } catch (error) {
      console.log("jwt token error", error);
      next(error);
    }
  };
