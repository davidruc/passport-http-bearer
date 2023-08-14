import dotenv from "dotenv";
import express from "express";
import appUsers from "./routes/permisos.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/permisos", appUsers);

const config = JSON.parse(process.env.MY_SERVER);
app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
})
