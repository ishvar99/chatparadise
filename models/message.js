const mongoose=require('mongoose');
var messageSchema=new mongoose.Schema({
    id:String,
    name:String,
    room:String,
    gender:String,
    message:String,
    avatar:String,
    url:String,
    isLink:{
      type:Boolean,
      default:false
    },
    createdAt:Number
});
module.exports=mongoose.model('message',messageSchema);
