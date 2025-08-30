/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
// import { UserRoutes } from "./app/modules/user/user.route";

import cors from "cors";
import { router } from "./app/routes";
import { success } from "zod";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewars/globalErrorHandlers";
import httpStatus from "http-status-codes";
import { notFound } from "./app/errorHelpers/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";

const app = express();



app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use(cookieParser())

// app.use("/api/v1/user", UserRoutes);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to PH Tour Server");
});


// app.use((err: any, req: Request, res: Response, next: NextFunction) => {

//   res.status(500).json({ 
//     success: false,
//     message: "Something went wrong",
//     err,
//     stack: envVars.NODE_ENV === "development" ? err.stack : null
// });
// })
app.use(globalErrorHandler);


// 
// app.use((req: Request, res: Response, ) => {


//   res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: "Not Found",
//   });
// });


app.use(notFound);

export default app;
