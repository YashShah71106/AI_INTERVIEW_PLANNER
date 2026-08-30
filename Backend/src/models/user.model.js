import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "UserName Is Required"],
        unique: [true, "UserName Must Be Unique"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: [true, "Email Must Be Unique"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"]

    }
})

const userModel = mongoose.model("users", userSchema)

export default userModel