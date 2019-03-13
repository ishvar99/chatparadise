const db =require('mongoose');
db.connect(process.env.DATABASEURL||"mongodb://localhost/chat_app",{useNewUrlParser: true});
module.exports=db;