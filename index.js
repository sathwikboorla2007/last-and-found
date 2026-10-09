import dotenv from "dotenv";
import app from "./src/app.js";
import "./src/db/connections.js";
const express= require("express");
const app=express();
app.use(express.json());
require("./src/db/connection.js");
