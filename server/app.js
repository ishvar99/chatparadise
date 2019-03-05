const express=require('express'),
      path=require('path'),
      publicPath=path.join(__dirname,'../public'),
       app=express();
const port=process.env.PORT||3000;
app.use(express.static(publicPath));
app.listen(port,()=>{
	console.log(`Server is up on ${port}!`)
})