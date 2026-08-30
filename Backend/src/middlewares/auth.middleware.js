import jwt from 'jsonwebtoken'
import tokenBlacklistModel from '../models/blacklist.model.js'

async function authUser(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({
            message: "Please Login Again"
        })
    }

    const tokenIsBalcklisted = await tokenBlacklistModel.findOne({ token })
    if (tokenIsBalcklisted) {
        return res.status(400).json({
            message: "Please Login Again"
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(400).json({
            message: "Invalid Token"
        })

    }

}

export default { authUser }