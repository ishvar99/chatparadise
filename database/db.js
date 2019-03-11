const db =require('mongoose');
db.connect("mongodb://localhost/chat_app",{ useNewUrlParser: true });
module.exports=db;