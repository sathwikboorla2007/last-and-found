import express from "express";
import userRouter from "./routes/user.route.js";

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.send("hello");
})
app.listen(3000,()=>{
    console.log("app is listening");
});
app.use("/api/v1/user",userRouter);

export default app;