/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const {  email,password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST,"User already exists");
    }

    // hash password 

    const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS));
    // console.log(password, hashPassword);

    const isPasswordMatch = await bcryptjs.compare(password as string, hashPassword);
    // console.log(isPasswordMatch);

    const authProvider = {
        provider: "credentials",
        providerId: email as string,
    };

    const user = await User.create({
        email,
        auths: [authProvider],
        password: hashPassword,
        ...rest
    });

    return user;
};

const getUsers = async () => {
    const users = await User.find();
    const totalUsers = await User.countDocuments();
    return { users, totalUsers };
};

const updateUser= async (userId: string, payload: Partial<IUser>, decodedToken:JwtPayload) => {

    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // if(isUserExist.isDeleted || isUserExist.isActive === IsActive.BLOCKED) {
    //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    // }

    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE ){

            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if(payload.role === Role.SUPERADMIN && decodedToken.role === Role.ADMIN){
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to create super admin");
    }
    }
    if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE ){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password as string, Number(envVars.BCRYPT_SALT_ROUNDS));
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
}

export const UserService = {
    createUser,
    getUsers,
    updateUser,
};