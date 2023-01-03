import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/index.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);

app.listen(process.env.PORT || 4000, () =>
  console.log(`Servidor ouvindo em localhost:${process.env.PORT || 4000}`)
);
