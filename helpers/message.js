const moment =require('moment');
var generateMessage=(from,text,avatar,gender)=>{
	return {
		from,
		text,
      avatar,
      gender,
		createdAt:moment().valueOf()
	}
}
var generateLocationMessage=(from,latitude,longitude,avatar,gender)=>{
	var url=`https://www.google.com/maps?q=${latitude},${longitude}`;
   return {
   	from,
   	url,
      avatar,
      gender,
   	createdAt:moment().valueOf()
   }
}
var generateLinkMessage=(from,text,avatar,gender)=>{
   return {
   	from,
   	text,
      avatar,
      gender,
   	createdAt:moment().valueOf()
   }
}
var generateImageMessage=(from,imageURL,avatar,gender)=>{
   return {
      from,
      imageURL,
      avatar,
      gender,
      createdAt:moment().valueOf()
   }
}
module.exports={generateMessage,generateLocationMessage,generateLinkMessage,generateImageMessage};