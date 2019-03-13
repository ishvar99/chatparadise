const db =require('mongoose');
mongoose.connect(process.env.DATABASEURL||"mongodb://localhost/yelp_camp",{useNewUrlParser: true});
module.exports=db;