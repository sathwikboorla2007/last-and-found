import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
require("dotenv").config();

const uri=process.env.MONGO_URI;
mongoose.connect(uri)
.then(()=>{
    console.log("mongo db connected");
})
.catch((error)=>{
    console.log("failed to connect mongo db");
    console.log(error);
})