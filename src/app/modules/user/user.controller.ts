/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
// import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
// import AppError from "../../errorHelpers/AppError";

// type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// const catchAsync = (fn: AsyncHandler) => {
//   return (req: Request, res: Response, next: NextFunction) => {

    
//     Promise.resolve(fn(req, res, next)).catch((err: any) => {
//       console.log(err);
//       next(err);
//     });
//   };
// };

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserService.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: user
  });
});

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("Testing error handling middleware");


//     // const { name, email } = req.body;
//     // const user = await User.create({
//     //   name,
//     //   email,
//     // });

// // throw new AppError(httpStatus.BAD_REQUEST, "Fake user data");

//     const user = await UserService.createUser(req.body);

//     res.status(httpStatus.CREATED).json({message: "User created successfully", user});
//   } catch (error: any) {
//     // console.log(error);
//     // res.status(httpStatus.BAD_REQUEST).json({ error: error.message });

//     next(error);
//   }
// };

// const getAllUsers= async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await UserService.getUsers();
//     res.status(httpStatus.OK).json({ success: true,message:"All users data retrieved successfully", data: users });

//     // return users;
//   } catch (error: any) {
//     next(error);
//   }
// };

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await UserService.getUsers();
  // res.status(httpStatus.OK).json({ success: true,message:"All users data retrieved successfully", data: users });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: users.data,
    meta: users.meta,
  });
});

export const UserController = {
  createUser,
  getAllUsers
};


/* *
 route matching => controller => service=> model => DB
 */

/* 
function => try catch => request,response function
 */