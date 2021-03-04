import { Router } from 'express';
import { AuthController } from '../controllers/authController';

export class AuthRoutes {
  router: Router = Router();
  authController: AuthController = new AuthController();

  constructor() {
    this.router.post("/register", this.authController.registerUser);
    this.router.post("/login", this.authController.loginUser);
  }




  // // TODO externalfile for this middleware auth
  // // TODO extend Request interface
  // authenticateToken(req: any, res: Response, next: NextFunction) {
  //   // Gather the jwt access token from the request header
  //   try {
  //     const authHeader = req.headers.authorization
  //     const token = authHeader && authHeader.split(' ')[1]
  //     const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  //     req.user = user;
  //     next()
  //   }
  //   catch (e: any) {
  //     next(e);
  //   }
  // }
}