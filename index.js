import dotenv from "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/db/connection.js";



const startServer=async()=>{
    try{
        await connectDB();
        const PORT=process.env.PORT || 3000;
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(error){
        console.error("Error starting server:", error);
    }
};
startServer();

export default app;