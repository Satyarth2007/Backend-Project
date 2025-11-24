import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    //  **** _ is written in place of res. Because response is not used anywhere
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            throw new ApiError(401, "unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            // TODO :-->discuss about frontend for next lecture
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user //Adds the user object to the request, so any next middleware or controller can access:
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid Access Token")
    }
})
