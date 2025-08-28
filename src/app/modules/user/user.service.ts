/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"

const createUser = async (payload: Partial<IUser>) => {
    const {  email,password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST,"User already exists");
    }

    // hash password 

    const hashPassword = await bcryptjs.hash(password as string, 10);
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

export const UserService = {
    createUser,
    getUsers,
};