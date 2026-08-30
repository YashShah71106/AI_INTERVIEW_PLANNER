import app from './src/app.js'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

// Connect MongoDB
connectDB()

// Start Server
app.listen(PORT, '0.0.0.0', () => {

    console.log(
        `The Server Is Running On Port ${PORT}`,
        new Date()
    )

})