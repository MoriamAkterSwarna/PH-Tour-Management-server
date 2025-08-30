import { Types } from "mongoose";

export enum Role{
    USER = "USER",
    ADMIN = "ADMIN",
    GUIDE = "GUIDE",
    SUPERADMIN = "SUPERADMIN"

}

/* 
* auth providers 

 - email, password,
 - google authentication


 */



 export interface IAuthProvider{
    // provider: string;  // google, credential
    provider: "google" | "credentials";  // google, credential
    providerId: string;
 }
export enum IsActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password ?: string;
    phone ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: string;
    isActive ?: IsActive;
    isVerified ?: boolean;
    role: Role,
    auths: IAuthProvider[];
    bookings ? : Types.ObjectId[];
    guides ? : Types.ObjectId[];

}