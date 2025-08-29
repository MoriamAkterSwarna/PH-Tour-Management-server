/* eslint-disable @typescript-eslint/no-unused-vars */
import  jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: JwtPayload, secret:string, expiresIn:string )=> {
 const token = jwt.sign(payload, secret, { expiresIn: expiresIn }as SignOptions);
 return token;
};

export const verifyToken = (token:string, secret:string) => {
 try {
   const verifyToken = jwt.verify(token, secret) 
   return verifyToken;
 } catch (error) {
   throw new Error("Invalid token", );
 }
};
