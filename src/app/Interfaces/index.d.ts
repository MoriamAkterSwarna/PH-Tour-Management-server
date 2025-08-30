import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
// import { Request } from "express";
// import { JwtPayload } from "jsonwebtoken";
// export interface AuthenticatedRequest extends Request {
//   user?: JwtPayload;
// }