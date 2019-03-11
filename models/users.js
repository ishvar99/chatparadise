const mongoose=require('mongoose');
var userSchema=new mongoose.Schema({
    id:{
    	type:String
    },
    name:{
    	type:String,
    	unique:true
    },
    room:{
    	type:String
    },
    gender:String,
    messages:[
    {
       text:{
       	type:String
       },
       createdAt:{
       	type:Date,
        default:new Date().getTime()
       }
   }
    ]
});
module.exports=mongoose.model('user',userSchema);
