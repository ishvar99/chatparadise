var socket=io();
socket.on('connect',function(){
	console.log('connected to server!');
	socket.emit('createMessage',{
		to:'Harry',
		text:'hi'
	})
});
socket.on('newMessage',function(message){
   console.log('message recieved to client',message);
})
socket.on('disconnect',function(){
	console.log('disconnected from server!')
})