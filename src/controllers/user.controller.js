import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


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

    const existedUser = User.findOne({
        // OPERATORS
        $or: [{ username }, { email }]
    })
    

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registring user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser,"User registered Successfully")
    )

})

export { registerUser }