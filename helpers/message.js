const moment =require('moment');
var generateMessage=(from,text)=>{
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
var generateLinkMessage=(from,text)=>{
   return {
   	from,
   	text,
   	createdAt:moment().valueOf()
   }
}
module.exports={generateMessage,generateLocationMessage,generateLinkMessage};