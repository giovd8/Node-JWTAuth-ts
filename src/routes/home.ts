import { Router } from "express";
import { AuthController } from '../controllers/authController';

export class HomeRoutes {

    public router: Router;
    constructor() {
        this.router = Router();
        this.router.get("/", AuthController.checkAuthenticated, (req, res) => {
            res.send(`Hello ${req.user}`);
        });
    }
}