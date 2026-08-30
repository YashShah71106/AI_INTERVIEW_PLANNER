import app from './src/app.js'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'
    


dotenv.config()

const PORT = process.env.PORT || 5000


connectDB()






app.listen(PORT, () => {
    try {
        console.log("The Server Is Running On Port 3000", Date());

    } catch (error) {
        console.error(error)
    }

})
