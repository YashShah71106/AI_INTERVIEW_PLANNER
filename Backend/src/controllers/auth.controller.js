import userModel from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import tokenBlacklistModel from "../models/blacklist.model.js";


/**
 * @name POST register a user
 * @description register a new user using name ,password,email
 * @access public   
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All Fields Are Required",
            success: false
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })
    const passwordHash = await bcrypt.hash(password, 10)

    if (isUserAlreadyExist) {
        return res.status(201).json({
            message: "User Already Exist On This Email Or Username",
            user: {
                username,
                email,
                password
            }
        })
    }


    const user = await userModel.create({
        username,
        email,
        password: passwordHash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token)

    res.status(201).json({
        message: "User Created Successfully",
        success: true,
        user: {
            username,
            email,
            passwordHash,
            token
        }
    })
}

/**
 * @name Login The User
 * @discription login The User Wth Email,password
 * @access public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    console.log("LOGIN EMAIL:", email)
    console.log("USER FOUND:", user)

    if (!user) {
        return res.status(400).json({
            message: "Invalid Email Or Password",
            success: false
        })
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid Password",
            success: false
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token)

    res.status(201).json({
        message: "User Login Successfully",
        user,
        token
    })

}
/**
 * @name getMeController
 * @discription Get The Detail Of Current User Who Logged In
 * @access private
*/
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }
    res.clearCookie("token")
    res.status(200).json({
        message: "User Logout Successfully"
    })

}

/**
 * @name getMeController
 * @discription Get The Detail Of Current User Who Logged In
 * @access private
 */

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User Detail Fetch Successfully,",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export default { registerUserController, loginUserController, logoutUserController, getMeController }