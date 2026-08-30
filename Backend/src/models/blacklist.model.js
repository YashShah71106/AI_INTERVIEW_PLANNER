import mongoose from "mongoose"

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token Is Required To Be A Part Of Blacklist"]
    }
}, { timestamps: true })

const tokenBlacklistModel = mongoose.model("tokenBlacklist", blacklistTokenSchema)

export default tokenBlacklistModel