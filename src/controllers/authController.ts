import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";


export class AuthController {

  constructor() { }

  static checkAuthenticated(req: any, res: any, next: any) {
    // if token JWT is not present on request header
    if (!req.header('authorization')) {
      return res.status(401).send({ message: 'Unauthorized, auth header missing.' });
    }
    const token = req.header('authorization').split(' ')[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET!)
    if (!payload) {
      return res.status(401).send({ message: 'Unauthorized, auth header missing.' });
    }
    req.user = payload;
    next();
  }

  static generateAccessToken(username: string): string {
    return jwt.sign(username, process.env.TOKEN_SECRET!);
  }

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    // encrypt pass before to save on DB
    // const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    try {
      await User.create({
        username: req.body.username,
        password: req.body.password,
        role: "user"
      });
      // generate token JWT for the new user
      const token = AuthController.generateAccessToken(req.body.username);
      res.status(200).send({ token: token });
    }
    catch (err: any) {
      next(err)
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findOne({
        username: req.body.username
      });
      if (!user) {
        throw ({ message: 'Invalid username or password.' });
      }
      const isMatch = bcrypt.compareSync(req.body.password, user!.password);
      if (!isMatch) {
        throw ({ message: 'Invalid username or password.' });
      }
      const token = AuthController.generateAccessToken(req.body.username);
      res.status(200).send({ token: token });
    }
    catch (err: any) {
      next(err);
    }
  }

  // loginUser(req: Request, res: Response, next: NextFunction) {
  //   passport.authenticate("local", function (err, user, info) {
  //     console.log("SON QUA DC")
  //     // no async/await because passport works only with callback ..
  //     if (err) return next(err);
  //     if (!user) {
  //       return res.status(401).json({ status: "error", code: "unauthorized" });
  //     } else {
  //       const token = jwt.sign({ username: user.username }, process.env.TOKEN_SECRET!);
  //       res.status(200).send({ token: token });
  //     }
  //   });
  // }
}