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


export { app };