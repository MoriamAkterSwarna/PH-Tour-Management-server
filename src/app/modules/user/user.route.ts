/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Router } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { createUserZodSchema } from "./user.validation";
import AnyZodObject from "zod";
import { validateRequest } from "../../middlewars/validateRequest";


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
  "/register",validateRequest(createUserZodSchema),
  UserController.createUser
);




router.get("/all-users", UserController.getAllUsers);

export const UserRoutes = router;