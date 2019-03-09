class Users{
constructor(){
   this.users=[];
}
addUser(id,name,room){
    var user={id,name,room};
    this.users.push(user);
    return user;
}
getUser(id){
	var user=this.users.filter((user)=>user.id===id)[0];
	return user;
}
removeUser(id){
	var user=this.getUser(id);
	if(user){
	this.users=this.users.filter((user)=>user.id!==id);
}
return user;
}
getUsersList(room){
	var usersList=this.users.filter((user)=>user.room===room);
	var namesList=usersList.map((user)=>user.name);
	return namesList;
}
}
module.exports={Users};