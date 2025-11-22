// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from "./db/index.js"
import { app } from './app.js'

dotenv.config({ path: './.env' })

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Application is not able to connect ", error);
            throw error;
        })

        app.listen(process.env.PORT || 7000, () => {
            console.log(`Server is running at port ${process.env.PORT}`);

        })
    })
    .catch((err) => {
        console.log("MongoDB connection Failed : ", err);
    })


