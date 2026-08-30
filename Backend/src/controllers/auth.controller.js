import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";


const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
};


/**
 * @name POST register a user
 * @description Register a new user
 * @access public
 */
async function registerUserController(req, res) {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All Fields Are Required",
                success: false
            });
        }


        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });


        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "User Already Exists On This Email Or Username",
                success: false
            });
        }


        const passwordHash = await bcrypt.hash(password, 10);


        const user = await userModel.create({
            username,
            email,
            password: passwordHash
        });


        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        // 🔥 Production cookie
        res.cookie("token", token, cookieOptions);


        return res.status(201).json({
            message: "User Created Successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}


/**
 * @name Login The User
 * @description Login user with email and password
 * @access public
 */
async function loginUserController(req, res) {

    try {

        const { email, password } = req.body;


        const user = await userModel.findOne({ email });

        console.log("LOGIN EMAIL:", email);
        console.log("USER FOUND:", !!user);


        if (!user) {
            return res.status(400).json({
                message: "Invalid Email Or Password",
                success: false
            });
        }


        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );


        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid Email Or Password",
                success: false
            });
        }


        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        // 🔥 Production cookie
        res.cookie("token", token, cookieOptions);


        return res.status(200).json({
            message: "User Login Successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}


/**
 * @name Logout User
 * @access private
 */
async function logoutUserController(req, res) {

    try {

        const token = req.cookies.token;


        if (token) {
            await tokenBlacklistModel.create({
                token
            });
        }


        // 🔥 Same cookie options while clearing
        res.clearCookie("token", cookieOptions);


        return res.status(200).json({
            message: "User Logout Successfully",
            success: true
        });

    } catch (error) {

        console.error("LOGOUT ERROR:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}


/**
 * @name getMeController
 * @description Get current logged-in user
 * @access private
 */
async function getMeController(req, res) {

    try {

        const user = await userModel.findById(req.user.id);


        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                success: false
            });
        }


        return res.status(200).json({
            message: "User Detail Fetch Successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.error("GET ME ERROR:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}


export default {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};