import express from 'express';
import { Router } from 'express';
import userModel from "../models/user.model.js";
const authRouter = express.Router()
import authController from '../controllers/auth.controller.js';
import authMidddleware from "../middlewares/auth.middleware.js"

/**
 * @routes POST register user
 * @description register a new user using name ,email,password
 * @access public
 */
authRouter.post("/register", authController.registerUserController)

/**
 * @routes POST login The User
 *  @description Register a new user using name,email,password
 * @access public
 */
authRouter.post("/login", authController.loginUserController)
/**
 * @routes POST logout The User
 *  @description Clear Cookie
 *  * @access public
 */
authRouter.post("/logout", authController.logoutUserController)
/**
 * @routes POST get the User detail
 *  @description get user
 *  * @access private
 */
authRouter.get("/get-me", authMidddleware.authUser, authController.getMeController)

export default authRouter
 