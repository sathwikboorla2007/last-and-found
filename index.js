import dotenv from "dotenv";
import app from "./src/app.js";
import "./src/db/connections.js";
const express= require("express");

app.use(express.json());
require("./src/db/connection.js");
export default app;