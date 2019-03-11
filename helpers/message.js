const moment =require('moment');
const person=require('../models/users')
var generateMessage=(from,text,color)=>{
	return {
		from,
		text,
		createdAt:moment().valueOf()
	}
}
var generateLocationMessage=(from,latitude,longitude)=>{
	var url=`https://www.google.com/maps?q=${latitude},${longitude}`;
   return {
   	from,
   	url,
   	createdAt:moment().valueOf()
   }
}
module.exports={generateMessage,generateLocationMessage};