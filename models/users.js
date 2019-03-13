const mongoose=require('mongoose');
var userSchema=new mongoose.Schema({
    id:String,
    name:String,
    room:String,
    gender:String,
    message:String,
    url:String,
    isLink:{
      type:Boolean,
      default:false
    },
    createdAt:Number
});
module.exports=mongoose.model('user',userSchema);
