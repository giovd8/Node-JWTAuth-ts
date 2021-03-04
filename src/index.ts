import express from "express";
import mongoose from "mongoose";
import { HomeRoutes } from "./routes/home";
import { AuthRoutes } from "./routes/auth";
import "dotenv/config";
// import { PORT, MONGODB_URI } from "./utils/keys";
mongoose.Promise = Promise;

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
  }
  //make sync mongo() call
  public async init() {
    try {
      this.config();
      this.routes();
      await this.mongo();
      return Promise.resolve();
    }
    catch (err: any) {
      return Promise.reject(err);
    }
  }

  public config(): void {
    // TODO fix import env var from utils/keys
    // this.app.set("port", PORT || 3000);
    this.app.set("port", process.env.PORT || 3000);
    // is neccessary for manage json request
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    // this.app.use(compression());
    // this.app.use(cors());
  }
  // get all routes
  public routes(): void {
    this.app.use("/home", new HomeRoutes().router);
    this.app.use("/auth", new AuthRoutes().router);
  }
  // connect to mongo, and make it sync with callback
  private async mongo() {
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Mongo Connection Established");
      return Promise.resolve();
    }
    catch (err: any) {
      console.log(`Mongo Connection ERROR: ${err}`);
      return Promise.reject(err);
    }
  }
  // start server
  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(`Server start at http://localhost:${this.app.get("port")}`);
    });
  }
}
// auto execute function
(async () => {
  try {
    const server = new Server();
    await server.init()
    server.start();
  }
  catch (err: any) {
    console.log(`Server failed to start, with error: ${err}`);
  }
})()


