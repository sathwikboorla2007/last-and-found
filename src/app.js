import express from "express";
import userRouter from "./routes/user.route.js";

import app from "../index.js";

app.use(express.json());
app.get("/",(req,res)=>{
    res.send("hello");
})
app.listen(3000,()=>{
    console.log("app is listening");
});
app.use("/api/users",userRouter);

export default app;