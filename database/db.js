const mongoose =require('mongoose');
const connectDB = async () => {
 try {
   const conn = await mongoose.connect(
    process.env.DATABASEURL||"mongodb://localhost/chat_app",
     {
       useNewUrlParser: true,
       useCreateIndex: true,
       useFindAndModify: true
     }
   )
   console.log(`MongoDB Connected ${conn.connection.host}`)
 } catch (err) {
   console.log("MongoDB Connection Failed")
   console.log(`${err}`)
 }
}
module.exports = connectDB