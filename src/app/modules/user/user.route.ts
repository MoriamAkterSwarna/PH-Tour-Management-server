/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
// import z, { jwt } from "zod";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import AnyZodObject from "zod";
import { validateRequest } from "../../middlewars/validateRequest";

import AppError from "../../errorHelpers/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
import { envVars } from "../../config/env";
import { verifyToken } from "../../utils/jwt";
import { checkAuth } from "../../middlewars/checkAuth";

// const validateRequest = (zodSchema : AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {

//    try{
//     // console.log("old body", req.body);
//      req.body = await zodSchema.parseAsync(req.body);
//     // console.log("new body", req.body);
//     next();
//    } catch (error) {
//      next(error)
//    }

// };

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

router.get(
  "/all-users",
  // checkAuth("ADMIN", "SUPERADMIN"),
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  UserController.getAllUsers
);

router.patch("/:id", validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)), UserController.updateUser);

export const UserRoutes = router;
