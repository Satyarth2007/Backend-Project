import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

/*
--> jwt is a bearer token --> 
*/

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,   // used to make any field searchable
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,  // cloudinary ka url use krenge like AWS
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
    ],
    password: {
        type: String,
        required: [true, "Password is Required"],
    },
    refreshToken: {
        type: String,
    }
},
    {
        timestamps: true
    }
)


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


// user defined function. It does not come with userSchema
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            // used for set the expiery
            expiresIn: process.env.ACCESS_TOKEN_EXPIERY
        }
    )
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            // used for set the expiery
            expiresIn: process.env.REFRESH_TOKEN_EXPIERY
        }
    )
}


export const User = mongoose.model("User", userSchema)