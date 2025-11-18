import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,    //Only allow the domain written in CORS_ORIGIN
    credentials: true       //Also allow cookies or tokens
}))

app.use(express.json({limit: '16kb'}))  // json data access limit tells the limit size of data.
app.use(express.urlencoded({extended: true, limit: '16kb'})) // access data from url
app.use(express.static('public'))
app.use(cookieParser()) // server se user kii cookie access krne aur cookie set krne ke lie use hota h



//  routes import
import userRouter from "./routes/user.routes.js"
//      --> userRouter :-> this name is taken randomly because we have exported this from the given file which is default export


// routes declarartion
/*
 - app.get() se hm routes bhi likh rhe the isi same page me
 - but router ko alag folder me likhne se usko app.get() se access nhi kia ja sakta.
 - routers ko access krne ke lie middleware ke jaisa  padta h 
 - eg: is given below
*/
app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users/register



export { app };