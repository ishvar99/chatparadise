const mongoose=require('mongoose');
var userSchema=new mongoose.Schema({
	name:{
		type:String,
		unique:true
	},
	gender:String
});
module.exports=mongoose.model('user',userSchema);