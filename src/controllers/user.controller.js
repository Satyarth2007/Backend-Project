import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    //      STEPS TO REGISTER USER
    //STEP-1 --> get user details user from frontend
    //STEP-1A --> ACCESS THE FILE OF AVATAR AND COVERIMAGE THROUGH MULTER CODE WRITTEN IN MIDDLEWARE. AND USE IT IN USER.ROUTE.JS FILE OF ROUTES DIRECTORY
    //STEP-2 --> Validation of user input eg :-> not empty
    //STEP-3 --> check if user already exist : check using email, username
    //STEP-4 --> check for images, check for avatar
    //STEP-5 --> upload them cloudinary, avatar checking
    //STEP-6 --> Create user object ---> create entry in DB
    //STEP-7 --> remove password and refresh token field from response
    //STEP-8 --> Check for user creation
    //STEP-9 --> return response

    // STEP --> 1
    const { fullName, email, username, password } = req.body

    /*

    if (fullName === "") {
        throw new ApiError(400,"fullname is required")
    }
    if (email === "") {
        throw new ApiError(400,"email is required")
    }
    if (username === "") {
        throw new ApiError(400,"username is required")
    }
    if (password === "") {
        throw new ApiError(400,"password is required")
    }

    // GIVEN IF CONDITION IS ALSO SAME AS IT IS
    */

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required !")
    }

    const existedUser = await User.findOne({
        // OPERATORS
        $or: [{ username }, { email }]
    })


    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    // console.log(req.files);
    //          ******  the process given below is called Optional Chaining
    const avatarLocalPath = req.files?.avatar[0]?.path

    // this checks if the coverImage is uploaded or not 
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registring user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {
    /*
        TODOS :-->
            1. req.body se data access kro {username,password, email input field}
            2. check username and email exist or not
            3.  passowrd check
            4. access and refresh token generate
            5. sending request to server for login using cookies
     */

    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // this way we can send cookies
    const options = {
        /*
        1. Cookies can be modified from frontend also
        2. to stop this we use "httpOnly" & "secure" 
        3. By this way, cookies can be changed from server only. Not from frontend
        */
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)  //"key",value,options
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                //accessToken , refreshToken ko islie send kr rhe h kyuki agr user ko kuch bhi save krna ho tho kr le 
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In successfully"
            )
        )

})


const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out "))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const inComingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!inComingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (inComingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or Used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken: newRefreshToken
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

})

export { registerUser, loginUser, logOutUser, refreshAccessToken }