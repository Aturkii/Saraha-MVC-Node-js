import express from 'express';
import userRouter from './src/modules/user/user.routes.js';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import messageRouter from './src/modules/messages/message.routes.js';
import connectDB from './db/connection.js';
import path from "path";
import cors from "cors";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;
const Mongo = connectMongoDBSession(session);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), "public")));
app.set("views", path.join(path.resolve(), "views"));
app.set("view engine", "ejs");
  

connectDB();

const store = new Mongo({
  uri: 'mongodb://localhost:27017/saraha-app',
  collection: 'mySessions',
});

app.use(session({
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: false,
  store,
}));

app.use("/user", userRouter);
app.use("/message", messageRouter);

app.use('*', (req, res) => res.status(404).json("404 page not found"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
